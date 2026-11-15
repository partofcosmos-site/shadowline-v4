import asyncio
import json
import websockets

async def check_menu():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri) as ws:
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '''(() => {
                    const allVisible = Array.from(document.querySelectorAll('*')).filter(e => {
                        const r = e.getBoundingClientRect();
                        return r.width > 0 && r.height > 0 && (e.innerText || '').length > 0 && (e.innerText || '').length < 50;
                    });
                    const uniqueTexts = Array.from(new Set(allVisible.map(e => e.innerText.trim())));
                    return uniqueTexts.filter(t => t.toLowerCase().includes('share') || t.toLowerCase().includes('link') || t.toLowerCase().includes('download') || t.toLowerCase().includes('open'));
                })()''',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Visible menu keywords:', json.dumps(res, indent=2))

asyncio.run(check_menu())
