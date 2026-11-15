import asyncio
import json
import websockets
import base64

async def get_link():
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
                raw = await ws.recv()
                msg = json.loads(raw)
                if msg.get('id') == cid:
                    return msg
        global mid
        mid = 0

        # Click the Close button inside the Ask Gemini view via JS
        close_res = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
                    const closeBtn = btns.find(b => b.getAttribute('aria-label') === 'Close' || b.innerText === 'close' || b.getAttribute('data-tooltip') === 'Close');
                    if (closeBtn) {
                        closeBtn.click();
                        return "Clicked close button";
                    }
                    // Try finding SVG with path
                    const svgs = Array.from(document.querySelectorAll('svg'));
                    return { foundBtns: btns.map(b => b.getAttribute('aria-label')).filter(Boolean) };
                })()
            ''',
            'returnByValue': True
        })
        print("Close button click:", close_res['result']['result'])

        await asyncio.sleep(1.5)

        # Inspect if we can extract the file ID of SHADOWLINE_4.0_Defense_Slides.pdf directly from the DOM!
        file_id_res = await call('Runtime.evaluate', {
            'expression': '''
                (() => {
                    const links = Array.from(document.querySelectorAll('a, [data-id], [data-target]'));
                    const results = [];
                    for (const el of links) {
                        const href = el.href || '';
                        const id = el.getAttribute('data-id') || el.getAttribute('data-target') || '';
                        const text = el.innerText || '';
                        if (text.includes('SHADOWLINE') || href.includes('drive.google.com/file')) {
                            results.push({ text, href, id });
                        }
                    }
                    return results;
                })()
            ''',
            'returnByValue': True
        })
        print("Found file references in DOM:", file_id_res['result']['result'])

asyncio.run(get_link())
