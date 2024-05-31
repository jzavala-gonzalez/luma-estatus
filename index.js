// Basado en este tutorial:
// https://www.bannerbear.com/blog/how-to-take-screenshots-with-puppeteer/

const puppeteer = require('puppeteer');

(async () => {

// Abrir un navegador
const browser = await puppeteer.launch();

// Crear una nueva página
const page = await browser.newPage();

// Elegir tamaño de la ventana
await page.setViewport({
    width: 768,
    height: 680,
    deviceScaleFactor: 3,
});

// Abrir una URL
const website_url = 'https://miluma.lumapr.com/outages/serviceStatus';
await page.goto(website_url, { waitUntil: 'networkidle0' });

// Esperar por la tabla
await page.waitForSelector('div.jss55', { visible: true });

await new Promise(resolve => setTimeout(resolve, 500))

// Tomar una captura de pantalla
await page.screenshot({ path: 'screenshot.png' });

// Cerrar el navegador
await browser.close();
}
)();