import asyncio
import json
import base64
import websockets

FILE_ID = "1bZQml1CpykqXGY5Lj6wVbk-vl19Fpuls"

async def make_public():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        # Navigate to file preview or trigger share modal
        js_open_share = f'''(() => {{
            const row = document.querySelector('tr[data-id="{FILE_ID}"]');
            if (!row) return 'Row not found';
            row.click();
            // dispatch context menu or Alt+A or click more actions
            const moreBtn = row.querySelector('[aria-label*="More actions"]');
            if (moreBtn) {{
                moreBtn.click();
                return 'Clicked more actions';
            }}
            return 'Selected row';
        }})()'''
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js_open_share, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print('Open menu:', res)

        await asyncio.sleep(1)

        # Click Share in context menu
        js_click_share = '''(() => {
            const menuItems = Array.from(document.querySelectorAll('[role="menuitem"], div[role="menu"] div'));
            const shareItem = menuItems.find(i => (i.innerText || '').trim() === 'Share' || (i.innerText || '').startsWith('Share'));
            if (shareItem) {
                shareItem.click();
                return 'Clicked share item: ' + shareItem.innerText;
            }
            return 'Share menu item not found';
        })()'''
        await ws.send(json.dumps({'id': 2, 'method': 'Runtime.evaluate', 'params': {'expression': js_click_share, 'returnByValue': True}}))
        res2 = json.loads(await ws.recv())
        print('Share click:', res2)

        await asyncio.sleep(2)

        # Screenshot
        await ws.send(json.dumps({'id': 3, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
        res3 = json.loads(await ws.recv())
        with open('drive_share_step1.png', 'wb') as f:
            f.write(base64.b64decode(res3['result']['data']))
        print('Saved drive_share_step1.png')

asyncio.run(make_public())
