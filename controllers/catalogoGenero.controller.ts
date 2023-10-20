import { Request, Response } from 'express';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controlador para obtener todos los registros de CatalogoGenero

export const getAllCatalogoGeneros = async (req: Request, res: Response) => {
    try {
        const catalogoGeneros = await prisma.catalogoGenero.findMany();
        res.json(catalogoGeneros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de generos' });
    }
};

// Controlador para obtener un CatalogoGenero por su ID

export const getCatalogoGeneroById = async (req: Request, res: Response) => {
    const { id }: any = req.params;

    try {
        const catalogoGenero = await prisma.catalogoGenero.findUnique({
            where: {
                id_catalogo_genero: Number(id),
            },
        });

        if (!catalogoGenero) {
            return res.status(404).json({ error: 'Catalogo de genero no encontrado' });
        }

        res.json(catalogoGenero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de genero por ID' });
    }
};

// Controlador para crear un registro de CatalogoGenero

export const createCatalogoGenero = async (req: Request, res: Response) => {
    const { nombre_genero }: any = req.body;

    try {
        const catalogoGenero = await prisma.catalogoGenero.create({
            data: {
                nombre_catalogo_genero: nombre_genero,
            },
        });

        res.json(catalogoGenero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear catalogo de genero' });
    }
};

// Controlador para actualizar un registro de CatalogoGenero por su ID

export const updateCatalogoGenero = async (req: Request, res: Response) => {
    const { id }: any = req.params;
    const { nombre_genero }: any = req.body;

    try {
        const catalogoGenero = await prisma.catalogoGenero.update({
            where: {
                id_catalogo_genero: Number(id),
            },
            data: {
                nombre_catalogo_genero: nombre_genero,
            },
        });

        res.json(catalogoGenero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar catalogo de genero' });
    }
};

// Controlador para eliminar un registro de CatalogoGenero por su ID

export const deleteCatalogoGenero = async (req: Request, res: Response) => {
    const { id }: any = req.params;

    try {
        await prisma.catalogoGenero.delete({
            where: {
                id_catalogo_genero: Number(id),
            },
        });
        res.json({ message: 'Catalogo de genero eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar catalogo de genero' });
    }
};