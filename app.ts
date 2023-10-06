// Importa los módulos y middleware necesarios
import express from 'express';
import Routes from './router/routes';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from "morgan";

// Crea una instancia de la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Configura middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Aplica las rutas de tu aplicación definidas en productoRoutes
app.use('/api', Routes);

// Inicia el servidor y escucha en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});
