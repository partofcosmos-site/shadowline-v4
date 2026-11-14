import { chromium } from 'playwright';

async function auditLayout() {
  console.log('[AUDIT] Launching Playwright Chromium in headless mode...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log('[AUDIT] Navigating to http://localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    console.error('[AUDIT] Failed to connect to dev server. Is Vite running?', e.message);
    await browser.close();
    process.exit(1);
  }

  // Check 1: Horizontal scrollbar overflow
  const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
  console.log(`[AUDIT] Body Width: client=${bodyClientWidth}px, scroll=${bodyScrollWidth}px`);

  if (bodyScrollWidth > bodyClientWidth) {
    console.error(`[AUDIT FAIL] Horizontal overflow detected! ScrollWidth (${bodyScrollWidth}) > ClientWidth (${bodyClientWidth})`);
    await browser.close();
    process.exit(1);
  } else {
    console.log('[AUDIT PASS] Zero horizontal overflow detected.');
  }

  // Check 2: Verify canvas elements render with valid dimensions
  const canvases = await page.$$('canvas');
  console.log(`[AUDIT] Found ${canvases.length} canvas elements on page.`);
  for (let i = 0; i < canvases.length; i++) {
    const box = await canvases[i].boundingBox();
    if (!box || box.width === 0 || box.height === 0) {
      console.error(`[AUDIT FAIL] Canvas #${i} has invalid bounding box:`, box);
      await browser.close();
      process.exit(1);
    }
  }
  console.log('[AUDIT PASS] All canvas elements rendered with valid non-zero dimensions.');

  // Check 3: Tab navigation check
  const tabs = await page.$$('nav button');
  console.log(`[AUDIT] Found ${tabs.length} view navigation tabs.`);
  for (let i = 0; i < tabs.length; i++) {
    await tabs[i].click();
    await page.waitForTimeout(300);
    const title = await page.$eval('header.top-command-bar span.brand-title', el => el.textContent);
    console.log(`[AUDIT] Clicked Tab ${i + 1}, Header: "${title}"`);
  }

  console.log('[AUDIT SUCCESS] All layout, canvas, and navigation checks passed cleanly.');
  await browser.close();
  process.exit(0);
}

auditLayout().catch(err => {
  console.error('[AUDIT ERROR]', err);
  process.exit(1);
});

