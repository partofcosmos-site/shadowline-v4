import asyncio
import json
import websockets
import base64

async def get_link():
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

        # Close the Ask Gemini side panel by clicking the 'x' button at (1900, 98)
        print("Clicking X at (1900, 98)...")
        await call('Input.dispatchMouseEvent', {'type': 'mousePressed', 'x': 1900, 'y': 98, 'button': 'left', 'clickCount': 1})
        await asyncio.sleep(0.05)
        await call('Input.dispatchMouseEvent', {'type': 'mouseReleased', 'x': 1900, 'y': 98, 'button': 'left', 'clickCount': 1})

        await asyncio.sleep(1.5)

        # Take screenshot of Drive
        ss = await call('Page.captureScreenshot', {'format': 'png'})
        with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_closed_gemini.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_closed_gemini.png")

asyncio.run(get_link())
