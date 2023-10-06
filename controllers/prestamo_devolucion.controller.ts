import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Controlador para crear un nuevo préstamo/devolución
export const createPrestamoDevolucion = async (req: Request, res: Response) => {
    try {
        let { ISBN, ISSN, ID_Usuario, Status } = req.body;

        // Verificar si el ISBN o ISSN existe en la base de datos
        const libro = ISBN
            ? await prisma.libro.findUnique({
                  where: {
                      ISBN: ISBN,
                  },
              })
            : null;

        const revista = ISSN
            ? await prisma.revista.findUnique({
                  where: {
                      ISSN: ISSN,
                  },
              })
            : null;

        // Verificar si el usuario es candidato a préstamo
        const usuario: any = await prisma.user.findUnique({
            where: { Correo_Usuario: ID_Usuario },
        });

        const gestionUsuario = await prisma.gestionUsuario.findUnique({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
        });

        ID_Usuario = usuario.ID_Usuario;

        if (!gestionUsuario || !gestionUsuario.Candidato_Prestamo) {
            return res.status(400).json({ error: 'El usuario no es candidato a préstamo' });
        }

        // Obtener la fecha actual en formato YYYY-MM-DD
        const fechaPrestamo = new Date().toISOString().substring(0, 10);
        console.log(fechaPrestamo);

        // Crear el préstamo/devolución
        const prestamoDevolucion = await prisma.prestamoDevolucion.create({
            data: {
                ISBN: libro ? ISBN : null,
                ISSN: revista ? ISSN : null,
                ID_Usuario,
                Status,
                Fecha_prestamo: fechaPrestamo,
                Fecha_devolucion: "2023-11-05",
            },
        });

        res.status(201).json(prestamoDevolucion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear préstamo/devolución' });
    }
};


// Controlador para realizar una devolución
export const realizarDevolucion = async (req: Request, res: Response) => {
    const { ID_Prestamo } = req.params;

    try {
        // Verificar si el préstamo existe en la base de datos
        const prestamo = await prisma.prestamoDevolucion.findUnique({ where: { ID_Prestamo: Number(ID_Prestamo)} });

        if (!prestamo) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        // Verificar si el préstamo ya ha sido devuelto
        if (prestamo.Status === false) {
            return res.status(400).json({ error: 'El préstamo ya ha sido devuelto' });
        }

        // Obtener la fecha actual en formato YYYY-MM-DD
        const fechaDevolucion = new Date().toISOString().substring(0, 10);

        // Actualizar la fecha de devolución y establecer el estado del préstamo a devuelto
        const prestamoDevolucion = await prisma.prestamoDevolucion.update({
            where: { ID_Prestamo: Number(ID_Prestamo) },
            data: {
                Fecha_devolucion: fechaDevolucion,
                Status: false,
            },
        });

        res.json(prestamoDevolucion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al realizar la devolución' });
    }
};

// Controlador para obtener todos los préstamos y devoluciones
export const getAllPrestamosDevoluciones = async (req: Request, res: Response) => {
    try {
        const prestamosDevoluciones = await prisma.prestamoDevolucion.findMany();
        res.json(prestamosDevoluciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener préstamos y devoluciones' });
    }
};