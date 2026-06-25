import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to capture full width
  await page.setViewportSize({ width: 1280, height: 800 });

  try {
    // Navigate to the landing page
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    // Wait a bit for animations
    await page.waitForTimeout(2000);

    // Get full page height
    const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`Page height: ${fullHeight}px`);

    // Screenshot 1: Hero section (at top, scroll position 0)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({
      path: 'screenshot-01-hero.png',
      fullPage: false
    });
    console.log('Screenshot 1 taken: Hero section');

    // Screenshot 2: What you get section (scroll down ~600px)
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(800);
    await page.screenshot({
      path: 'screenshot-02-what-you-get.png',
      fullPage: false
    });
    console.log('Screenshot 2 taken: What you get section');

    // Screenshot 3: How it works section (scroll down another ~600px)
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(800);
    await page.screenshot({
      path: 'screenshot-03-how-it-works.png',
      fullPage: false
    });
    console.log('Screenshot 3 taken: How it works section');

    // Screenshot 4: Testimonials section (scroll down another ~600px)
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(800);
    await page.screenshot({
      path: 'screenshot-04-testimonials.png',
      fullPage: false
    });
    console.log('Screenshot 4 taken: Testimonials section');

    // Screenshot 5: Footer (scroll to bottom)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(800);
    await page.screenshot({
      path: 'screenshot-05-footer.png',
      fullPage: false
    });
    console.log('Screenshot 5 taken: Footer');

    console.log('All screenshots completed!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
