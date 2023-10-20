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
exports.updateCatalogoEditorial = exports.deleteCatalogoEditorial = exports.createCatalogoEditorial = exports.getCatalogoEditorialById = exports.getAllCatalogoEditoriales = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Controlador para obtener todos los registros de CatalogoEditorial
const getAllCatalogoEditoriales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catalogoEditoriales = yield prisma.catalogoEditorial.findMany();
        res.json(catalogoEditoriales);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de editoriales' });
    }
});
exports.getAllCatalogoEditoriales = getAllCatalogoEditoriales;
// Controlador para obtener un CatalogoEditorial por su ID
const getCatalogoEditorialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const catalogoEditorial = yield prisma.catalogoEditorial.findUnique({
            where: {
                id_catalogo_editorial: Number(id),
            },
        });
        if (!catalogoEditorial) {
            return res.status(404).json({ error: 'Catalogo de editorial no encontrado' });
        }
        res.json(catalogoEditorial);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de editorial por ID' });
    }
});
exports.getCatalogoEditorialById = getCatalogoEditorialById;
// Controlador para crear un registro de CatalogoEditorial
const createCatalogoEditorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_editorial } = req.body;
    try {
        const catalogoEditorial = yield prisma.catalogoEditorial.create({
            data: {
                nombre_catalogo_editorial: nombre_editorial,
            },
        });
        res.json(catalogoEditorial);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear catalogo de editorial' });
    }
});
exports.createCatalogoEditorial = createCatalogoEditorial;
// Controlador para eliminar un registro de CatalogoEditorial
const deleteCatalogoEditorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const catalogoEditorial = yield prisma.catalogoEditorial.delete({
            where: {
                id_catalogo_editorial: Number(id),
            },
        });
        res.json(catalogoEditorial);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar catalogo de editorial' });
    }
});
exports.deleteCatalogoEditorial = deleteCatalogoEditorial;
// Controlador para actualizar un registro de CatalogoEditorial
const updateCatalogoEditorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre_editorial } = req.body;
    try {
        const catalogoEditorial = yield prisma.catalogoEditorial.update({
            where: {
                id_catalogo_editorial: Number(id),
            },
            data: {
                nombre_catalogo_editorial: nombre_editorial,
            },
        });
        res.json(catalogoEditorial);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar catalogo de editorial' });
    }
});
exports.updateCatalogoEditorial = updateCatalogoEditorial;
