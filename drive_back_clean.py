import asyncio
import json
import websockets
import base64

async def back_to_drive():
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

        # Navigate back to https://drive.google.com/drive/u/0/my-drive
        print("Navigating to https://drive.google.com/drive/u/0/my-drive...")
        await call('Page.navigate', {'url': 'https://drive.google.com/drive/u/0/my-drive'})
        await asyncio.sleep(4.0)

        # Let's inspect the files list in My Drive
        files_res = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const rows = Array.from(document.querySelectorAll('[data-id], [role="row"], div[role="gridcell"]'));
                    const matches = [];
                    for (const r of rows) {
                        const id = r.getAttribute('data-id') || r.getAttribute('data-target-id');
                        const text = r.innerText || '';
                        if (id) {
                            matches.push({ id, text: text.slice(0, 50) });
                        }
                    }
                    return matches.slice(0, 30);
                })()
            ''',
            'returnByValue': True
        })
        print("DOM data-ids in My Drive:", files_res['result']['result'])

        # Take screenshot of clean My Drive
        ss = await call('Page.captureScreenshot', {'format': 'png'})
        with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_clean_my_drive.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_clean_my_drive.png")

asyncio.run(back_to_drive())
