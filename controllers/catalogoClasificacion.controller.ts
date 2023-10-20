import { Request, Response } from 'express';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controlador para obtener todos los registros de CatalogoClasificacion

export const getAllCatalogoClasificaciones = async (req: Request, res: Response) => {
    try {
        const catalogoClasificaciones = await prisma.catalogoClasificacion.findMany();
        res.json(catalogoClasificaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de clasificaciones' });
    }
};

// Controlador para obtener un CatalogoClasificacion por su ID

export const getCatalogoClasificacionById = async (req: Request, res: Response) => {
    const { id }: any = req.params;

    try {
        const catalogoClasificacion = await prisma.catalogoClasificacion.findUnique({
            where: {
                id_catalogo_clasificacion: Number(id),
            },
        });

        if (!catalogoClasificacion) {
            return res.status(404).json({ error: 'Catalogo de clasificacion no encontrado' });
        }

        res.json(catalogoClasificacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener catalogo de clasificacion por ID' });
    }
};

// Controlador para crear un registro de CatalogoClasificacion

export const createCatalogoClasificacion = async (req: Request, res: Response) => {
    const { nombre_clasificacion }: any = req.body;

    try {
        const catalogoClasificacion = await prisma.catalogoClasificacion.create({
            data: {
                nombre_catalogo_clasificacion: nombre_clasificacion,
            },
        });

        res.json(catalogoClasificacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear catalogo de clasificacion' });
    }
};

// Controlador para actualizar un registro de CatalogoClasificacion

export const updateCatalogoClasificacion = async (req: Request, res: Response) => {
    const { id }: any = req.params;
    const { nombre_clasificacion }: any = req.body;

    try {
        const catalogoClasificacion = await prisma.catalogoClasificacion.update({
            where: {
                id_catalogo_clasificacion: Number(id),
            },
            data: {
                nombre_catalogo_clasificacion: nombre_clasificacion,
            },
        });

        res.json(catalogoClasificacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar catalogo de clasificacion' });
    }
};

// Controlador para eliminar un registro de CatalogoClasificacion

export const deleteCatalogoClasificacion = async (req: Request, res: Response) => {
    const { id }: any = req.params;

    try {
        await prisma.catalogoClasificacion.delete({
            where: {
                id_catalogo_clasificacion: Number(id),
            },
        });

        res.json({ message: 'Catalogo de clasificacion eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar catalogo de clasificacion' });
    }
};
