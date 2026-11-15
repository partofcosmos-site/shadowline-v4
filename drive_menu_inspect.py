import asyncio
import json
import websockets
import base64

async def upload_via_menu():
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

        # Click "+ New"
        print("1. Clicking + New at (40, 102)...")
        await call('Input.dispatchMouseEvent', {'type': 'mousePressed', 'x': 40, 'y': 102, 'button': 'left', 'clickCount': 1})
        await asyncio.sleep(0.05)
        await call('Input.dispatchMouseEvent', {'type': 'mouseReleased', 'x': 40, 'y': 102, 'button': 'left', 'clickCount': 1})

        await asyncio.sleep(1.0)

        # Check if input[type=file] is created now!
        res = await call('Runtime.evaluate', {
            'expression': 'document.querySelectorAll("input[type=file]").length'
        })
        print("Input count after clicking New:", res['result']['result'])

        # Let's inspect all inputs
        inputs_info = await call('Runtime.evaluate', {
            'expression': '''
                Array.from(document.querySelectorAll("input")).map(i => ({
                    type: i.type,
                    id: i.id,
                    className: i.className,
                    ariaLabel: i.getAttribute("aria-label")
                }))
            ''',
            'returnByValue': True
        })
        print("All inputs:", inputs_info['result']['result'])

        # Also let's inspect the elements under the popup menu
        menu_html = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const el = document.querySelector('[role="menu"]');
                    return el ? el.innerHTML : 'No menu role found';
                })()
            ''',
            'returnByValue': True
        })
        print("Menu role:", menu_html['result']['result'][:300] if menu_html['result']['result'] else None)

asyncio.run(upload_via_menu())
