import asyncio
import json
import base64
import websockets
import urllib.request

async def get_link():
    with urllib.request.urlopen('http://127.0.0.1:9103/json') as r:
        tabs = json.loads(r.read())
    drive_tab = next(t for t in tabs if 'drive.google.com' in t.get('url', ''))
    uri = drive_tab['webSocketDebuggerUrl']

    async with websockets.connect(uri) as ws:
        # 1. Click on SHADOWLINE_4.0_Defense_Slides.pdf row to select it
        js_select = '''(() => {
            const el = document.querySelector('[aria-label*="SHADOWLINE_4.0_Defense_Slides.pdf"]');
            if (!el) return 'Not found';
            el.scrollIntoView({ block: 'center' });
            const rect = el.getBoundingClientRect();
            // trigger focus and click
            el.click();
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        })()'''
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js_select, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print('Selected file:', res)

        await asyncio.sleep(1)

        # 2. Trigger keyboard shortcut '.' (share in Google Drive) or look for share button in top action bar
        js_share = '''(() => {
            // Find share button
            const shareBtn = document.querySelector('[aria-label*="Share"], [data-tooltip*="Share"], button[aria-label*="share" i]');
            if (shareBtn) {
                shareBtn.click();
                return 'Clicked shareBtn: ' + shareBtn.getAttribute('aria-label');
            }
            // Dispatch '.' key
            document.dispatchEvent(new KeyboardEvent('keydown', { key: '.', code: 'Period', keyCode: 190, which: 190, bubbles: true }));
            return 'Dispatched . key';
        })()'''
        await ws.send(json.dumps({'id': 2, 'method': 'Runtime.evaluate', 'params': {'expression': js_share, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print('Share action:', res)

        await asyncio.sleep(3)

        # 3. Screenshot modal
        await ws.send(json.dumps({
            'id': 3,
            'method': 'Page.captureScreenshot',
            'params': {'format': 'png'}
        }))
        res = json.loads(await ws.recv())
        img_bytes = base64.b64decode(res['result']['data'])
        with open('drive_share_dialog.png', 'wb') as f:
            f.write(img_bytes)
        print('Saved drive_share_dialog.png')

asyncio.run(get_link())
