import { firebaseAdmin } from "../database/firebaseconfig";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const db = firebaseAdmin.firestore();

const prisma = new PrismaClient();

// Controlador para obtener información de una revista por ISSN desde Firestore
export const getMagazineInfoByISSN = async (req: Request, res: Response) => {
    const { issn } = req.params;

    try {
        // Obtén el documento de la revista desde Firestore
        const magazineDoc = db.collection("Revistas").doc(issn);

        const magazine = await magazineDoc.get();

        if (!magazine.exists) {
            return res
                .status(404)
                .json({ error: "Revista no encontrada en Firestore" });
        }

        const magazineData = magazine.data();
        res.json(magazineData);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener información de la revista desde Firestore",
        });
    }
};

export async function ObtenerRevistas(Revista: any) {
    try {
        // Obtén el documento de la revista desde Firestore
        const magazineDoc = db.collection("Revistas").doc(Revista);

        const magazine = await magazineDoc.get();

        if (!magazine.exists) {
            return ({ error: "Revista no encontrada en Firestore" });
        }

        const magazineData = magazine.data();
        return (magazineData);
    } catch (error) {
        console.error(error);
        return ({
            error: "Error al obtener información de la revista desde Firestore",
        });
    }
}
// Controlador para obtener todos los ISSN disponibles desde la base de datos configurada en schema.prisma
export const getAllAvailableISSNs = async (req: Request, res: Response) => {
    try {
        const revistas = await prisma.revista.findMany();
        const availableISSNs = revistas.map((revista) => revista.ISSN);
        res.json(availableISSNs);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Error al obtener todos los ISSN disponibles" });
    }
};

// Controlador para registrar una revista en Firestore
export const registerMagazineInFirestore = async (
    req: Request,
    res: Response
) => {
    const { issn } = req.params;
    const {
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
    } = req.body;

    try {
        // Verifica si la revista ya existe en Firestore
        const existingMagazine = db.collection("Revistas").doc(issn);
        const existing = await existingMagazine.get();

        if (existing.exists) {
            return res
                .status(400)
                .json({ error: "La revista ya está registrada en Firestore" });
        }

        // Crea un nuevo documento con los datos de la revista
        await db.collection("Revistas").doc(issn).set({
            Titulo,
            Url_Portada,
            Resena,
            Autor,
            Clasificacion_Edad,
            Genero,
            ISSN: issn,
            Editorial,
            Fecha_Publicacion,
            PermitirVenta,
            PermitirPrestamo,
            PrecioVenta,
        });

        // Guarda el ISSN en la base de datos usando el controlador saveISSN
        await saveISSN(issn);

        res.json({ message: "Revista registrada exitosamente en Firestore" });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Error al registrar la revista en Firestore" });
    }
};

// Controlador para guardar un ISSN en la base de datos
export const saveISSN = async (issn: string) => {
    try {
        const existingRevista = await prisma.revista.findUnique({
            where: {
                ISSN: issn,
            },
        });

        if (!existingRevista) {
            await prisma.revista.create({
                data: {
                    ISSN: issn,
                },
            });
        }
    } catch (error) {
        console.error(error);
    }
};

export const eliminarRevista = async (req: Request, res: Response) => {
    const { issn } = req.params;
    try {
        const revista = await prisma.revista.delete({
            where: { ISSN: issn },
        });
        res.json(revista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la revista" });
    }
};
