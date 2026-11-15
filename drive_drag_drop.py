import asyncio
import json
import websockets
import base64

async def drag_drop():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    target_file = r'C:\Users\white\Desktop\SHADOWLINE_4.0_Defense_Slides.pdf'

    with open(target_file, 'rb') as f:
        file_bytes = f.read()
    b64_data = base64.b64encode(file_bytes).decode('ascii')
    file_name = 'SHADOWLINE_4.0_Defense_Slides.pdf'

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

        # Inject simulated File drop via DataTransfer
        script = f'''
            (() => {{
                const byteCharacters = atob("{b64_data}");
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {{
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }}
                const byteArray = new Uint8Array(byteNumbers);
                const file = new File([byteArray], "{file_name}", {{ type: "application/pdf" }});

                const dt = new DataTransfer();
                dt.items.add(file);

                // Find main drop target in Drive
                const target = document.querySelector('c-wiz') || document.body;

                const dragenter = new DragEvent('dragenter', {{ dataTransfer: dt, bubbles: true, cancelable: true }});
                const dragover = new DragEvent('dragover', {{ dataTransfer: dt, bubbles: true, cancelable: true }});
                const drop = new DragEvent('drop', {{ dataTransfer: dt, bubbles: true, cancelable: true }});

                target.dispatchEvent(dragenter);
                target.dispatchEvent(dragover);
                target.dispatchEvent(drop);

                return "Simulated drop dispatched!";
            }})()
        '''

        print("Dispatching synthesized DataTransfer drop...")
        res = await call('Runtime.evaluate', {'expression': script, 'returnByValue': True})
        print("Drop evaluate result:", res['result']['result'])

        print("Waiting 5s to see if Drive upload snackbar appears...")
        await asyncio.sleep(5.0)

        ss = await call('Page.captureScreenshot', {'format': 'png'})
        with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_after_drop.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_after_drop.png")

if __name__ == '__main__':
    asyncio.run(drag_drop())
