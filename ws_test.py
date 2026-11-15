import asyncio
import json
import websockets

async def test():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    print("Connecting...")
    async with websockets.connect(uri) as ws:
        print("Connected!")
        payload = {'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': '1+1'}}
        await ws.send(json.dumps(payload))
        while True:
            raw = await ws.recv()
            msg = json.loads(raw)
            print("Received:", msg)
            if msg.get('id') == 1:
                break

asyncio.run(test())
