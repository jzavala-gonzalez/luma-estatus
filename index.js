// Basado en este tutorial:
// https://www.bannerbear.com/blog/how-to-take-screenshots-with-puppeteer/

import puppeteer from 'puppeteer';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const tz = 'America/Puerto_Rico';
dayjs.tz.setDefault(tz);

const filename_datetime_format = 'YYYY-MM-DDTHH-mm-ssZZ';

(async () => {

// Abrir un navegador
const browser = await puppeteer.launch();

// Crear una nueva página
const page = await browser.newPage();

// Elegir tamaño de la ventana
await page.setViewport({
    width: 768,
    height: 680,
    deviceScaleFactor: 2,
});

// Guardar fecha de ahora
const now = dayjs();
const filename_datetime = now.format(filename_datetime_format);
console.log('now (ISO):', now.toISOString(), '(debe ser UTC)');
console.log('filename_datetime:', filename_datetime, '(debe ser Puerto Rico)');

// Abrir una URL
const website_url = 'https://miluma.lumapr.com/outages/serviceStatus';
await page.goto(website_url, { waitUntil: 'networkidle0' });

// Esperar por la tabla
await page.waitForSelector('div.jss55', { visible: true });

await new Promise(resolve => setTimeout(resolve, 500))

// Tomar una captura de pantalla
const screenshot_filename = `luma_estatus_captura__${filename_datetime}.png`;
console.log('Guardando como:', screenshot_filename);
await page.screenshot({ path: 'capturas/'+screenshot_filename });

// Cerrar el navegador
await browser.close();
}
)();