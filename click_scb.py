import asyncio
import json
import base64
import websockets

async def click_scb_menu():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        # Click the scb-quick-actions-menu-button or trigger Share
        js = """
        (() => {
            const btn = document.getElementById('scb-quick-actions-menu-button') || document.querySelector('[aria-label="Quick sharing actions"]');
            if (btn) {
                btn.click();
                return 'Clicked quick actions button';
            }
            return 'Button not found';
        })()
        """
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print('Click quick actions:', res)

        await asyncio.sleep(1)

        # Look for "Copy link" or "Share"
        js_menu = """
        (() => {
            const items = Array.from(document.querySelectorAll('[role="menuitem"], div[role="menu"] *'));
            return items.map(i => i.innerText).filter(Boolean);
        })()
        """
        await ws.send(json.dumps({'id': 2, 'method': 'Runtime.evaluate', 'params': {'expression': js_menu, 'returnByValue': True}}))
        res2 = json.loads(await ws.recv())
        print('Quick actions menu items:', json.dumps(res2, indent=2))

        # Screenshot
        await ws.send(json.dumps({'id': 3, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
        res3 = json.loads(await ws.recv())
        with open('quick_actions_state.png', 'wb') as f:
            f.write(base64.b64decode(res3['result']['data']))
        print('Saved quick_actions_state.png')

asyncio.run(click_scb_menu())
