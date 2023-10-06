import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import * as librosControllers from '../controllers/libros.controller'
import * as usuariosControllers from '../controllers/user.controller'
import * as revistasControllers from '../controllers/revistas.controller';
import * as gestionUsuariosControllers from '../controllers/gestionuser.controller';
import * as prestamosControllers from '../controllers/prestamo_devolucion.controller';

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


// Rutas para Prestamos y Devoluciones

router.post('/prestamos', async (req: Request, res: Response) => {
    try {
        prestamosControllers.createPrestamoDevolucion(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear préstamo/devolución' });
    }
});

router.post('/devoluciones/:ID_Prestamo', async (req: Request, res: Response) => {
    const { ID_Prestamo } = req.params;
    try {
        prestamosControllers.realizarDevolucion(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al realizar la devolución' });
    }
});

router.get('/prestamos-devoluciones', async (req: Request, res: Response) => {
    try {
        prestamosControllers.getAllPrestamosDevoluciones(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener préstamos y devoluciones' });
    }
});


export default router;
