import asyncio
import json
import websockets

async def check():
    uri = 'ws://127.0.0.1:9103/devtools/page/1E503AD158BBC093CF7D6564649A1B22'
    async with websockets.connect(uri, max_size=20*1024*1024) as ws:
        async def call(method, params=None):
            global mid
            mid += 1
            cid = mid
            req = {'id': cid, 'method': method}
            if params: req['params'] = params
            await ws.send(json.dumps(req))
            while True:
                msg = json.loads(await ws.recv())
                if msg.get('id') == cid: return msg
        global mid
        mid = 0
        
        eval_inputs = await call('Runtime.evaluate', {
            'expression': '''
                Array.from(document.querySelectorAll('input[type="file"]')).map(i => ({
                    id: i.id,
                    className: i.className,
                    disabled: i.disabled,
                    accept: i.accept
                }))
            ''',
            'returnByValue': True
        })
        print('Eval inputs:', eval_inputs['result']['result'])

asyncio.run(check())
