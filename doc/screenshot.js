import { writeFileSync } from 'fs';

const timeout = 240000;

export const screenshot = async (html, { browser }) => {
  let timeoutCount = 0;
  const timeoutLimit = 3;
  const imageUrlList = [];
  for (;;) {
    imageUrlList.length = 0;

    let page;
    try {
      console.log(`QQ/newPage`);
      page = await browser.newPage();
      const width = 1024;
      const height = 1024;
      await page.setViewport({ width, height });
      page.on('console', (msg) => console.log(msg.text()));
      page.on('error', (msg) => console.log(msg.text()));
      try {
        writeFileSync('/tmp/debug.html', html, { encoding: 'utf-8' });
        console.log(`QQ/setContent`);
        await page.setContent(html, { timeout });
      } catch (error) {
        console.log(error.stack);
        if (timeoutCount++ < timeoutLimit) {
          console.log(`Retry ${timeoutCount}`);
          continue;
        } else {
          throw error;
        }
      }
      timeoutCount = 0;
      try {
        console.log(`QQ/wait for loaded`);
        await page.waitForSelector('.notebook.loaded', { timeout });
      } catch (error) {
        console.log(error.stack);
        if (timeoutCount++ < timeoutLimit) {
          console.log(`Retry ${timeoutCount}`);
          continue;
        } else {
          throw error;
        }
      }
      console.log(`QQ/extract images`);
      for (const element of await page.$$('.note.view')) {
        let viewId;
        const classNameProperty = await element.getProperty('className');
        const classNameValue = await classNameProperty.jsonValue();
        for (const className of classNameValue.split(' ')) {
          if (className.startsWith('viewId_')) {
            viewId = className.substring('viewId_'.length);
          }
        }
        const property = await element.getProperty('src');
        imageUrlList.push({ imageUrl: await property.jsonValue(), viewId });
      }
      console.log(`QQ/done`);
      return { imageUrlList };
    } finally {
      await page.close();
    }
  }
};
