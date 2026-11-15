import asyncio
import json
import base64
import websockets

async def click_share_preview():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        # Find all buttons in document
        js = '''(() => {
            const btns = Array.from(document.querySelectorAll('[role="button"], button, div[aria-label]'));
            return btns.map(b => ({
                aria: b.getAttribute('aria-label'),
                id: b.id,
                rect: b.getBoundingClientRect()
            })).filter(x => x.aria);
        })()'''
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print('All aria buttons:', json.dumps(res, indent=2))

        # Look specifically for Share or more actions
        js_click = '''(() => {
            const btn = document.querySelector('[aria-label="Share"], [aria-label*="Share"], [data-tooltip="Share"]');
            if (btn) {
                btn.click();
                return 'Clicked ' + btn.getAttribute('aria-label');
            }
            return 'Share button not found directly';
        })()'''
        await ws.send(json.dumps({'id': 2, 'method': 'Runtime.evaluate', 'params': {'expression': js_click, 'returnByValue': True}}))
        res2 = json.loads(await ws.recv())
        print('Click result:', res2)

        await asyncio.sleep(2)

        # Screenshot
        await ws.send(json.dumps({'id': 3, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
        res3 = json.loads(await ws.recv())
        with open('preview_share_clicked.png', 'wb') as f:
            f.write(base64.b64decode(res3['result']['data']))
        print('Saved preview_share_clicked.png')

asyncio.run(click_share_preview())
