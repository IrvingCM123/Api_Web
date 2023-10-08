import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import * as librosControllers from '../controllers/libros.controller'
import * as usuariosControllers from '../controllers/user.controller'
import * as revistasControllers from '../controllers/revistas.controller';
import * as gestionUsuariosControllers from '../controllers/gestionuser.controller';
import * as prestamosControllers from '../controllers/prestamo_devolucion.controller';
import * as historialPrestamoControllers from '../controllers/historialPrestamo.controller';
import * as inventarioControllers from '../controllers/inventario.controller';

const router = Router();
const prisma = new PrismaClient();

//Controladores para Libros

/**
 * Controlador para obtener información de un libro por ISBN desde Firestore.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/libros/:isbn', async (req: Request, res: Response) => {
    try {
        librosControllers.getBookInfoByISBN(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener información del libro desde Firestore' });
    }
});

/**
 * Controlador para eliminar un libro por ISBN desde Firestore y la base de datos Prisma.
 * NOTA: Este controlador no se utiliza en la aplicación, pero se deja como ejemplo de cómo eliminar un libro.
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.delete('/libros/:isbn', async (req: Request, res: Response) => {
    try {
        librosControllers.eliminarLibroByID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el libro desde Firestore' });
    }
}
);

/**
 * Controlador para obtener todos los ISBN disponibles desde la base de datos Prisma.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/isbn/disponibles', async (req: Request, res: Response) => {
    try {
        librosControllers.getAllAvailableISBNs(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todos los ISBN disponibles' });
    }
});

/**
 * Controlador para registrar libros en Firestore y en la base de datos Prisma.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.post('/libros/:isbn', async (req: Request, res: Response) => {
    try {
        librosControllers.registerBookInFirestore(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el libro en Firestore' });
    }
});

//Controladores para usuarios


/**
 * Controlador para obtener todos los usuarios.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/users', async (req: Request, res: Response) => {
    try {
        usuariosControllers.getAllUsers(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

/**
 * Controlador para obtener un usuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/users/:id', async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        usuariosControllers.getUserByEmail(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuario por ID' });
    }
});

/**
 * Controlador para crear un nuevo usuario.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.post('/users', async (req: Request, res: Response) => {
    const { url_imagen, Nombre_Usuario, Correo_Usuario, Contrasena_Usuario } = req.body;
    try {
        usuariosControllers.createUser(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

/**
 * Controlador para actualizar un usuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.put('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { url_imagen, Nombre_Usuario, Correo_Usuario, Contrasena_Usuario } = req.body;
    if (!usuariosControllers.isValidId(id)) {
        return res.status(400).json({ error: 'ID no válido' });
    }
    try {
        usuariosControllers.updateUser(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

/**
 * Controlador para eliminar un usuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.delete('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!usuariosControllers.isValidId(id)) {
        return res.status(400).json({ error: 'ID no válido' });
    }
    try {
        usuariosControllers.deleteUser(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});


/**
 * Controlador para obtener información de una revista por ISSN desde Firestore.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/revistas/:issn', async (req: Request, res: Response) => {
    try {
        revistasControllers.getMagazineInfoByISSN(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener información de la revista desde Firestore' });
    }
});

/**
 * Controlador para obtener todos los ISSN disponibles desde la base de datos Prisma.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/issn/disponibles', async (req: Request, res: Response) => {
    try {
        revistasControllers.getAllAvailableISSNs(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todos los ISSN disponibles' });
    }
});

/**
 * Controlador para registrar una revista en Firestore y en la base de datos Prisma.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.post('/revistas/:issn', async (req: Request, res: Response) => {
    try {
        revistasControllers.registerMagazineInFirestore(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar la revista en Firestore' });
    }
});

/**
 * Controlador para eliminar una revista por ISSN desde Firestore y la base de datos Prisma.
 * NOTA: Este controlador no se utiliza en la aplicación, pero se deja como ejemplo de cómo eliminar una revista.
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.delete('/revistas/:issn', async (req: Request, res: Response) => {
    try {
        revistasControllers.eliminarRevista(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la revista desde Firestore' });
    }
}
);

/**
 * Controlador para obtener todos los registros de GestionUsuario.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/gestion-usuarios', async (req: Request, res: Response) => {
    try {
        gestionUsuariosControllers.getAllGestionUsuarios(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener gestión de usuarios' });
    }
});

/**
 * Controlador para obtener un GestionUsuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/gestion-usuarios/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        gestionUsuariosControllers.getGestionUsuarioById(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener gestión de usuario por ID' });
    }
});

/**
 * Controlador para actualizar un registro de GestionUsuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.put('/gestion-usuarios/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Candidato_Prestamo } = req.body;

    try {
        gestionUsuariosControllers.updateGestionUsuario(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar gestión de usuario' });
    }
});

/**
 * Controlador para eliminar un registro de GestionUsuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.delete('/gestion-usuarios/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!gestionUsuariosControllers.isValidUserId(Number(id))) {
        return res.status(404).json({ error: 'Gestión de usuario no encontrada' });
    }

    try {
        gestionUsuariosControllers.deleteGestionUsuario(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar gestión de usuario' });
    }
});

// Ruta para crear un nuevo préstamo/devolución
router.post('/prestamos-devoluciones', async (req: Request, res: Response) => {
    try {
        prestamosControllers.createPrestamo(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear préstamo/devolución' });
    }
});

// Ruta para realizar una devolución
router.post('/prestamos-devoluciones/:ID_Prestamo', async (req: Request, res: Response) => {
    const { ID_Prestamo } = req.params;
    try {
        prestamosControllers.realizarDevolucion(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al realizar la devolución' });
    }
});

// Ruta para obtener todos los préstamos
router.get('/prestamos', async (req: Request, res: Response) => {
    try {
        prestamosControllers.getAllPrestamos(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener préstamos y devoluciones' });
    }
});

// Ruta para obtener todos las devoluciones
router.get('/devoluciones', async (req: Request, res: Response) => {
    try {
        prestamosControllers.getAllDevoluciones(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener préstamos y devoluciones' });
    }
});

// Ruta para eliminar todos los préstamos
router.delete('/prestamos-devoluciones', async (req: Request, res: Response) => {
    try {
        prestamosControllers.deleteAllPrestamos(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar préstamos' });
    }
});

// Ruta para eliminar un préstamo por ID
router.delete('/prestamos-devoluciones/:ID_Prestamo', async (req: Request, res: Response) => {
    const { ID_Prestamo } = req.params;
    try {
        prestamosControllers.deletePrestamosByID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar préstamo por ID' });
    }
});

// Ruta para eliminar todas las devoluciones
router.delete('/devoluciones', async (req: Request, res: Response) => {
    try {
        prestamosControllers.deleteAllDevoluciones(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar devoluciones' });
    }
});

// Ruta para eliminar una devolución por ID
router.delete('/devoluciones/:ID_Prestamo', async (req: Request, res: Response) => {
    const { ID_Prestamo } = req.params;
    try {
        prestamosControllers.deleteDevolucionesByID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar devolución por ID' });
    }
});

/**
 * Ruta para obtener el historial de préstamos y devoluciones de un usuario por su ID.
 * Ejemplo de uso: GET /historial-prestamo/123
 */
