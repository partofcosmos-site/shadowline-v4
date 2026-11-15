import asyncio
import json
import base64
import websockets
import urllib.request

async def nav_recent():
    with urllib.request.urlopen('http://127.0.0.1:9103/json') as r:
        tabs = json.loads(r.read())
    drive_tab = next(t for t in tabs if 'drive.google.com' in t.get('url', ''))
    uri = drive_tab['webSocketDebuggerUrl']

    async with websockets.connect(uri) as ws:
        # Navigate to recent
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Page.navigate',
            'params': {'url': 'https://drive.google.com/drive/u/0/recent'}
        }))
        await ws.recv()
        await asyncio.sleep(4)

        # Query all text items
        await ws.send(json.dumps({
            'id': 2,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '''(() => {
                    const items = Array.from(document.querySelectorAll('[data-id], [role="row"], [role="listitem"], [aria-label]'));
                    return items.map(el => ({
                        aria: el.getAttribute('aria-label'),
                        text: el.innerText ? el.innerText.slice(0, 100) : '',
                        rect: el.getBoundingClientRect()
                    })).filter(x => (x.aria && x.aria.includes('SHADOWLINE')) || (x.text && x.text.includes('SHADOWLINE')));
                })()''',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Matched items in recent:', json.dumps(res, indent=2))

        # Screenshot
        await ws.send(json.dumps({
            'id': 3,
            'method': 'Page.captureScreenshot',
            'params': {'format': 'png'}
        }))
        res = json.loads(await ws.recv())
        img_bytes = base64.b64decode(res['result']['data'])
        with open('drive_recent_view.png', 'wb') as f:
            f.write(img_bytes)
        print('Saved drive_recent_view.png')

asyncio.run(nav_recent())
