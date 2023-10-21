import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Controlador para crear un nuevo registro en el inventario
export const createInventario = async (req: Request, res: Response) => {
    try {
        const {
            Seccion_Biblioteca,
            Numero_Copias,
            Copias_Disponibles,
            Copias_Disponibles_minimas,
        } = req.body;

        // Datos opcionales
        const { ISBN, ISSN, revista, libro } = req.body;

        // Filtrar campos opcionales que no son nulos
        const data: any = {
            Seccion_Biblioteca,
            Numero_Copias,
            Copias_Disponibles,
            Copias_Disponibles_minimas,
        };

        if (ISBN) {
            data.ISBN = ISBN;
        }
        if (ISSN) {
            data.ISSN = ISSN;
        }
        if (revista) {
            data.revista = revista;
        }
        if (libro) {
            data.libro = libro;
        }

        // Crear un nuevo registro en el inventario
        try {
            const inventario = await prisma.inventario.create({
                data,
            });
            res.status(201).json(inventario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear un registro en el inventario' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear un registro en el inventario' });
    }
};


// Controlador para obtener todos los registros de inventario
export const getAllInventario = async (req: Request, res: Response) => {
    try {
        const inventario = await prisma.inventario.findMany({
            include:
            {
                libro: true,
                revista: true,
            },
        });
        res.json(inventario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener registros de inventario' });
    }
};

// Controlador para obtener un registro de inventario por su ID
export const getInventarioByID = async (req: Request, res: Response) => {
    const { ID_Articulo } = req.params;
    try {
        const inventario = await prisma.inventario.findFirst({
            where: {
                OR: [
                    {
                        ISBN: ID_Articulo
                    },
                    {
                        ISSN: ID_Articulo
                    }
                ]
            }
        });

        if (!inventario) {
            return res.status(404).json({ error: 'Registro de inventario no encontrado' });
        }
        res.json(inventario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener un registro de inventario' });
    }
};

// Controlador para actualizar un registro de inventario por su ID
export const updateInventarioByID = async (req: Request, res: Response) => {
    const { ID_Articulo } = req.params;
    const {
        ISBN,
        ISSN,
        revista,
        libro,
        Seccion_Biblioteca,
        Numero_Copias,
        Copias_Disponibles,
        Copias_Disponibles_minimas,
    } = req.body;

    try {
        // Verificar si el registro de inventario existe
        const inventarioExistente = await prisma.inventario.findFirst({
            where: {
                OR: [
                    {
                        ISBN: ID_Articulo
                    },
                    {
                        ISSN: ID_Articulo
                    }
                ]
            }
        });
        
        if (!inventarioExistente) {
            return res.status(404).json({ error: 'Registro de inventario no encontrado' });
        }

        // Actualizar el registro de inventario
        const inventarioActualizado = await prisma.inventario.update({
            where: { ID_Articulo: inventarioExistente.ID_Articulo },
            data: {
                Seccion_Biblioteca,
                Numero_Copias,
                Copias_Disponibles,
                Copias_Disponibles_minimas,
            },
        });

        res.json(inventarioActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el registro de inventario' });
    }
};

// Controlador para eliminar un registro de inventario por su ISBN o ISSN
export const deleteInventarioByISBNorISSN = async (req: Request, res: Response) => {
    const { ID_Articulo } = req.params;
    try {
        // Verificar si el registro de inventario existe
        const inventarioExistente = await prisma.inventario.findFirst({
            where: {
                OR: [
                    {
                        ISBN: ID_Articulo
                    },
                    {
                        ISSN: ID_Articulo
                    }
                ]
            }
        });
        if (!inventarioExistente) {
            return res.status(404).json({ error: 'Registro de inventario no encontrado' });
        }

        // Eliminar el registro de inventario
        await prisma.inventario.delete({
            where: {
                ID_Articulo: inventarioExistente.ID_Articulo
            }
        });

        res.json({ message: 'Registro de inventario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el registro de inventario' });
    }
};

