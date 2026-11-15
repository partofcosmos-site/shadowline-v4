import asyncio
import json
import base64
import websockets
import urllib.request

async def test_live():
    with urllib.request.urlopen('http://127.0.0.1:9103/json') as r:
        tabs = json.loads(r.read())
    # find any blank tab or newtab
    target = next((t for t in tabs if t.get('type') == 'page' and 'newtab' in t.get('url', '')), tabs[0])
    uri = target['webSocketDebuggerUrl']

    async with websockets.connect(uri) as ws:
        # Navigate to local file or raw
        url = 'https://partofcosmos-site.github.io/shadowline-v4/?t=' + str(asyncio.get_event_loop().time())
        await ws.send(json.dumps({'id': 1, 'method': 'Page.navigate', 'params': {'url': url}}))
        await ws.recv()
        await asyncio.sleep(4)

        # Evaluate console errors & webgl init
        await ws.send(json.dumps({
            'id': 2,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '({ title: document.title, threeLoaded: !!window.THREE, hasCanvas: !!document.querySelector("canvas") })',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Page status:', res['result']['result']['value'])

        # Capture screenshot
        await ws.send(json.dumps({'id': 3, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
        res3 = json.loads(await ws.recv())
        with open('live_verified_render.png', 'wb') as f:
            f.write(base64.b64decode(res3['result']['data']))
        print('Saved live_verified_render.png')

asyncio.run(test_live())
