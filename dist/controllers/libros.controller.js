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
exports.actualizarLibroByID = exports.eliminarLibroByID = exports.registerBookInFirestore = exports.saveISBN = exports.getAllAvailableISBNs = exports.ObtenerLibros = exports.getBookInfoByISBN = void 0;
const firebaseconfig_1 = require("../database/firebaseconfig");
const client_1 = require("@prisma/client");
const db = firebaseconfig_1.firebaseAdmin.firestore();
const prisma = new client_1.PrismaClient();
// Controlador para obtener información de un libro por ISBN desde Firestore
const getBookInfoByISBN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.params;
    try {
        // Obtén el documento del libro desde Firestore
        const bookDoc = db.collection("Libros").doc(isbn);
        const book = yield bookDoc.get();
        if (!book.exists) {
            return res
                .status(404)
                .json({ error: "Libro no encontrado en Firestore" });
        }
        const bookData = book.data();
        console.log(bookData, "bookData");
        res.json(bookData);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({
            error: "Error al obtener información del libro desde Firestore",
        });
    }
});
exports.getBookInfoByISBN = getBookInfoByISBN;
function ObtenerLibros(Libro) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtén el documento del libro desde Firestore
            const bookDoc = db.collection("Libros").doc(Libro);
            const book = yield bookDoc.get();
            if (!book.exists) {
                return ({ error: "Libro no encontrado en Firestore" });
            }
            const bookData = book.data();
            return (bookData);
        }
        catch (error) {
            console.error(error);
            return ({
                error: "Error al obtener información del libro desde Firestore",
            });
        }
    });
}
exports.ObtenerLibros = ObtenerLibros;
;
// Controlador para obtener todos los ISBN disponibles desde la base de datos configurada en schema.prisma
const getAllAvailableISBNs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const libros = yield prisma.libro.findMany();
        const availableISBNs = libros.map((libro) => libro.ISBN);
        res.json(availableISBNs);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Error al obtener todos los ISBN disponibles" });
    }
});
exports.getAllAvailableISBNs = getAllAvailableISBNs;
// Controlador para guardar un ISBN en la base de datos
const saveISBN = (isbn) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingLibro = yield prisma.libro.findUnique({
            where: {
                ISBN: isbn,
            },
        });
        if (!existingLibro) {
            yield prisma.libro.create({
                data: {
                    ISBN: isbn,
                },
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.saveISBN = saveISBN;
// Controlador para registrar libros en Firestore
const registerBookInFirestore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.params;
    const { Titulo, Url_Portada, Resena, Autor, Clasificacion_Edad, Genero, Editorial, Fecha_Publicacion, PermitirVenta, PermitirPrestamo, PrecioVenta, } = req.body;
    try {
        // Verifica si el libro ya existe en Firestore
        const existingBook = db.collection('Libros').doc(isbn);
        const existin = yield existingBook.get();
        if (existin.exists) {
            return res.status(400).json({ error: 'El libro ya está registrado en Firestore' });
        }
        // Crea un nuevo documento con los datos del libro
        yield db.collection('Libros').doc(isbn).set({
            Titulo,
            Url_Portada,
            Resena,
            Autor,
            Clasificacion_Edad,
            Genero,
            ISBN: isbn,
            Editorial,
            Fecha_Publicacion,
            PermitirVenta,
            PermitirPrestamo,
            PrecioVenta,
        });
        // Guarda el ISBN en la base de datos usando el controlador saveISBN
        yield (0, exports.saveISBN)(isbn);
        res.json({ message: 'Libro registrado exitosamente en Firestore' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el libro en Firestore' });
    }
});
exports.registerBookInFirestore = registerBookInFirestore;
const eliminarLibroByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.params;
    try {
        const deletedLibro = yield prisma.libro.delete({
            where: { ISBN: isbn },
        });
        res.json(deletedLibro);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
});
exports.eliminarLibroByID = eliminarLibroByID;
// Controlador para actualizar la información de un libro en Firestore
const actualizarLibroByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.params;
    const { Titulo, Url_Portada, Resena, Autor, Clasificacion_Edad, Genero, Editorial, Fecha_Publicacion, PermitirVenta, PermitirPrestamo, PrecioVenta, } = req.body;
    try {
        // Verifica si el libro ya existe en Firestore
        const existingBook = db.collection('Libros').doc(isbn);
        const existin = yield existingBook.get();
        if (!existin.exists) {
            return res.status(404).json({ error: 'El libro no está registrado en Firestore' });
        }
        // Actualiza el documento con los nuevos datos
        yield existingBook.update({
            Titulo,
            Url_Portada,
            Resena,
            Autor,
            Clasificacion_Edad,
            Genero,
            Editorial,
            Fecha_Publicacion,
            PermitirVenta,
            PermitirPrestamo,
            PrecioVenta,
        });
        res.json({ message: 'Información del libro actualizada exitosamente en Firestore' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la información del libro en Firestore' });
    }
});
exports.actualizarLibroByID = actualizarLibroByID;
