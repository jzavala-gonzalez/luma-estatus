import fs from 'fs';
import {
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";

// Para accessar la cubeta de S3
const ENDPOINT = process.env.ENDPOINT;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

// Confirmar que ninguna sea undefined:
if (!ENDPOINT || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY){
    throw new Error('Faltan variables de entorno. Revisa tu archivo .env');
}

// Verificar que documento ultima_captura existe
if (!fs.existsSync('ultima_captura.txt')){
    // si no existe, lanzar error
    throw new Error('El archivo ultima_captura.txt no existe. ¿Corriste index.js antes?');
}

// Leer el nombre del archivo de la ultima captura
const screenshot_filepath = fs.readFileSync('ultima_captura.txt', 'utf8');
console.log('Leyendo:', screenshot_filepath);

// Confirmar que el archivo existe
if (!fs.existsSync(screenshot_filepath)){
    // si no existe, lanzar error
    throw new Error(`El archivo ${screenshot_filepath} no existe. Vuelve a correr index.js`);
}

// Abrir cliente de S3
const S3 = new S3Client({
    region: "auto",
    endpoint: ENDPOINT,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
});

// Para subir el archivo a S3
async function uploadFile(filePath) {
    const bucketName = 'luma-estatus';
    const key = filePath;

    try {
      const fileStream = fs.createReadStream(filePath);
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
      });
  
      const response = await S3.send(command);
      console.log('File uploaded successfully:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
}

uploadFile(screenshot_filepath);