import asyncio
import json
import websockets
import base64
import os

async def upload_file_flow():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    target_file = r'C:\Users\white\Desktop\SHADOWLINE_4.0_Defense_Slides.pdf'
    
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

        # Enable Page and DOM
        await send_cmd('Page.enable')
        await send_cmd('DOM.enable')
        
        # Enable file chooser interception
        print("Setting Page.setInterceptFileChooser dialog...")
        fc_res = await send_cmd('Page.setInterceptFileChooser', {'enabled': True})
        print("InterceptFileChooser:", fc_res)

        # Click "File upload" at (60, 145)
        print("Clicking File upload at (60, 145)...")
        await send_cmd('Input.dispatchMouseEvent', {
            'type': 'mousePressed',
            'x': 60,
            'y': 145,
            'button': 'left',
            'clickCount': 1
        })
        await asyncio.sleep(0.05)
        await send_cmd('Input.dispatchMouseEvent', {
            'type': 'mouseReleased',
            'x': 60,
            'y': 145,
            'button': 'left',
            'clickCount': 1
        })

        # Listen for fileChooserOpened event or handle it
        print("Waiting for fileChooserOpened event...")
        for _ in range(10):
            try:
                raw = await asyncio.wait_for(ws.recv(), timeout=2.0)
                msg = json.loads(raw)
                print("Event received:", msg.get('method'))
                if msg.get('method') == 'Page.fileChooserOpened':
                    print("Page.fileChooserOpened detected! Intercepting and setting files...")
                    backendNodeId = msg['params'].get('backendNodeId')
                    # Set files via DOM.setFileInputFiles
                    sf = await send_cmd('DOM.setFileInputFiles', {
                        'files': [target_file],
                        'backendNodeId': backendNodeId
                    })
                    print("DOM.setFileInputFiles result:", sf)
                    break
            except asyncio.TimeoutError:
                print("Timeout waiting for event, checking if file input is in DOM...")
                break

        print("Waiting 5s for upload to start and progress...")
        await asyncio.sleep(5.0)

        # Capture screenshot
        ss = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_uploading.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_uploading.png")

if __name__ == '__main__':
    asyncio.run(upload_file_flow())
