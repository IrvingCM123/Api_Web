import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as user_controller from '../controllers/user.controller';
const prisma = new PrismaClient();

// Validador para ID de Usuario
export const isValidUserId = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            ID_Usuario: userId,
        },
    });
    return !!user;
};

// Validador para Fecha de Registro (debe tener un formato específico)
export const isValidFechaRegistro = (fecha: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
};

// Controlador para obtener todos los registros de GestionUsuario
// Controlador para obtener todos los registros de GestionUsuario con información de usuario
export const getAllGestionUsuarios = async (req: Request, res: Response) => {
    try {
        const gestionUsuarios: any = await prisma.gestionUsuario.findMany();
        const usuariosPromises = gestionUsuarios.map(async (gestionUsuario: any) => {
            const usuario: any = await prisma.user.findUnique({
                where: {
                    ID_Usuario: gestionUsuario.ID_Usuario,
                },
            });
            return { ...gestionUsuario, Correo_Usuario: usuario?.Correo_Usuario };
        });

        const gestionUsuariosConUsuarios = await Promise.all(usuariosPromises);
        res.json(gestionUsuariosConUsuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener gestión de usuarios' });
    }
};

// Controlador para obtener un GestionUsuario por su ID
export const getGestionUsuarioById = async (req: Request, res: Response) => {
    const { id }: any = req.params; // El "id" aquí será el correo electrónico

    try {
        // Buscar al usuario por correo electrónico
        const usuario = await prisma.user.findUnique({
            where: { Correo_Usuario: (id) },
        });
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Utilizar el ID del usuario para buscar el "gestionUsuario"
        const gestionUsuario = await prisma.gestionUsuario.findUnique({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
        });

        if (!gestionUsuario) {
            return res.status(404).json({ error: 'Gestión de usuario no encontrada' });
        }

        // Combinar la información del usuario con la información de gestión
        const gestionUsuarioConUsuario = { ...gestionUsuario, Correo_Usuario: usuario.Correo_Usuario, Nombre: usuario.Nombre_Usuario };
        res.json(gestionUsuarioConUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener gestión de usuario por ID' });
    }
};


// Controlador para actualizar un registro de GestionUsuario por su ID
export const updateGestionUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Candidato_Prestamo } = req.body;

    const usuario: any = await prisma.user.findUnique({
        where: {
            Correo_Usuario: id,
        },
    });

    try {
        const gestionUsuario = await prisma.gestionUsuario.update({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
            data: {
                Candidato_Prestamo,
            },
        });
        res.json(gestionUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar gestión de usuario' });
    }
};

// Controlador para eliminar un registro de GestionUsuario por su ID
export const deleteGestionUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!isValidUserId(Number(id))) {
        return res.status(404).json({ error: 'Gestión de usuario no encontrada' });
    }

    try {
        await prisma.gestionUsuario.delete({
            where: {
                ID_Usuario: Number(id),
            },
        });
        res.json({ message: 'Gestión de usuario eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar gestión de usuario' });
    }
};
