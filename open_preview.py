import asyncio
import json
import base64
import websockets

FILE_ID = "1bZQml1CpykqXGY5Lj6wVbk-vl19Fpuls"

async def open_preview():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        # Navigate directly to file preview
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Page.navigate',
            'params': {'url': f'https://drive.google.com/file/d/{FILE_ID}/view'}
        }))
        await ws.recv()
        await asyncio.sleep(4)

        # Check title and buttons in preview
        await ws.send(json.dumps({
            'id': 2,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '''(() => {
                    const btns = Array.from(document.querySelectorAll('button, div[role="button"], [aria-label]'));
                    return btns.map(b => ({
                        aria: b.getAttribute('aria-label'),
                        tooltip: b.getAttribute('data-tooltip'),
                        text: b.innerText
                    })).filter(x => (x.aria && x.aria.toLowerCase().includes('share')) || (x.tooltip && x.tooltip.toLowerCase().includes('share')));
                })()''',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Share buttons in preview:', json.dumps(res, indent=2))

        # Screenshot
        await ws.send(json.dumps({'id': 3, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
        res3 = json.loads(await ws.recv())
        with open('drive_preview_opened.png', 'wb') as f:
            f.write(base64.b64decode(res3['result']['data']))
        print('Saved drive_preview_opened.png')

asyncio.run(open_preview())
