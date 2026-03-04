import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  page.on('requestfailed', request => {
     if (request.failure()) {
         console.log('REQUEST_FAILED:', request.url(), request.failure().errorText);
     }
  });

  try {
    await page.goto('http://localhost:5173/student/cefer-tarverdiyev', { waitUntil: 'networkidle', timeout: 10000 });
  } catch (e) {
    console.log("Nav error:", e.message);
  }
  
  await browser.close();
  // Ensure the script exits
  process.exit(0);
})();
