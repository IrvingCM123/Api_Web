import { Request, Response } from 'express';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controlador para obtener todos los registros de CatalogoSeccion

export const getAllCatalogoSecciones = async (req: Request, res: Response) => {
    try {
        const catalogoSecciones = await prisma.catalogoSeccionBiblioteca.findMany();
        res.json(catalogoSecciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de secciones' });
    }
};

// Controlador para obtener un CatalogoSeccion por su ID

export const getCatalogoSeccionById = async (req: Request, res: Response) => {
    const { id }: any = req.params;

    try {
        const catalogoSeccion = await prisma.catalogoSeccionBiblioteca.findUnique({
            where: {
                id_catalogo_seccion_biblioteca: Number(id),
            },
        });

        if (!catalogoSeccion) {
            return res.status(404).json({ error: 'Catalogo de seccion no encontrado' });
        }

        res.json(catalogoSeccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de seccion por ID' });
    }
};

// Controlador para crear un registro de CatalogoSeccion

export const createCatalogoSeccion = async (req: Request, res: Response) => {
    const { nombre_seccion }: any = req.body;

    try {
        const catalogoSeccion = await prisma.catalogoSeccionBiblioteca.create({
            data: {
                nombre_catalogo_seccion_biblioteca: nombre_seccion,
            },
        });

        res.json(catalogoSeccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear catalogo de seccion' });
    }
};

// Controlador para actualizar un registro de CatalogoSeccion

export const updateCatalogoSeccion = async (req: Request, res: Response) => {
    const { id }: any = req.params;
    const { nombre_seccion }: any = req.body;

    try {
        const catalogoSeccion = await prisma.catalogoSeccionBiblioteca.update({
            where: {
                id_catalogo_seccion_biblioteca: Number(id),
            },
            data: {
                nombre_catalogo_seccion_biblioteca: nombre_seccion,
            },
        });

        res.json(catalogoSeccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar catalogo de seccion' });
    }
};

// Controlador para eliminar un registro de CatalogoSeccion

export const deleteCatalogoSeccion = async (req: Request, res: Response) => {
    const { id }: any = req.params;

    try {
        const catalogoSeccion = await prisma.catalogoSeccionBiblioteca.delete({
            where: {
                id_catalogo_seccion_biblioteca: Number(id),
            },
        });

        res.json(catalogoSeccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar catalogo de seccion' });
    }
};