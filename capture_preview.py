import asyncio
from playwright.async_api import async_playwright

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})
        await page.goto('http://localhost:3000', wait_until='networkidle')
        await page.screenshot(path='D:/Work/JJMI_Registration_App/live_preview.png', full_page=False)
        await browser.close()
        print('Screenshot saved successfully!')

asyncio.run(capture())
