// Basado en este tutorial:
// https://www.bannerbear.com/blog/how-to-take-screenshots-with-puppeteer/

import fs from 'fs';
import puppeteer from 'puppeteer';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const tz = 'America/Puerto_Rico';
dayjs.tz.setDefault(tz);

const filename_datetime_format = 'YYYY-MM-DDTHH-mm-ssZZ';

if (!fs.existsSync('capturas')){
    fs.mkdirSync('capturas');
}

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
const filename_datetime = now.tz(tz).format(filename_datetime_format);
console.log('now (ISO):', now.toISOString(), '(debe ser UTC)');
console.log('filename_datetime:', filename_datetime, '(debe ser Puerto Rico)');

let num_attempts = 0;
const max_attempts = 3;
let success = false;


while (!success) {
    num_attempts++;
    if (num_attempts > max_attempts) {
        console.log('Maximo de intentos alcanzado');
        break;
    }

    console.log('Intento #', num_attempts);
    // Abrir una URL
    const website_url = 'https://miluma.lumapr.com/outages/serviceStatus';
    await page.goto(website_url, { waitUntil: 'networkidle0' });

    // Esperar por la tabla
    // const table_selector = 'div.jss84';
    const table_selector = 'xpath///h1[text()="Estatus del Servicio"]/following-sibling::div[1]';
    await page.waitForSelector(table_selector, { visible: true })
    .then(() => {
        console.log('Tabla encontrada');
        success = true;
    })
    .catch((err) => {
        console.log('Error:', err);
    });

    // if (!success) {
    //     // Print el html de la pagina
    //     const html = await page.content();
    //     console.log('html:', html);
    // }
}

if (!success) {
    console.log('No se pudo encontrar la tabla');
    await browser.close();
    throw new Error('No se pudo encontrar la tabla');
}

// Esperar un poco
await new Promise(resolve => setTimeout(resolve, 500))

// Tomar una captura de pantalla
const screenshot_filename = `luma_estatus_captura__${filename_datetime}.png`;
const screenshot_filepath = 'capturas/'+screenshot_filename;
console.log('Guardando bajo:', screenshot_filepath);
await page.screenshot({ path: screenshot_filepath });

// Cerrar el navegador
await browser.close();

// Guarda el nombre del archivo en un archivo de texto
const filename_referencia = 'ultima_captura.txt';
fs.writeFileSync(filename_referencia, screenshot_filepath, 'utf8');
}
)();