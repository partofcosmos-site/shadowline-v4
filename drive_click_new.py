import asyncio
import json
import websockets
import base64

async def click_mouse():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        async def send_cmd(method, params=None):
            global mid
            mid += 1
            cur_id = mid
            req = {'id': cur_id, 'method': method}
            if params:
                req['params'] = params
            await ws.send(json.dumps(req))
            while True:
                msg = json.loads(await ws.recv())
                if msg.get('id') == cur_id:
                    return msg

        global mid
        mid = 0

        # Click at (40, 102) - location of "+ New" button
        print("Dispatching mouse press at 40, 102")
        await send_cmd('Input.dispatchMouseEvent', {
            'type': 'mousePressed',
            'x': 40,
            'y': 102,
            'button': 'left',
            'clickCount': 1
        })
        await asyncio.sleep(0.1)
        await send_cmd('Input.dispatchMouseEvent', {
            'type': 'mouseReleased',
            'x': 40,
            'y': 102,
            'button': 'left',
            'clickCount': 1
        })
        print("Mouse released")

        await asyncio.sleep(1.5)

        # Capture screenshot
        ss = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_after_new_click.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_after_new_click.png")

if __name__ == '__main__':
    asyncio.run(click_mouse())
