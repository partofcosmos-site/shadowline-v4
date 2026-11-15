import asyncio
import json
import base64
import websockets
import urllib.request

async def capture():
    with urllib.request.urlopen('http://127.0.0.1:9103/json') as r:
        tabs = json.loads(r.read())
    drive_tab = next(t for t in tabs if 'drive.google.com' in t.get('url', ''))
    uri = drive_tab['webSocketDebuggerUrl']
    print('Connecting to:', uri)

    async with websockets.connect(uri) as ws:
        # 1. Inspect DOM elements containing SHADOWLINE
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '''(() => {
                    const els = Array.from(document.querySelectorAll('*')).filter(e => (e.innerText || '').includes('SHADOWLINE') && e.children.length === 0);
                    return els.map(e => ({
                        tag: e.tagName,
                        text: e.innerText,
                        aria: e.getAttribute('aria-label'),
                        rect: e.getBoundingClientRect()
                    }));
                })()''',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Elements matching SHADOWLINE:', json.dumps(res, indent=2))

        # Screenshot
        await ws.send(json.dumps({
            'id': 2,
            'method': 'Page.captureScreenshot',
            'params': {'format': 'png'}
        }))
        res = json.loads(await ws.recv())
        img_bytes = base64.b64decode(res['result']['data'])
        with open('drive_current_state.png', 'wb') as f:
            f.write(img_bytes)
        print('Saved drive_current_state.png')

asyncio.run(capture())
