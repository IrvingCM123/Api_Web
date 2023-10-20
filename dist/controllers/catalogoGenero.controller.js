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
exports.deleteCatalogoGenero = exports.updateCatalogoGenero = exports.createCatalogoGenero = exports.getCatalogoGeneroById = exports.getAllCatalogoGeneros = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Controlador para obtener todos los registros de CatalogoGenero
const getAllCatalogoGeneros = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catalogoGeneros = yield prisma.catalogoGenero.findMany();
        res.json(catalogoGeneros);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de generos' });
    }
});
exports.getAllCatalogoGeneros = getAllCatalogoGeneros;
// Controlador para obtener un CatalogoGenero por su ID
const getCatalogoGeneroById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const catalogoGenero = yield prisma.catalogoGenero.findUnique({
            where: {
                id_catalogo_genero: Number(id),
            },
        });
        if (!catalogoGenero) {
            return res.status(404).json({ error: 'Catalogo de genero no encontrado' });
        }
        res.json(catalogoGenero);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de genero por ID' });
    }
});
exports.getCatalogoGeneroById = getCatalogoGeneroById;
// Controlador para crear un registro de CatalogoGenero
const createCatalogoGenero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_genero } = req.body;
    try {
        const catalogoGenero = yield prisma.catalogoGenero.create({
            data: {
                nombre_catalogo_genero: nombre_genero,
            },
        });
        res.json(catalogoGenero);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear catalogo de genero' });
    }
});
exports.createCatalogoGenero = createCatalogoGenero;
// Controlador para actualizar un registro de CatalogoGenero por su ID
const updateCatalogoGenero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre_genero } = req.body;
    try {
        const catalogoGenero = yield prisma.catalogoGenero.update({
            where: {
                id_catalogo_genero: Number(id),
            },
            data: {
                nombre_catalogo_genero: nombre_genero,
            },
        });
        res.json(catalogoGenero);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar catalogo de genero' });
    }
});
exports.updateCatalogoGenero = updateCatalogoGenero;
// Controlador para eliminar un registro de CatalogoGenero por su ID
const deleteCatalogoGenero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.catalogoGenero.delete({
            where: {
                id_catalogo_genero: Number(id),
            },
        });
        res.json({ message: 'Catalogo de genero eliminado exitosamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar catalogo de genero' });
    }
});
exports.deleteCatalogoGenero = deleteCatalogoGenero;
