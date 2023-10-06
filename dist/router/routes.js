"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const librosControllers = __importStar(require("../controllers/libros.controller"));
const usuariosControllers = __importStar(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
//Controladores para Libros
/**
 * Controlador para obtener información de un libro por ISBN desde Firestore.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/libros/:isbn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        librosControllers.getAllAvailableISBNs(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener información del libro desde Firestore' });
    }
}));
/**
 * Controlador para obtener todos los ISBN disponibles desde la base de datos Prisma.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/isbn/disponibles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        librosControllers.getAllAvailableISBNs(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todos los ISBN disponibles' });
    }
}));
/**
 * Controlador para registrar libros en Firestore y en la base de datos Prisma.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.post('/libros/:isbn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        librosControllers.registerBookInFirestore(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el libro en Firestore' });
    }
}));
//Controladores para usuarios
/**
 * Controlador para obtener todos los usuarios.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        usuariosControllers.getAllUsers(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}));
/**
 * Controlador para obtener un usuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.get('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        usuariosControllers.getUserByEmail(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuario por ID' });
    }
}));
/**
 * Controlador para crear un nuevo usuario.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url_imagen, Nombre_Usuario, Correo_Usuario, Contrasena_Usuario } = req.body;
    try {
        usuariosControllers.createUser(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
}));
/**
 * Controlador para actualizar un usuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.put('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { url_imagen, Nombre_Usuario, Correo_Usuario, Contrasena_Usuario } = req.body;
    if (!usuariosControllers.isValidId(id)) {
        return res.status(400).json({ error: 'ID no válido' });
    }
    try {
        usuariosControllers.updateUser(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
}));
/**
 * Controlador para eliminar un usuario por su ID.
 *
 * @param {Request} req - Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */
router.delete('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!usuariosControllers.isValidId(id)) {
        return res.status(400).json({ error: 'ID no válido' });
    }
    try {
        usuariosControllers.deleteUser(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
}));
exports.default = router;
