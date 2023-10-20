import { Request, Response } from 'express';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controlador para obtener todos los registros de CatalogoEditorial

export const getAllCatalogoEditoriales = async (req: Request, res: Response) => {
    try {
        const catalogoEditoriales = await prisma.catalogoEditorial.findMany();
        res.json(catalogoEditoriales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de editoriales' });
    }
};

// Controlador para obtener un CatalogoEditorial por su ID

export const getCatalogoEditorialById = async (req: Request, res: Response) => {
    const { id }: any = req.params;

    try {
        const catalogoEditorial = await prisma.catalogoEditorial.findUnique({
            where: {
                id_catalogo_editorial: Number(id),
            },
        });

        if (!catalogoEditorial) {
            return res.status(404).json({ error: 'Catalogo de editorial no encontrado' });
        }

        res.json(catalogoEditorial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de editorial por ID' });
    }
};

// Controlador para crear un registro de CatalogoEditorial

export const createCatalogoEditorial = async (req: Request, res: Response) => {
    const { nombre_editorial }: any = req.body;

    try {
        const catalogoEditorial = await prisma.catalogoEditorial.create({
            data: {
                nombre_catalogo_editorial: nombre_editorial,
            },
        });

        res.json(catalogoEditorial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear catalogo de editorial' });
    }
};

// Controlador para eliminar un registro de CatalogoEditorial

export const deleteCatalogoEditorial = async (req: Request, res: Response) => {
    const { id }: any = req.params;

    try {
        const catalogoEditorial = await prisma.catalogoEditorial.delete({
            where: {
                id_catalogo_editorial: Number(id),
            },
        });

        res.json(catalogoEditorial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar catalogo de editorial' });
    }
};

// Controlador para actualizar un registro de CatalogoEditorial

export const updateCatalogoEditorial = async (req: Request, res: Response) => {
    const { id }: any = req.params;
    const { nombre_editorial }: any = req.body;

    try {
        const catalogoEditorial = await prisma.catalogoEditorial.update({
            where: {
                id_catalogo_editorial: Number(id),
            },
            data: {
                nombre_catalogo_editorial: nombre_editorial,
            },
        });

        res.json(catalogoEditorial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar catalogo de editorial' });
    }
};