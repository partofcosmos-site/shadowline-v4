import asyncio
import json
import base64
import websockets

async def capture():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri, max_size=20*1024*1024) as ws:
        # Check current URL and titles
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': 'window.location.href',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Current URL:', res)

        # Screenshot
        await ws.send(json.dumps({
            'id': 2,
            'method': 'Page.captureScreenshot',
            'params': {'format': 'png'}
        }))
        res = json.loads(await ws.recv())
        img_data = base64.b64decode(res['result']['data'])
        with open('current_drive_view.png', 'wb') as f:
            f.write(img_data)
        print('Saved current_drive_view.png')

if __name__ == '__main__':
    asyncio.run(capture())
