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
exports.deleteCatalogoClasificacion = exports.updateCatalogoClasificacion = exports.createCatalogoClasificacion = exports.getCatalogoClasificacionById = exports.getAllCatalogoClasificaciones = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Controlador para obtener todos los registros de CatalogoClasificacion
const getAllCatalogoClasificaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catalogoClasificaciones = yield prisma.catalogoClasificacion.findMany();
        res.json(catalogoClasificaciones);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de clasificaciones' });
    }
});
exports.getAllCatalogoClasificaciones = getAllCatalogoClasificaciones;
// Controlador para obtener un CatalogoClasificacion por su ID
const getCatalogoClasificacionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const catalogoClasificacion = yield prisma.catalogoClasificacion.findUnique({
            where: {
                id_catalogo_clasificacion: Number(id),
            },
        });
        if (!catalogoClasificacion) {
            return res.status(404).json({ error: 'Catalogo de clasificacion no encontrado' });
        }
        res.json(catalogoClasificacion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de clasificacion por ID' });
    }
});
exports.getCatalogoClasificacionById = getCatalogoClasificacionById;
// Controlador para crear un registro de CatalogoClasificacion
const createCatalogoClasificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_clasificacion } = req.body;
    try {
        const catalogoClasificacion = yield prisma.catalogoClasificacion.create({
            data: {
                nombre_catalogo_clasificacion: nombre_clasificacion,
            },
        });
        res.json(catalogoClasificacion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear catalogo de clasificacion' });
    }
});
exports.createCatalogoClasificacion = createCatalogoClasificacion;
// Controlador para actualizar un registro de CatalogoClasificacion
const updateCatalogoClasificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre_clasificacion } = req.body;
    try {
        const catalogoClasificacion = yield prisma.catalogoClasificacion.update({
            where: {
                id_catalogo_clasificacion: Number(id),
            },
            data: {
                nombre_catalogo_clasificacion: nombre_clasificacion,
            },
        });
        res.json(catalogoClasificacion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar catalogo de clasificacion' });
    }
});
exports.updateCatalogoClasificacion = updateCatalogoClasificacion;
// Controlador para eliminar un registro de CatalogoClasificacion
const deleteCatalogoClasificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.catalogoClasificacion.delete({
            where: {
                id_catalogo_clasificacion: Number(id),
            },
        });
        res.json({ message: 'Catalogo de clasificacion eliminado correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar catalogo de clasificacion' });
    }
});
exports.deleteCatalogoClasificacion = deleteCatalogoClasificacion;