router.get('/historial-prestamo/:ID_Usuario', async (req: Request, res: Response) => {
    try {
        historialPrestamoControllers.getHistorialPrestamoByUserID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de préstamos y devoluciones' });
    }
});

/**
 * Ruta para obtener el historial de préstamos y devoluciones de un usuario por su ID.
 * Ejemplo de uso: GET /historial-prestamo/123
 */
router.get('/historial-devolucion/:ID_Usuario', async (req: Request, res: Response) => {
    try {
        historialPrestamoControllers.getHistorialDevolcionesByUserID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de préstamos y devoluciones' });
    }
});

/**
 * Ruta para crear un nuevo registro en el historial de préstamos y devoluciones.
 * Ejemplo de uso: POST /historial-prestamo
 */
router.post('/historial-prestamo', async (req: Request, res: Response) => {
    try {
        historialPrestamoControllers.createHistorialPrestamo(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear un registro en el historial de préstamos y devoluciones' });
    }
});

/**
 * Ruta para obtener todos los préstamos y devoluciones pendientes para un usuario específico.
 * Ejemplo de uso: GET /historial-prestamo/pendientes/123
 */
router.get('/historial-prestamo/pendientes/:ID_Usuario', async (req: Request, res: Response) => {
    try {
        historialPrestamoControllers.getPrestamosDevPendientesByUserID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los préstamos y devoluciones pendientes' });
    }
});

/**
 * Ruta para actualizar un registro en el historial de préstamos y devoluciones.
 * Ejemplo de uso: PUT /historial-prestamo/456
 */
router.put('/historial-prestamo/:ID_Historial', async (req: Request, res: Response) => {
    try {
        historialPrestamoControllers.updateHistorialPrestamo(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el registro de HistorialPrestamo' });
    }
});

/**
 * Ruta para eliminar un registro en el historial de préstamos y devoluciones.
 * Ejemplo de uso: DELETE /historial-prestamo/789
 */
router.delete('/historial-prestamo/:ID_Historial', async (req: Request, res: Response) => {
    try {
        historialPrestamoControllers.deleteHistorialPrestamo(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el registro de HistorialPrestamo' });
    }
});

/**
 * Ruta para crear un nuevo registro en el inventario.
 * Ejemplo de uso: POST /inventario
 */
router.post('/inventario', async (req: Request, res: Response) => {
    try {
        inventarioControllers.createInventario(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear un registro en el inventario' });
    }
});

/**
 * Ruta para obtener todos los registros de inventario.
 * Ejemplo de uso: GET /inventario
 */
router.get('/inventario', async (req: Request, res: Response) => {
    try {
        inventarioControllers.getAllInventario(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener registros de inventario' });
    }
});

/**
 * Ruta para obtener un registro de inventario por su ID.
 * Ejemplo de uso: GET /inventario/123
 */
router.get('/inventario/:ID_Articulo', async (req: Request, res: Response) => {
    try {
        inventarioControllers.getInventarioByID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener un registro de inventario' });
    }
});

/**
 * Ruta para actualizar un registro de inventario por su ID.
 * Ejemplo de uso: PUT /inventario/456
 */
router.put('/inventario/:ID_Articulo', async (req: Request, res: Response) => {
    try {
        inventarioControllers.updateInventarioByID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el registro de inventario' });
    }
});

/**
 * Ruta para eliminar un registro de inventario por su ID.
 * Ejemplo de uso: DELETE /inventario/789
 */
router.delete('/inventario/:ID_Articulo', async (req: Request, res: Response) => {
    try {
        inventarioControllers.deleteInventarioByID(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el registro de inventario' });
    }
});

export default router;
