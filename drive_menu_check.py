import asyncio
import json
import websockets
import base64

async def run():
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

        # Enable DOM and Page
        await send_cmd('Page.enable')
        await send_cmd('DOM.enable')

        # Click the "New" button
        res = await send_cmd('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
                    const b = btns.find(x => (x.innerText && x.innerText.trim() === 'New') || x.getAttribute('aria-label') === 'New');
                    if (b) {
                        b.click();
                        return "Clicked New successfully";
                    }
                    return "New not found";
                })()
            ''',
            'returnByValue': True
        })
        print("Click New:", res['result']['result'])

        await asyncio.sleep(2.0)

        # Inspect visible menu items
        menu_items = await send_cmd('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const elements = Array.from(document.querySelectorAll('[role="menuitem"], span, div'))
                        .map(e => e.innerText ? e.innerText.trim() : '')
                        .filter(t => t.includes('upload') || t.includes('Upload') || t.includes('File upload') || t.includes('Folder upload'));
                    return Array.from(new Set(elements));
                })()
            ''',
            'returnByValue': True
        })
        print("Found upload items:", menu_items['result']['result'])

        # Take screenshot of menu
        ss = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('drive_menu.png', 'wb') as f:
            f.write(base64.b64decode(ss['result']['data']))
        print("Saved drive_menu.png")

if __name__ == '__main__':
    asyncio.run(run())
