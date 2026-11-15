import asyncio
import json
import websockets
import base64

async def find_file_in_recent():
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

        # Navigate directly to https://drive.google.com/drive/u/0/recent
        print("Navigating to Recent files...")
        await call('Page.navigate', {'url': 'https://drive.google.com/drive/u/0/recent'})
        await asyncio.sleep(4.0)

        # Inspect elements to find the top recent file
        top_file = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const rows = Array.from(document.querySelectorAll('[role="row"], [role="gridcell"], div[data-target="doc"]'));
                    const target = rows.find(r => r.innerText && r.innerText.includes('SHADOWLINE_4.0_Defense_Slides.pdf'));
                    if (target) {
                        const rect = target.getBoundingClientRect();
                        return {
                            found: true,
                            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
                        };
                    }
                    return { found: false, count: rows.length };
                })()
            ''',
            'returnByValue': True
        })
        print("Top file check:", top_file['result']['result'])

        # Take screenshot of Recent
        ss = await call('Page.captureScreenshot', {'format': 'png'})
        with open(r'C:\Users\white\.gemini\antigravity\brain\496dd2ba-e920-4a59-95c0-ee228ff94a34\drive_recent.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_recent.png")

if __name__ == '__main__':
    asyncio.run(find_file_in_recent())
