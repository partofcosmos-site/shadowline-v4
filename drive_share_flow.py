import asyncio
import json
import websockets
import base64

async def get_share_link():
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

        # Click on the uploaded file in the snackbar: around (850, 970)
        print("Clicking uploaded file in the snackbar...")
        await call('Input.dispatchMouseEvent', {'type': 'mousePressed', 'x': 850, 'y': 970, 'button': 'left', 'clickCount': 1})
        await asyncio.sleep(0.05)
        await call('Input.dispatchMouseEvent', {'type': 'mouseReleased', 'x': 850, 'y': 970, 'button': 'left', 'clickCount': 1})

        await asyncio.sleep(2.0)

        # Check DOM to see what opened or what is focused
        ss = await call('Page.captureScreenshot', {'format': 'png'})
        with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_file_opened.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_file_opened.png")

if __name__ == '__main__':
    asyncio.run(get_share_link())
