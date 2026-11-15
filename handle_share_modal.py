import asyncio
import json
import base64
import websockets

async def set_public_and_copy():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        # Check modal contents
        js_modal = '''(() => {
            const els = Array.from(document.querySelectorAll('[role="dialog"], [aria-label*="Share"], [role="menu"]'));
            // Look for "Copy link" button or Restricted dropdown
            const copyBtn = document.querySelector('[aria-label="Copy link"], button[aria-label*="Copy link" i], [data-tooltip="Copy link"]');
            const restrictedBtn = Array.from(document.querySelectorAll('*')).find(e => (e.innerText || '').trim() === 'Restricted');
            return {
                dialogCount: els.length,
                copyBtnFound: !!copyBtn,
                restrictedFound: !!restrictedBtn,
                modalText: els.length > 0 ? els[0].innerText.slice(0, 300) : 'none'
            };
        })()'''
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js_modal, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print('Modal check:', json.dumps(res, indent=2))

        # Screenshot dialog
        await ws.send(json.dumps({'id': 2, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
        res2 = json.loads(await ws.recv())
        with open('share_modal_active.png', 'wb') as f:
            f.write(base64.b64decode(res2['result']['data']))
        print('Saved share_modal_active.png')

asyncio.run(set_public_and_copy())
