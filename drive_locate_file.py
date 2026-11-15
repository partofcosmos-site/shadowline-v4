import asyncio
import json
import websockets
import base64

async def locate_file():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'

    async with websockets.connect(uri, max_size=20*1024*1024) as ws:
        async def call(method, params=None):
            global mid
            mid += 1
            cid = mid
            req = {'id': cid, 'method': method}
            if params: req['params'] = params
            await ws.send(json.dumps(req))
            while True:
                raw = await ws.recv()
                msg = json.loads(raw)
                if msg.get('id') == cid:
                    return msg
        global mid
        mid = 0

        # Find the row containing SHADOWLINE_4.0_Defense_Slides
        res = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const elements = Array.from(document.querySelectorAll('*'));
                    const targetEl = elements.find(el => el.innerText && el.innerText.includes('SHADOWLINE_4.0_Defense_Slides.pdf'));
                    if (targetEl) {
                        const rect = targetEl.getBoundingClientRect();
                        return {
                            found: true,
                            text: targetEl.innerText,
                            x: rect.x + rect.width / 2,
                            y: rect.y + rect.height / 2,
                            rect: rect
                        };
                    }
                    return { found: false };
                })()
            ''',
            'returnByValue': True
        })
        print("Target element position:", res['result']['result'])

        val = res['result']['result']['value']
        if val.get('found'):
            x = int(val['x'])
            y = int(val['y'])
            print(f"Right-clicking at ({x}, {y})...")
            # Right click to bring context menu
            await call('Input.dispatchMouseEvent', {'type': 'mousePressed', 'x': x, 'y': y, 'button': 'right', 'clickCount': 1})
            await asyncio.sleep(0.05)
            await call('Input.dispatchMouseEvent', {'type': 'mouseReleased', 'x': x, 'y': y, 'button': 'right', 'clickCount': 1})
            
            await asyncio.sleep(1.0)
            
            # Check context menu
            ss = await call('Page.captureScreenshot', {'format': 'png'})
            with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_context_menu.png', 'wb') as f:
                f.write(base64.b64decode(ss['result']['data']))
            print("Saved drive_context_menu.png")

asyncio.run(locate_file())
