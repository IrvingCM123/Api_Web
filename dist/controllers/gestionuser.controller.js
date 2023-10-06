"use strict";
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
exports.deleteGestionUsuario = exports.updateGestionUsuario = exports.createGestionUsuario = exports.getGestionUsuarioById = exports.getAllGestionUsuarios = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Validador para ID de Usuario
const isValidUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            ID_Usuario: userId,
        },
    });
    return !!user;
});
// Validador para Fecha de Registro (debe tener un formato específico)
const isValidFechaRegistro = (fecha) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
};
// Controlador para obtener todos los registros de GestionUsuario
const getAllGestionUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gestionUsuarios = yield prisma.gestionUsuario.findMany();
        res.json(gestionUsuarios);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener gestión de usuarios' });
    }
});
exports.getAllGestionUsuarios = getAllGestionUsuarios;
// Controlador para obtener un GestionUsuario por su ID
const getGestionUsuarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!isValidUserId(Number(id))) {
        return res.status(404).json({ error: 'Gestión de usuario no encontrada' });
    }
    try {
        const gestionUsuario = yield prisma.gestionUsuario.findUnique({
            where: {
                ID_Usuario: Number(id),
            },
        });
        res.json(gestionUsuario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener gestión de usuario por ID' });
    }
});
exports.getGestionUsuarioById = getGestionUsuarioById;
// Controlador para crear un nuevo registro de GestionUsuario
const createGestionUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Usuario, Candidato_Prestamo, Fecha_Registro } = req.body;
    if (!isValidUserId(ID_Usuario)) {
        return res.status(404).json({ error: 'ID de usuario no válido' });
    }
    if (!isValidFechaRegistro(Fecha_Registro)) {
        return res.status(400).json({ error: 'Fecha de registro no válida' });
    }
    try {
        const gestionUsuario = yield prisma.gestionUsuario.create({
            data: {
                ID_Usuario,
                Candidato_Prestamo,
                Fecha_Registro,
            },
        });
        res.json(gestionUsuario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear gestión de usuario' });
    }
});
exports.createGestionUsuario = createGestionUsuario;
// Controlador para actualizar un registro de GestionUsuario por su ID
const updateGestionUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { Candidato_Prestamo, Fecha_Registro } = req.body;
    if (!isValidUserId(Number(id))) {
        return res.status(404).json({ error: 'Gestión de usuario no encontrada' });
    }
    if (!isValidFechaRegistro(Fecha_Registro)) {
        return res.status(400).json({ error: 'Fecha de registro no válida' });
    }
    try {
        const gestionUsuario = yield prisma.gestionUsuario.update({
            where: {
                ID_Usuario: Number(id),
            },
            data: {
                Candidato_Prestamo,
                Fecha_Registro,
            },
        });
        res.json(gestionUsuario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar gestión de usuario' });
    }
});
exports.updateGestionUsuario = updateGestionUsuario;
// Controlador para eliminar un registro de GestionUsuario por su ID
const deleteGestionUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!isValidUserId(Number(id))) {
        return res.status(404).json({ error: 'Gestión de usuario no encontrada' });
    }
    try {
        yield prisma.gestionUsuario.delete({
            where: {
                ID_Usuario: Number(id),
            },
        });
        res.json({ message: 'Gestión de usuario eliminada exitosamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar gestión de usuario' });
    }
});
exports.deleteGestionUsuario = deleteGestionUsuario;
