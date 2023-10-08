import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Controlador para obtener el historial de préstamos de un usuario por su ID
export const getHistorialPrestamoByUserID = async (req: Request, res: Response) => {
    const { ID_Usuario } = req.params;

    try {

        const usuario = await prisma.user.findUnique({
            where: {
                Correo_Usuario: ID_Usuario,
            },
        });

        // Buscar el historial de préstamos y devoluciones del usuario
        const historialPrestamo = await prisma.historialPrestamo.findMany({
            where: {
                ID_Usuario: Number(usuario?.ID_Usuario),
                Pendiente: true
            },
            include: {
                User: true,
                PrestamoDevolucion: true,
            }
        });

        res.json(historialPrestamo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de préstamos ' });
    }
};

// Controlador para obtener el historial de préstamos y devoluciones de un usuario por su ID
export const getHistorialDevolcionesByUserID = async (req: Request, res: Response) => {
    const { ID_Usuario } = req.params;

    try {

        const usuario = await prisma.user.findUnique({
            where: {
                Correo_Usuario: ID_Usuario,
            },
        });

        // Buscar el historial de préstamos y devoluciones del usuario
        const historialPrestamo = await prisma.historialPrestamo.findMany({
            where: {
                ID_Usuario: Number(usuario?.ID_Usuario),
                Pendiente: false
            },
            include: {
                User: true,
                PrestamoDevolucion: true,
            }
        });

        res.json(historialPrestamo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de devoluciones' });
    }
};

// Controlador para crear un nuevo registro en el historial de préstamos y devoluciones
export const createHistorialPrestamo = async (req: Request, res: Response) => {
    try {
        const { ID_Usuario, ID_Prestamo, Fecha_Prestamo } = req.body;

        // Crear un nuevo registro en el historial de préstamos y devoluciones
        const historialPrestamo = await prisma.historialPrestamo.create({
            data: {
                ID_Usuario: Number(ID_Usuario),
                ID_Prestamo: Number(ID_Prestamo),
                Fecha_Prestamo,
                Pendiente: true, // Por defecto, el préstamo está pendiente
            },
        });

        // Contar la cantidad de préstamos en el historial del usuario
        const usuario = await prisma.user.findUnique({
            where: {
                Correo_Usuario: ID_Usuario,
            },
            include: {
                historial_prestamo: true,
            },
        });

        const cantidadPrestamos = usuario?.historial_prestamo.length || 0;

        // Actualizar el campo Candidato_Prestamo en GestionUsuario
        if (cantidadPrestamos >= 2) {
            await prisma.gestionUsuario.update({
                where: {
                    ID_Usuario: usuario?.ID_Usuario,
                },
                data: {
                    Candidato_Prestamo: false,
                },
            });
        } else {
            await prisma.gestionUsuario.update({
                where: {
                    ID_Usuario: usuario?.ID_Usuario,
                },
                data: {
                    Candidato_Prestamo: true,
                },
            });
        }

        res.status(201).json(historialPrestamo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear un registro en el historial de préstamos y devoluciones' });
    }
};


// Controlador para obtener todos los préstamos y devoluciones pendientes para un usuario específico
export const getPrestamosDevPendientesByUserID = async (req: Request, res: Response) => {
    const { ID_Usuario } = req.params;

    try {

        const usuario = await prisma.user.findUnique({
            where: {
                Correo_Usuario: ID_Usuario,
            },
        });

        // Buscar todos los registros pendientes en el historial de préstamos y devoluciones del usuario
        const prestamosDevPendientes = await prisma.historialPrestamo.findMany({
            where: {
                ID_Usuario: Number(usuario?.ID_Usuario),
                Pendiente: true,
            },
            include: {
                PrestamoDevolucion: true,
            },
        });

        res.json(prestamosDevPendientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los préstamos y devoluciones pendientes' });
    }
};



export const updateHistorialPrestamo = async (req: Request, res: Response) => {
    const { ID_Historial } = req.params;
    const { Fecha_Prestamo, Pendiente } = req.body;

    try {
        // Actualiza el registro en la base de datos
        const updatedHistorialPrestamo = await prisma.historialPrestamo.update({
            where: {
                ID_Historial: Number(ID_Historial),
            },
            data: {
                Fecha_Prestamo,
                Pendiente,
            },
        });

        res.json(updatedHistorialPrestamo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el registro de HistorialPrestamo' });
    }
};


export const deleteHistorialPrestamo = async (req: Request, res: Response) => {
    const { ID_Historial } = req.params;

    try {
        // Elimina el registro de la base de datos
        await prisma.historialPrestamo.delete({
            where: {
                ID_Historial: Number(ID_Historial),
            },
        });

        res.json({ message: 'Registro de HistorialPrestamo eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el registro de HistorialPrestamo' });
    }
};