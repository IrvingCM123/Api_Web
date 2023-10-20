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
exports.eliminarRevista = exports.saveISSN = exports.registerMagazineInFirestore = exports.getAllAvailableISSNs = exports.getMagazineInfoByISSN = void 0;
const firebaseconfig_1 = require("../database/firebaseconfig");
const client_1 = require("@prisma/client");
const db = firebaseconfig_1.firebaseAdmin.firestore();
const prisma = new client_1.PrismaClient();
// Controlador para obtener información de una revista por ISSN desde Firestore
const getMagazineInfoByISSN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issn } = req.params;
    try {
        // Obtén el documento de la revista desde Firestore
        const magazineDoc = db.collection("Revistas").doc(issn);
        const magazine = yield magazineDoc.get();
        if (!magazine.exists) {
            return res
                .status(404)
                .json({ error: "Revista no encontrada en Firestore" });
        }
        const magazineData = magazine.data();
        res.json(magazineData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener información de la revista desde Firestore",
        });
    }
});
exports.getMagazineInfoByISSN = getMagazineInfoByISSN;
// Controlador para obtener todos los ISSN disponibles desde la base de datos configurada en schema.prisma
const getAllAvailableISSNs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revistas = yield prisma.revista.findMany();
        const availableISSNs = revistas.map((revista) => revista.ISSN);
        res.json(availableISSNs);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Error al obtener todos los ISSN disponibles" });
    }
});
exports.getAllAvailableISSNs = getAllAvailableISSNs;
// Controlador para registrar una revista en Firestore
const registerMagazineInFirestore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issn } = req.params;
    const { Titulo, Url_Portada, Resena, Autor, Clasificacion_Edad, Genero, Editorial, Fecha_Publicacion, PermitirVenta, PermitirPrestamo, PrecioVenta, } = req.body;
    try {
        // Verifica si la revista ya existe en Firestore
        const existingMagazine = db.collection("Revistas").doc(issn);
        const existing = yield existingMagazine.get();
        if (existing.exists) {
            return res
                .status(400)
                .json({ error: "La revista ya está registrada en Firestore" });
        }
        // Crea un nuevo documento con los datos de la revista
        yield db.collection("Revistas").doc(issn).set({
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
        // Guarda el ISSN en la base de datos usando el controlador saveISSN
        yield (0, exports.saveISSN)(issn);
        res.json({ message: "Revista registrada exitosamente en Firestore" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Error al registrar la revista en Firestore" });
    }
});
exports.registerMagazineInFirestore = registerMagazineInFirestore;
// Controlador para guardar un ISSN en la base de datos
const saveISSN = (issn) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRevista = yield prisma.revista.findUnique({
            where: {
                ISSN: issn,
            },
        });
        if (!existingRevista) {
            yield prisma.revista.create({
                data: {
                    ISSN: issn,
                },
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.saveISSN = saveISSN;
const eliminarRevista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issn } = req.params;
    try {
        const revista = yield prisma.revista.delete({
            where: { ISSN: issn },
        });
        res.json(revista);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la revista" });
    }
});
exports.eliminarRevista = eliminarRevista;
