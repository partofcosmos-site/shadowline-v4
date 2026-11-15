import asyncio
import json
import websockets
import os
import sys

async def check():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        msg = {
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {'expression': 'document.title + " | " + window.location.href'}
        }
        await ws.send(json.dumps(msg))
        res = await ws.recv()
        print('Location:', res)
        
        msg2 = {
            'id': 2,
            'method': 'Runtime.evaluate',
            'params': {'expression': 'document.querySelectorAll("input[type=file]").length'}
        }
        await ws.send(json.dumps(msg2))
        res2 = await ws.recv()
        print('File inputs:', res2)

        # Let's inspect the DOM for "+ New" button or upload triggers
        msg3 = {
            'id': 3,
            'method': 'Runtime.evaluate',
            'params': {'expression': '''
                Array.from(document.querySelectorAll('button, div[role="button"]'))
                    .map(b => b.innerText || b.getAttribute('aria-label'))
                    .filter(t => t && (t.includes('New') || t.includes('Upload') || t.includes('drive')))
                    .slice(0, 10)
            ''', 'returnByValue': True}
        }
        await ws.send(json.dumps(msg3))
        res3 = await ws.recv()
        print('Buttons:', res3)

if __name__ == '__main__':
    asyncio.run(check())
