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
exports.deleteInventarioByID = exports.updateInventarioByID = exports.getInventarioByID = exports.getAllInventario = exports.createInventario = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Controlador para crear un nuevo registro en el inventario
const createInventario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Seccion_Biblioteca, Numero_Copias, Copias_Disponibles, Copias_Disponibles_minimas, } = req.body;
        // Datos opcionales
        const { ISBN, ISSN, revista, libro } = req.body;
        // Filtrar campos opcionales que no son nulos
        const data = {
            Seccion_Biblioteca,
            Numero_Copias,
            Copias_Disponibles,
            Copias_Disponibles_minimas,
        };
        if (ISBN) {
            data.ISBN = ISBN;
        }
        if (ISSN) {
            data.ISSN = ISSN;
        }
        if (revista) {
            data.revista = revista;
        }
        if (libro) {
            data.libro = libro;
        }
        // Crear un nuevo registro en el inventario
        const inventario = yield prisma.inventario.create({
            data,
        });
        res.status(201).json(inventario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear un registro en el inventario' });
    }
});
exports.createInventario = createInventario;
// Controlador para obtener todos los registros de inventario
const getAllInventario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventario = yield prisma.inventario.findMany({
            include: {
                libro: true,
                revista: true,
            },
        });
        res.json(inventario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener registros de inventario' });
    }
});
exports.getAllInventario = getAllInventario;
// Controlador para obtener un registro de inventario por su ID
const getInventarioByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Articulo } = req.params;
    try {
        const inventario = yield prisma.inventario.findUnique({
            where: { ID_Articulo: Number(ID_Articulo) },
        });
        if (!inventario) {
            return res.status(404).json({ error: 'Registro de inventario no encontrado' });
        }
        res.json(inventario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener un registro de inventario' });
    }
});
exports.getInventarioByID = getInventarioByID;
// Controlador para actualizar un registro de inventario por su ID
const updateInventarioByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Articulo } = req.params;
    const { ISBN, ISSN, revista, libro, Seccion_Biblioteca, Numero_Copias, Copias_Disponibles, Copias_Disponibles_minimas, } = req.body;
    try {
        // Verificar si el registro de inventario existe
        const inventarioExistente = yield prisma.inventario.findUnique({
            where: { ID_Articulo: Number(ID_Articulo) },
        });
        if (!inventarioExistente) {
            return res.status(404).json({ error: 'Registro de inventario no encontrado' });
        }
        // Actualizar el registro de inventario
        const inventarioActualizado = yield prisma.inventario.update({
            where: { ID_Articulo: Number(ID_Articulo) },
            data: {
                ISBN: ISBN || null,
                ISSN: ISSN || null,
                revista: revista || null,
                libro: libro || null,
                Seccion_Biblioteca,
                Numero_Copias,
                Copias_Disponibles,
                Copias_Disponibles_minimas,
            },
        });
        res.json(inventarioActualizado);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el registro de inventario' });
    }
});
exports.updateInventarioByID = updateInventarioByID;
// Controlador para eliminar un registro de inventario por su ID
const deleteInventarioByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_Articulo } = req.params;
    try {
        // Verificar si el registro de inventario existe
        const inventarioExistente = yield prisma.inventario.findUnique({
            where: { ID_Articulo: Number(ID_Articulo) },
        });
        if (!inventarioExistente) {
            return res.status(404).json({ error: 'Registro de inventario no encontrado' });
        }
        // Eliminar el registro de inventario
        yield prisma.inventario.delete({
            where: { ID_Articulo: Number(ID_Articulo) },
        });
        res.json({ message: 'Registro de inventario eliminado correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el registro de inventario' });
    }
});
exports.deleteInventarioByID = deleteInventarioByID;
