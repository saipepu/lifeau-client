import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url || !url.startsWith('http')) {
      return Response.json({ error: 'Invalid URL' }, { status: 400 });
    }
    console.log('url', url);

    const browser = await puppeteer.launch({
      // executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url);

    // Save screenshot to a local file
    const screenshotPath = path.join(process.cwd(), 'public', 'screenshot.png');
    const screenshot = await page.screenshot({ fullPage: true });

    await writeFile(screenshotPath, screenshot);
    await browser.close();

    return Response.json({ message: 'Screenshot taken', url: '/screenshot.png' });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to take screenshot' }, { status: 500 });
  }
}