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
exports.realizarDevolucion = exports.createPrestamo = exports.deleteDevolucionesByID = exports.deleteAllDevoluciones = exports.deletePrestamosByID = exports.deleteAllPrestamos = exports.getAllDevoluciones = exports.getAllPrestamos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Controlador para obtener todos los préstamos y devoluciones
const getAllPrestamos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prestamosDevoluciones = yield prisma.prestamoDevolucion.findMany({ where: {
                Status: true,
            } });
        res.json(prestamosDevoluciones);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener préstamos y devoluciones' });
    }
});
exports.getAllPrestamos = getAllPrestamos;
const getAllDevoluciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prestamosDevoluciones = yield prisma.prestamoDevolucion.findMany({ where: {
                Status: false,
            } });
        res.json(prestamosDevoluciones);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener préstamos y devoluciones' });
    }
});
exports.getAllDevoluciones = getAllDevoluciones;
const deleteAllPrestamos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prestamos = yield prisma.prestamoDevolucion.deleteMany();
        res.json(prestamos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar préstamos' });
    }
});
exports.deleteAllPrestamos = deleteAllPrestamos;
const deletePrestamosByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Prestamo } = req.params;
    try {
        const prestamos = yield prisma.prestamoDevolucion.delete({
            where: { ID_Prestamo: Number(ID_Prestamo) },
        });
        res.json(prestamos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar préstamos' });
    }
});
exports.deletePrestamosByID = deletePrestamosByID;
const deleteAllDevoluciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const devoluciones = yield prisma.prestamoDevolucion.deleteMany();
        res.json(devoluciones);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar devoluciones' });
    }
});
exports.deleteAllDevoluciones = deleteAllDevoluciones;
const deleteDevolucionesByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Prestamo } = req.params;
    try {
        const devoluciones = yield prisma.prestamoDevolucion.delete({
            where: { ID_Prestamo: Number(ID_Prestamo) },
        });
        res.json(devoluciones);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar devoluciones' });
    }
});
exports.deleteDevolucionesByID = deleteDevolucionesByID;
// Controlador para crear un nuevo préstamo/devolución
const createPrestamo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { ISBN, ISSN, ID_Usuario } = req.body;
        // Verificar si el ISBN o ISSN existe en el inventario
        const inventario = ISBN
            ? yield prisma.inventario.findFirst({
                where: {
                    ISBN: ISBN,
                },
            })
            : ISSN
                ? yield prisma.inventario.findFirst({
                    where: {
                        ISSN: ISSN,
                    },
                })
                : null;
        if (!inventario || inventario.Copias_Disponibles <= 1) {
            return res.status(400).json({ error: 'No hay copias disponibles para préstamo' });
        }
        // Verificar si el usuario es candidato a préstamo
        const usuario = yield prisma.user.findUnique({
            where: { Correo_Usuario: ID_Usuario },
        });
        const gestionUsuario = yield prisma.gestionUsuario.findUnique({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
        });
        if (!gestionUsuario || !gestionUsuario.Candidato_Prestamo) {
            return res.status(400).json({ error: 'El usuario no es candidato a préstamo' });
        }
        // Obtener la fecha actual en formato YYYY-MM-DD
        const fechaPrestamo = new Date().toISOString().substring(0, 10);
        // Crear el préstamo/devolución
        const prestamo = yield prisma.prestamoDevolucion.create({
            data: {
                ISBN: inventario.ISBN,
                ISSN: inventario.ISSN,
                Status: true,
                Fecha_prestamo: fechaPrestamo,
                Fecha_devolucion: "",
                ID_Usuario: usuario.ID_Usuario, // Agregar el ID del usuario al préstamo
            },
        });
        // Actualizar el inventario
        yield prisma.inventario.update({
            where: {
                ID_Articulo: inventario.ID_Articulo,
            },
            data: {
                Copias_Disponibles: inventario.Copias_Disponibles - 1,
            },
        });
        console.log(usuario.ID_Usuario);
        yield prisma.gestionUsuario.update({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
            data: {
                Prestamos_Pendientes: gestionUsuario.Prestamos_Pendientes + 1,
            },
        });
        // Registrar el préstamo en el historial de préstamos
        yield prisma.historialPrestamo.create({
            data: {
                ID_Usuario: usuario.ID_Usuario,
                ID_Prestamo: prestamo.ID_Prestamo,
                Fecha_Prestamo: fechaPrestamo,
                Pendiente: true, // El préstamo está pendiente
            },
        });
        res.status(201).json(prestamo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear préstamo/devolución' });
    }
});
exports.createPrestamo = createPrestamo;
// Controlador para realizar una devolución
const realizarDevolucion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Prestamo } = req.params;
    try {
        // Verificar si el préstamo existe en la base de datos
        const prestamo = yield prisma.prestamoDevolucion.findUnique({
            where: { ID_Prestamo: Number(ID_Prestamo) },
        });
        const usuario = yield prisma.user.findUnique({
            where: { ID_Usuario: prestamo === null || prestamo === void 0 ? void 0 : prestamo.ID_Usuario },
        });
        if (!prestamo) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }
        // Verificar si el préstamo ya ha sido devuelto
        if (prestamo.Status === false) {
            return res.status(400).json({ error: 'El préstamo ya ha sido devuelto' });
        }
        // Obtener la fecha actual en formato YYYY-MM-DD
        const fechaDevolucion = new Date().toISOString().substring(0, 10);
        // Actualizar la fecha de devolución y establecer el estado del préstamo a devuelto
        const Devolucion = yield prisma.prestamoDevolucion.update({
            where: { ID_Prestamo: Number(ID_Prestamo) },
            data: {
                Fecha_devolucion: fechaDevolucion,
                Status: false,
            },
        });
        // Obtener ISBN o ISSN del préstamo
        const ISBN = Devolucion.ISBN;
        const ISSN = Devolucion.ISSN;
        // Actualizar el inventario
        const inventario = ISBN
            ? yield prisma.inventario.findFirst({
                where: {
                    ISBN: ISBN,
                },
            })
            : ISSN
                ? yield prisma.inventario.findFirst({
                    where: {
                        ISSN: ISSN,
                    },
                })
                : null;
        if (inventario) {
            yield prisma.inventario.update({
                where: {
                    ID_Articulo: inventario.ID_Articulo,
                },
                data: {
                    Copias_Disponibles: inventario.Copias_Disponibles + 1,
                },
            });
            yield prisma.gestionUsuario.update({
                where: {
                    ID_Usuario: usuario === null || usuario === void 0 ? void 0 : usuario.ID_Usuario,
                },
                data: {
                    Prestamos_Pendientes: -1,
                    Devoluciones_Realizadas: +1
                }
            });
        }
        // Buscar el registro correspondiente en el historial de préstamos
        const historialPrestamo = yield prisma.historialPrestamo.findUnique({
            where: {
                ID_Historial: Number(ID_Prestamo), // Utilizar ID_Historial en lugar de ID_Prestamo
            },
        });
        if (historialPrestamo) {
            // Actualizar el registro en el historial de préstamos como no pendiente
            yield prisma.historialPrestamo.update({
                where: {
                    ID_Historial: historialPrestamo.ID_Historial,
                },
                data: {
                    Pendiente: false,
                },
            });
        }
        res.json(Devolucion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al realizar la devolución' });
    }
});
exports.realizarDevolucion = realizarDevolucion;
