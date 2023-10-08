import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const isValidId = (id: string) => {
  return /^\d+$/.test(id);
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { Correo_Usuario: (id) },
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario por ID' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { url_imagen, Nombre_Usuario, Correo_Usuario, Contrasena_Usuario, ApellidoM_Usuario, ApellidoP_Usuario } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        url_imagen,
        Nombre_Usuario,
        Correo_Usuario,
        Contrasena_Usuario,
        ApellidoM_Usuario,
        ApellidoP_Usuario,
        // Agrega automáticamente una entrada en GestionUsuario
        gestion_usuarios: {
          create: {
            Candidato_Prestamo: true,
            Fecha_Registro: new Date().toISOString().substring(0, 10), // Fecha de registro actual en formato YYYY-MM-DD
            Devoluciones_Realizadas: 0,
            Prestamos_Pendientes: 0,
          },
        },
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { url_imagen, Nombre_Usuario, Correo_Usuario, Contrasena_Usuario, ApellidoM_Usuario, ApellidoP_Usuario } = req.body;
  if (!isValidId(id)) {
    return res.status(400).json({ error: 'ID no válido' });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { ID_Usuario: parseInt(id) },
      data: {
        url_imagen,
        Nombre_Usuario,
        Correo_Usuario,
        Contrasena_Usuario,
        ApellidoM_Usuario,
        ApellidoP_Usuario
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  if (!isValidId(id)) {
    return res.status(400).json({ error: 'ID no válido' });
  }
  try {
    await prisma.user.delete({
      where: { ID_Usuario: parseInt(id) },
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
