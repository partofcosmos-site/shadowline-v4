import asyncio
import json
import websockets

async def main():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri, max_size=20*1024*1024) as ws:
        js = """
        (() => {
            const all = Array.from(document.querySelectorAll('*'));
            const matches = all.filter(el => (el.innerText || '').includes('SHADOWLINE_4.0_Defense_Slides.pdf') && el.children.length === 0);
            if (matches.length === 0) return { error: 'not found' };
            const target = matches[0];
            const rect = target.getBoundingClientRect();
            return {
                tag: target.tagName,
                text: target.innerText,
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2,
                visible: rect.width > 0 && rect.height > 0
            };
        })()
        """
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': js,
                'returnByValue': True
            }
        }))
        res = await ws.recv()
        print('Eval result:', res)

if __name__ == '__main__':
    asyncio.run(main())
