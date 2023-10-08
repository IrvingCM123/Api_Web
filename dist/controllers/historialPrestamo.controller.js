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
exports.deleteHistorialPrestamo = exports.updateHistorialPrestamo = exports.getPrestamosDevPendientesByUserID = exports.createHistorialPrestamo = exports.getHistorialDevolcionesByUserID = exports.getHistorialPrestamoByUserID = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Controlador para obtener el historial de préstamos de un usuario por su ID
const getHistorialPrestamoByUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Usuario } = req.params;
    try {
        const usuario = yield prisma.user.findUnique({
            where: {
                Correo_Usuario: ID_Usuario,
            },
        });
        // Buscar el historial de préstamos y devoluciones del usuario
        const historialPrestamo = yield prisma.historialPrestamo.findMany({
            where: {
                ID_Usuario: Number(usuario === null || usuario === void 0 ? void 0 : usuario.ID_Usuario),
                Pendiente: true
            },
            include: {
                User: true,
                PrestamoDevolucion: true,
            }
        });
        res.json(historialPrestamo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de préstamos ' });
    }
});
exports.getHistorialPrestamoByUserID = getHistorialPrestamoByUserID;
// Controlador para obtener el historial de préstamos y devoluciones de un usuario por su ID
const getHistorialDevolcionesByUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Usuario } = req.params;
    try {
        const usuario = yield prisma.user.findUnique({
            where: {
                Correo_Usuario: ID_Usuario,
            },
        });
        // Buscar el historial de préstamos y devoluciones del usuario
        const historialPrestamo = yield prisma.historialPrestamo.findMany({
            where: {
                ID_Usuario: Number(usuario === null || usuario === void 0 ? void 0 : usuario.ID_Usuario),
                Pendiente: false
            },
            include: {
                User: true,
                PrestamoDevolucion: true,
            }
        });
        res.json(historialPrestamo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de devoluciones' });
    }
});
exports.getHistorialDevolcionesByUserID = getHistorialDevolcionesByUserID;
// Controlador para crear un nuevo registro en el historial de préstamos y devoluciones
const createHistorialPrestamo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ID_Usuario, ID_Prestamo, Fecha_Prestamo } = req.body;
        // Crear un nuevo registro en el historial de préstamos y devoluciones
        const historialPrestamo = yield prisma.historialPrestamo.create({
            data: {
                ID_Usuario: Number(ID_Usuario),
                ID_Prestamo: Number(ID_Prestamo),
                Fecha_Prestamo,
                Pendiente: true, // Por defecto, el préstamo está pendiente
            },
        });
        // Contar la cantidad de préstamos en el historial del usuario
        const usuario = yield prisma.user.findUnique({
            where: {
                Correo_Usuario: ID_Usuario,
            },
            include: {
                historial_prestamo: true,
            },
        });
        const cantidadPrestamos = (usuario === null || usuario === void 0 ? void 0 : usuario.historial_prestamo.length) || 0;
        // Actualizar el campo Candidato_Prestamo en GestionUsuario
        if (cantidadPrestamos >= 3) {
            yield prisma.gestionUsuario.update({
                where: {
                    ID_Usuario: usuario === null || usuario === void 0 ? void 0 : usuario.ID_Usuario,
                },
                data: {
                    Candidato_Prestamo: false,
                },
            });
        }
        else {
            yield prisma.gestionUsuario.update({
                where: {
                    ID_Usuario: usuario === null || usuario === void 0 ? void 0 : usuario.ID_Usuario,
                },
                data: {
                    Candidato_Prestamo: true,
                },
            });
        }
        res.status(201).json(historialPrestamo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear un registro en el historial de préstamos y devoluciones' });
    }
});
exports.createHistorialPrestamo = createHistorialPrestamo;
// Controlador para obtener todos los préstamos y devoluciones pendientes para un usuario específico
const getPrestamosDevPendientesByUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Usuario } = req.params;
    try {
        const usuario = yield prisma.user.findUnique({
            where: {
                Correo_Usuario: ID_Usuario,
            },
        });
        // Buscar todos los registros pendientes en el historial de préstamos y devoluciones del usuario
        const prestamosDevPendientes = yield prisma.historialPrestamo.findMany({
            where: {
                ID_Usuario: Number(usuario === null || usuario === void 0 ? void 0 : usuario.ID_Usuario),
                Pendiente: true,
            },
            include: {
                PrestamoDevolucion: true,
            },
        });
        res.json(prestamosDevPendientes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los préstamos y devoluciones pendientes' });
    }
});
exports.getPrestamosDevPendientesByUserID = getPrestamosDevPendientesByUserID;
const updateHistorialPrestamo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Historial } = req.params;
    const { Fecha_Prestamo, Pendiente } = req.body;
    try {
        // Actualiza el registro en la base de datos
        const updatedHistorialPrestamo = yield prisma.historialPrestamo.update({
            where: {
                ID_Historial: Number(ID_Historial),
            },
            data: {
                Fecha_Prestamo,
                Pendiente,
            },
        });
        res.json(updatedHistorialPrestamo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el registro de HistorialPrestamo' });
    }
});
exports.updateHistorialPrestamo = updateHistorialPrestamo;
const deleteHistorialPrestamo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Historial } = req.params;
    try {
        // Elimina el registro de la base de datos
        yield prisma.historialPrestamo.delete({
            where: {
                ID_Historial: Number(ID_Historial),
            },
        });
        res.json({ message: 'Registro de HistorialPrestamo eliminado con éxito' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el registro de HistorialPrestamo' });
    }
});
exports.deleteHistorialPrestamo = deleteHistorialPrestamo;
