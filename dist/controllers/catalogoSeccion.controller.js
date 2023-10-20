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
exports.deleteCatalogoSeccion = exports.updateCatalogoSeccion = exports.createCatalogoSeccion = exports.getCatalogoSeccionById = exports.getAllCatalogoSecciones = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Controlador para obtener todos los registros de CatalogoSeccion
const getAllCatalogoSecciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catalogoSecciones = yield prisma.catalogoSeccionBiblioteca.findMany();
        res.json(catalogoSecciones);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de secciones' });
    }
});
exports.getAllCatalogoSecciones = getAllCatalogoSecciones;
// Controlador para obtener un CatalogoSeccion por su ID
const getCatalogoSeccionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const catalogoSeccion = yield prisma.catalogoSeccionBiblioteca.findUnique({
            where: {
                id_catalogo_seccion_biblioteca: Number(id),
            },
        });
        if (!catalogoSeccion) {
            return res.status(404).json({ error: 'Catalogo de seccion no encontrado' });
        }
        res.json(catalogoSeccion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de seccion por ID' });
    }
});
exports.getCatalogoSeccionById = getCatalogoSeccionById;
// Controlador para crear un registro de CatalogoSeccion
const createCatalogoSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_seccion } = req.body;
    try {
        const catalogoSeccion = yield prisma.catalogoSeccionBiblioteca.create({
            data: {
                nombre_catalogo_seccion_biblioteca: nombre_seccion,
            },
        });
        res.json(catalogoSeccion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear catalogo de seccion' });
    }
});
exports.createCatalogoSeccion = createCatalogoSeccion;
// Controlador para actualizar un registro de CatalogoSeccion
const updateCatalogoSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre_seccion } = req.body;
    try {
        const catalogoSeccion = yield prisma.catalogoSeccionBiblioteca.update({
            where: {
                id_catalogo_seccion_biblioteca: Number(id),
            },
            data: {
                nombre_catalogo_seccion_biblioteca: nombre_seccion,
            },
        });
        res.json(catalogoSeccion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar catalogo de seccion' });
    }
});
exports.updateCatalogoSeccion = updateCatalogoSeccion;
// Controlador para eliminar un registro de CatalogoSeccion
const deleteCatalogoSeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const catalogoSeccion = yield prisma.catalogoSeccionBiblioteca.delete({
            where: {
                id_catalogo_seccion_biblioteca: Number(id),
            },
        });
        res.json(catalogoSeccion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar catalogo de seccion' });
    }
});
exports.deleteCatalogoSeccion = deleteCatalogoSeccion;
