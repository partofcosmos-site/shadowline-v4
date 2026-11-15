import asyncio
import json
import base64
import websockets

async def inspect_share():
    async with websockets.connect('ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22') as ws:
        js = """
        (() => {
            const iframes = Array.from(document.querySelectorAll('iframe')).map(f => ({ src: f.src, id: f.id, name: f.name }));
            const dialogs = Array.from(document.querySelectorAll('[role="dialog"]')).map(d => d.innerText.slice(0, 300));
            return { iframes, dialogs };
        })()
        """
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print('Inspect:', json.dumps(res, indent=2))

        # Screenshot
        await ws.send(json.dumps({'id': 2, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
        res2 = json.loads(await ws.recv())
        with open('current_share_state.png', 'wb') as f:
            f.write(base64.b64decode(res2['result']['data']))
        print('Saved current_share_state.png')

asyncio.run(inspect_share())
