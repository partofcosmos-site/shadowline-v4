import asyncio
import json
import base64
import websockets

async def inspect_drive_page():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        # Check actual page URL
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '({ title: document.title, url: window.location.href })',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Page info:', res['result']['result']['value'])

        # Find row and double click or open it to get file URL
        js_find = '''(() => {
            const rows = Array.from(document.querySelectorAll('div, tr, c-wiz')).filter(r => (r.innerText || '').includes('SHADOWLINE_4.0_Defense_Slides.pdf') && r.innerText.length < 200);
            return rows.map(r => ({
                tag: r.tagName,
                text: r.innerText,
                html: r.outerHTML.slice(0, 300)
            }));
        })()'''
        await ws.send(json.dumps({
            'id': 2,
            'method': 'Runtime.evaluate',
            'params': {'expression': js_find, 'returnByValue': True}
        }))
        res = json.loads(await ws.recv())
        print('Found rows:', json.dumps(res, indent=2))

asyncio.run(inspect_drive_page())
