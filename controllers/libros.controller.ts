import { firebaseAdmin } from "../database/firebaseconfig";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const db = firebaseAdmin.firestore();

const prisma = new PrismaClient();

// Controlador para obtener información de un libro por ISBN desde Firestore
export const getBookInfoByISBN = async (req: Request, res: Response) => {
    const { isbn } = req.params;
    try {
        // Obtén el documento del libro desde Firestore
        const bookDoc = db.collection("Libros").doc(isbn);

        const book = await bookDoc.get();
        if (!book.exists) {
            return res
                .status(404)
                .json({ error: "Libro no encontrado en Firestore" });
        }

        const bookData = book.data();
        console.log(bookData, "bookData");
        res.json(bookData);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({
                error: "Error al obtener información del libro desde Firestore",
            });
    }
};

export async function ObtenerLibros(Libro: any) {
    try {
        // Obtén el documento del libro desde Firestore
        const bookDoc = db.collection("Libros").doc(Libro);

        const book = await bookDoc.get();
        if (!book.exists) {
            return ({ error: "Libro no encontrado en Firestore" });
        }

        const bookData = book.data();
        return (bookData);
    } catch (error) {
        console.error(error);
        return ({
                error: "Error al obtener información del libro desde Firestore",
            });
    }
};

// Controlador para obtener todos los ISBN disponibles desde la base de datos configurada en schema.prisma
export const getAllAvailableISBNs = async (req: Request, res: Response) => {
    try {
        const libros = await prisma.libro.findMany();
        const availableISBNs = libros.map((libro) => libro.ISBN);
        res.json(availableISBNs);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Error al obtener todos los ISBN disponibles" });
    }
};


// Controlador para guardar un ISBN en la base de datos
export const saveISBN = async (isbn: string) => {
    try {
        const existingLibro = await prisma.libro.findUnique({
            where: {
                ISBN: isbn,
            },
        });

        if (!existingLibro) {
            await prisma.libro.create({
                data: {
                    ISBN: isbn,
                },
            });
        }
    } catch (error) {
        console.error(error);
    }
};


// Controlador para registrar libros en Firestore
export const registerBookInFirestore = async (req: Request, res: Response) => {
    const { isbn } = req.params;
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
        // Verifica si el libro ya existe en Firestore
        const existingBook = db.collection('Libros').doc(isbn);
        const existin = await existingBook.get();
        if (existin.exists) {
            return res.status(400).json({ error: 'El libro ya está registrado en Firestore' });
        }

        // Crea un nuevo documento con los datos del libro
        await db.collection('Libros').doc(isbn).set({
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
        await saveISBN(isbn);

        res.json({ message: 'Libro registrado exitosamente en Firestore' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el libro en Firestore' });
    }
};

export const eliminarLibroByID = async (req: Request, res: Response) => {
    const { isbn } = req.params;
    try {
        const deletedLibro = await prisma.libro.delete({
            where: { ISBN: isbn },
        });
        res.json(deletedLibro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
}

// Controlador para actualizar la información de un libro en Firestore
export const actualizarLibroByID = async (req: Request, res: Response) => {
    const { isbn } = req.params;
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
        // Verifica si el libro ya existe en Firestore
        const existingBook = db.collection('Libros').doc(isbn);
        const existin = await existingBook.get();

        if (!existin.exists) {
            return res.status(404).json({ error: 'El libro no está registrado en Firestore' });
        }

        // Actualiza el documento con los nuevos datos
        await existingBook.update({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la información del libro en Firestore' });
    }
};
