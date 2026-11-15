import asyncio
import json
import base64
import websockets
import urllib.request

async def get_link_exact():
    with urllib.request.urlopen('http://127.0.0.1:9103/json') as r:
        tabs = json.loads(r.read())
    drive_tab = next(t for t in tabs if 'drive.google.com' in t.get('url', ''))
    uri = drive_tab['webSocketDebuggerUrl']

    async with websockets.connect(uri) as ws:
        # 1. Query exact DOM elements in recent
        await ws.send(json.dumps({
            'id': 1,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': '''(() => {
                    const allNodes = Array.from(document.querySelectorAll('*'));
                    const candidates = allNodes.filter(n => (n.getAttribute('aria-label') || '').includes('SHADOWLINE_4.0_Defense_Slides.pdf'));
                    if (candidates.length === 0) return { error: 'No node with aria-label' };
                    const node = candidates[0];
                    const rect = node.getBoundingClientRect();
                    return {
                        tag: node.tagName,
                        classes: node.className,
                        aria: node.getAttribute('aria-label'),
                        dataId: node.getAttribute('data-id'),
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2
                    };
                })()''',
                'returnByValue': True
            }
        }))
        res = json.loads(await ws.recv())
        print('Candidate:', json.dumps(res, indent=2))
        data = res['result']['result']['value']

        if 'x' in data:
            x, y = data['x'], data['y']
            # Dispatch real mouse click
            await ws.send(json.dumps({
                'id': 2,
                'method': 'Input.dispatchMouseEvent',
                'params': {'type': 'mousePressed', 'x': x, 'y': y, 'button': 'left', 'clickCount': 1}
            }))
            await ws.recv()
            await ws.send(json.dumps({
                'id': 3,
                'method': 'Input.dispatchMouseEvent',
                'params': {'type': 'mouseReleased', 'x': x, 'y': y, 'button': 'left', 'clickCount': 1}
            }))
            await ws.recv()
            print('Clicked element at', x, y)
            await asyncio.sleep(1)

            # Context menu right click
            await ws.send(json.dumps({
                'id': 4,
                'method': 'Input.dispatchMouseEvent',
                'params': {'type': 'mousePressed', 'x': x, 'y': y, 'button': 'right', 'clickCount': 1}
            }))
            await ws.recv()
            await ws.send(json.dumps({
                'id': 5,
                'method': 'Input.dispatchMouseEvent',
                'params': {'type': 'mouseReleased', 'x': x, 'y': y, 'button': 'right', 'clickCount': 1}
            }))
            await ws.recv()
            print('Right clicked element')
            await asyncio.sleep(1.5)

            # Screenshot
            await ws.send(json.dumps({
                'id': 6,
                'method': 'Page.captureScreenshot',
                'params': {'format': 'png'}
            }))
            res6 = json.loads(await ws.recv())
            with open('drive_context_opened.png', 'wb') as f:
                f.write(base64.b64decode(res6['result']['data']))
            print('Saved drive_context_opened.png')

asyncio.run(get_link_exact())
