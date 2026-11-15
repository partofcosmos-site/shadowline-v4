import asyncio
import json
import base64
import websockets
import urllib.request

async def dump_all_elements():
    with urllib.request.urlopen('http://127.0.0.1:9103/json') as r:
        tabs = json.loads(r.read())
    drive_tab = next(t for t in tabs if 'drive.google.com' in t.get('url', ''))
    uri = drive_tab['webSocketDebuggerUrl']

    async with websockets.connect(uri) as ws:
        # Check title and current URL
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '({ title: document.title, url: window.location.href, bodyTextLen: document.body.innerText.length })',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Page info:', res['result']['result']['value'])

        # Capture screenshot
        await ws.send(json.dumps({
            'id': 2,
            'method': 'Page.captureScreenshot',
            'params': {'format': 'png'}
        }))
        res2 = json.loads(await ws.recv())
        with open('drive_page_real.png', 'wb') as f:
            f.write(base64.b64decode(res2['result']['data']))
        print('Saved drive_page_real.png')

asyncio.run(dump_all_elements())
