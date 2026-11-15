import asyncio
import json
import websockets
import base64

async def upload():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    target_file = r'C:\Users\white\Desktop\SHADOWLINE_4.0_Defense_Slides.pdf'

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

        print("1. DOM.enable")
        await call('DOM.enable')
        
        print("2. Runtime.evaluate")
        res = await call('Runtime.evaluate', {
            'expression': 'document.querySelector("input[type=file]")'
        })
        print("Input evaluate:", res)
        obj_id = res['result']['result'].get('objectId')
        
        print("3. DOM.describeNode")
        desc = await call('DOM.describeNode', {'objectId': obj_id})
        print("DOM describeNode:", desc)
        backend_node_id = desc['result']['node']['backendNodeId']
        
        print("4. DOM.setFileInputFiles")
        set_res = await call('DOM.setFileInputFiles', {
            'files': [target_file],
            'backendNodeId': backend_node_id
        })
        print("DOM.setFileInputFiles result:", set_res)

        print("5. Dispatch events")
        ev_res = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const inp = document.querySelector("input[type=file]");
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));
                    return "Dispatched events";
                })()
            '''
        })
        print("Dispatch result:", ev_res)

        print("6. Waiting 5s for upload dialog...")
        await asyncio.sleep(5.0)

        ss = await call('Page.captureScreenshot', {'format': 'png'})
        with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_upload_status.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_upload_status.png")

if __name__ == '__main__':
    asyncio.run(upload())
