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
exports.createGestionUsuario = exports.deleteGestionUsuario = exports.updateGestionUsuario = exports.getGestionUsuarioById = exports.getAllGestionUsuarios = exports.isValidFechaRegistro = exports.isValidUserId = void 0;
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
exports.isValidUserId = isValidUserId;
// Validador para Fecha de Registro (debe tener un formato específico)
const isValidFechaRegistro = (fecha) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
};
exports.isValidFechaRegistro = isValidFechaRegistro;
// Controlador para obtener todos los registros de GestionUsuario
// Controlador para obtener todos los registros de GestionUsuario con información de usuario
const getAllGestionUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gestionUsuarios = yield prisma.gestionUsuario.findMany();
        const usuariosPromises = gestionUsuarios.map((gestionUsuario) => __awaiter(void 0, void 0, void 0, function* () {
            const usuario = yield prisma.user.findUnique({
                where: {
                    ID_Usuario: gestionUsuario.ID_Usuario,
                },
            });
            return Object.assign(Object.assign({}, gestionUsuario), { Correo_Usuario: usuario === null || usuario === void 0 ? void 0 : usuario.Correo_Usuario });
        }));
        const gestionUsuariosConUsuarios = yield Promise.all(usuariosPromises);
        res.json(gestionUsuariosConUsuarios);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener gestión de usuarios' });
    }
});
exports.getAllGestionUsuarios = getAllGestionUsuarios;
// Controlador para obtener un GestionUsuario por su ID
const getGestionUsuarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // El "id" aquí será el correo electrónico
    try {
        // Buscar al usuario por correo electrónico
        const usuario = yield prisma.user.findUnique({
            where: { Correo_Usuario: (id) },
        });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Utilizar el ID del usuario para buscar el "gestionUsuario"
        const gestionUsuario = yield prisma.gestionUsuario.findUnique({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
        });
        if (!gestionUsuario) {
            return res.status(404).json({ error: 'Gestión de usuario no encontrada' });
        }
        // Combinar la información del usuario con la información de gestión
        const gestionUsuarioConUsuario = Object.assign(Object.assign({}, gestionUsuario), { Correo_Usuario: usuario.Correo_Usuario, Nombre: usuario.Nombre_Usuario });
        res.json(gestionUsuarioConUsuario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener gestión de usuario por ID' });
    }
});
exports.getGestionUsuarioById = getGestionUsuarioById;
// Controlador para actualizar un registro de GestionUsuario por su ID
const updateGestionUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { Candidato_Prestamo, Prestamos_Pendientes } = req.body;
    const usuario = yield prisma.user.findUnique({
        where: {
            Correo_Usuario: id,
        },
    });
    try {
        // Verificar el historial de préstamos del usuario
        const historialPrestamo = yield prisma.historialPrestamo.findMany({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
        });
        if (historialPrestamo.length > 3) {
            return res.status(400).json({ error: 'El usuario tiene más de 3 préstamos en su historial' });
        }
        const gestionUsuario = yield prisma.gestionUsuario.update({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
            data: {
                Candidato_Prestamo,
                Prestamos_Pendientes
            },
        });
        res.json(gestionUsuario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la gestión de usuario' });
    }
});
exports.updateGestionUsuario = updateGestionUsuario;
// Controlador para eliminar un registro de GestionUsuario por su ID
const deleteGestionUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, exports.isValidUserId)(Number(id))) {
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
const createGestionUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ID_Usuario, Candidato_Prestamo, Fecha_Registro } = req.body;
        const nuevoGestionUsuario = yield prisma.gestionUsuario.create({
            data: {
                ID_Usuario: Number(ID_Usuario),
                Candidato_Prestamo,
                Fecha_Registro,
                Prestamos_Pendientes: 0,
                Devoluciones_Realizadas: 0, // Inicializamos en 0
            },
        });
        res.status(201).json(nuevoGestionUsuario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear un objeto de GestionUsuario' });
    }
});
exports.createGestionUsuario = createGestionUsuario;
