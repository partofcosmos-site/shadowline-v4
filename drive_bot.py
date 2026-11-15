import asyncio
import json
import websockets
import base64
import os

async def upload_and_share():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        async def call(method, params=None):
            nonlocal req_id
            req_id += 1
            cid = req_id
            payload = {'id': cid, 'method': method}
            if params:
                payload['params'] = params
            await ws.send(json.dumps(payload))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get('id') == cid:
                    return resp

        req_id = 0
        
        # Take a screenshot first to see current drive state
        ss = await call('Page.captureScreenshot', {'format': 'png'})
        with open('drive_initial.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Captured initial Drive screenshot -> drive_initial.png")

        # Click the "New" button
        click_new = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
                    const newBtn = btns.find(b => (b.innerText && b.innerText.trim() === 'New') || b.getAttribute('aria-label') === 'New');
                    if (newBtn) {
                        newBtn.click();
                        return 'Clicked New';
                    }
                    return 'New button not found';
                })()
            ''',
            'returnByValue': True
        })
        print("Click New:", click_new)

        await asyncio.sleep(1.5)

        # Check menu items and check if file input appeared
        check_menu = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const items = Array.from(document.querySelectorAll('[role="menuitem"], [role="menu"] div, div[aria-label]'))
                        .map(el => el.innerText || el.getAttribute('aria-label'))
                        .filter(Boolean);
                    const fileInputs = document.querySelectorAll('input[type="file"]');
                    return {
                        items: items.slice(0, 15),
                        fileInputCount: fileInputs.length
                    };
                })()
            ''',
            'returnByValue': True
        })
        print("Menu state:", check_menu)

        # If file input is present now, set files
        if check_menu['result']['result']['value']['fileInputCount'] > 0:
            print("Found file input directly!")
        else:
            # Let's inspect DOM elements in the popup menu
            pass

asyncio.run(upload_and_share())
