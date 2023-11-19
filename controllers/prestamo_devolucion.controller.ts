import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { ObtenerLibros } from './libros.controller';

import { ObtenerRevistas } from './revistas.controller';

const prisma = new PrismaClient();

// Controlador para obtener todos los préstamos y devoluciones
export const getAllPrestamos = async (req: Request, res: Response) => {
    try {
        let prestamosDevoluciones: any = await prisma.prestamoDevolucion.findMany(
            {
                where: {
                    Status: true,
                }
            }
        );

        for (let i = 0; i < prestamosDevoluciones.length; i++) {
            let usuario = await prisma.user.findFirst({
                where: {
                    ID_Usuario: prestamosDevoluciones[i].ID_Usuario,
                },
                select: {
                    Correo_Usuario: true,
                }
            });
            prestamosDevoluciones[i].ID_Usuario = usuario?.Correo_Usuario;
        }

        for (let i = 0; i < prestamosDevoluciones.length; i++) {

            if (prestamosDevoluciones[i].ISBN != null) {
                let isbn = prestamosDevoluciones[i].ISBN;
                let articulo:any = await ObtenerLibros(isbn);
                prestamosDevoluciones[i].Titulo = articulo?.Titulo;
                console.log("Entro")
            }
            if (prestamosDevoluciones[i].ISSN != null) {
                let issn = prestamosDevoluciones[i].ISSN;
                let articulo:any = await ObtenerRevistas(issn);
                prestamosDevoluciones[i].Titulo = articulo?.Titulo;
                console.log("Entro 2")
            }

            console.log(prestamosDevoluciones[i].Titulo);
        }

        res.json(prestamosDevoluciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener préstamos y devoluciones' });
    }
};

export const getAllDevoluciones = async (req: Request, res: Response) => {
    try {
        const prestamosDevoluciones: any = await prisma.prestamoDevolucion.findMany(
            {
                where: {
                    Status: false,
                }
            }
        );

        for (let i = 0; i < prestamosDevoluciones.length; i++) {
            let usuario = await prisma.user.findFirst({
                where: {
                    ID_Usuario: prestamosDevoluciones[i].ID_Usuario,
                },
                select: {
                    Correo_Usuario: true,
                }
            });
            prestamosDevoluciones[i].ID_Usuario = usuario?.Correo_Usuario;
        }

        for (let i = 0; i < prestamosDevoluciones.length; i++) {

            if (prestamosDevoluciones[i].ISBN != null) {
                let isbn = prestamosDevoluciones[i].ISBN;
                let articulo:any = await ObtenerLibros(isbn);
                prestamosDevoluciones[i].Titulo = articulo?.Titulo;
                console.log("Entro")
            }
            if (prestamosDevoluciones[i].ISSN != null) {
                let issn = prestamosDevoluciones[i].ISSN;
                let articulo:any = await ObtenerRevistas(issn);
                prestamosDevoluciones[i].Titulo = articulo?.Titulo;
                console.log("Entro 2")
            }
        }


        res.json(prestamosDevoluciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener préstamos y devoluciones' });
    }
};


export const deleteAllPrestamos = async (req: Request, res: Response) => {
    try {
        const prestamos = await prisma.prestamoDevolucion.deleteMany();
        res.json(prestamos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar préstamos' });
    }
}

export const deletePrestamosByID = async (req: Request, res: Response) => {
    const { ID_Prestamo } = req.params;
    try {
        const prestamos = await prisma.prestamoDevolucion.delete({
            where: { ID_Prestamo: Number(ID_Prestamo) },
        });
        res.json(prestamos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar préstamos' });
    }
}

export const deleteAllDevoluciones = async (req: Request, res: Response) => {
    try {
        const devoluciones = await prisma.prestamoDevolucion.deleteMany();
        res.json(devoluciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar devoluciones' });
    }
}

export const deleteDevolucionesByID = async (req: Request, res: Response) => {
    const { ID_Prestamo } = req.params;
    try {
        const devoluciones = await prisma.prestamoDevolucion.delete({
            where: { ID_Prestamo: Number(ID_Prestamo) },
        });
        res.json(devoluciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar devoluciones' });
    }
}
// Controlador para crear un nuevo préstamo/devolución
export const createPrestamo = async (req: Request, res: Response) => {
    try {
        let { ISBN, ISSN, ID_Usuario } = req.body;

        // Verificar si el ISBN o ISSN existe en el inventario
        const inventario = ISBN
            ? await prisma.inventario.findFirst({
                where: {
                    ISBN: ISBN,
                },
            })
            : ISSN
                ? await prisma.inventario.findFirst({
                    where: {
                        ISSN: ISSN,
                    },
                })
                : null;

        if (!inventario || inventario.Copias_Disponibles <= 1) {
            return res.status(400).json({ error: 'No hay copias disponibles para préstamo' });
        }

        // Verificar si el usuario es candidato a préstamo
        const usuario: any = await prisma.user.findUnique({
            where: { Correo_Usuario: ID_Usuario },

        });

        const gestionUsuario: any = await prisma.gestionUsuario.findUnique({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
        });

        if (gestionUsuario.Prestamos_Pendientes >= 3) {
            await prisma.gestionUsuario.update({
                where: {
                    ID_Usuario: usuario.ID_Usuario,
                },
                data: {
                    Candidato_Prestamo: false,
                },
            });
        } else {
            await prisma.gestionUsuario.update({
                where: {
                    ID_Usuario: usuario.ID_Usuario,
                },
                data: {
                    Candidato_Prestamo: true,
                },
            });
        }

        if (!gestionUsuario || !gestionUsuario.Candidato_Prestamo) {
            return res.status(400).json({ error: 'El usuario no es candidato a préstamo' });
        }

        // Obtener la fecha actual en formato YYYY-MM-DD
        const fechaPrestamo = new Date().toISOString().substring(0, 10);

        // Crear el préstamo/devolución
        const prestamo = await prisma.prestamoDevolucion.create({
            data: {
                ISBN: inventario.ISBN,
                ISSN: inventario.ISSN,
                Status: true,
                Fecha_prestamo: fechaPrestamo,
                Fecha_devolucion: "", // La fecha de devolución se actualizará cuando se realice la devolución
                ID_Usuario: usuario.ID_Usuario, // Agregar el ID del usuario al préstamo
            },
        });

        // Actualizar el inventario
        await prisma.inventario.update({
            where: {
                ID_Articulo: inventario.ID_Articulo,
            },
            data: {
                Copias_Disponibles: inventario.Copias_Disponibles - 1,
            },
        });

        console.log(usuario.ID_Usuario);

        await prisma.gestionUsuario.update({
            where: {
                ID_Usuario: usuario.ID_Usuario,
            },
            data: {
                Prestamos_Pendientes: gestionUsuario.Prestamos_Pendientes + 1,
            },
        });

        // Registrar el préstamo en el historial de préstamos
        await prisma.historialPrestamo.create({
            data: {
                ID_Usuario: usuario.ID_Usuario,
                ID_Prestamo: prestamo.ID_Prestamo,
                Fecha_Prestamo: fechaPrestamo,
                Pendiente: true, // El préstamo está pendiente
            },
        });

        res.status(201).json(prestamo);
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
        const prestamo = await prisma.prestamoDevolucion.findUnique({
            where: { ID_Prestamo: Number(ID_Prestamo) },
        });

        const usuario = await prisma.user.findUnique({
            where: { ID_Usuario: prestamo?.ID_Usuario },
        });

        const gestionUsuario: any = await prisma.gestionUsuario.findUnique({
            where: {
                ID_Usuario: usuario?.ID_Usuario,
            },
        });

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
        const Devolucion = await prisma.prestamoDevolucion.update({
            where: { ID_Prestamo: Number(ID_Prestamo) },
            data: {
                Fecha_devolucion: fechaDevolucion,
                Status: false,
            },
        });

        // Obtener ISBN o ISSN del préstamo
        const ISBN = Devolucion.ISBN;
        const ISSN = Devolucion.ISSN;

        // Actualizar el inventario
        const inventario = ISBN
            ? await prisma.inventario.findFirst({
                where: {
                    ISBN: ISBN,
                },
            })
            : ISSN
                ? await prisma.inventario.findFirst({
                    where: {
                        ISSN: ISSN,
                    },
                })
                : null;

        if (inventario) {
            await prisma.inventario.update({
                where: {
                    ID_Articulo: inventario.ID_Articulo,
                },
                data: {
                    Copias_Disponibles: inventario.Copias_Disponibles + 1,
                },
            });

            await prisma.gestionUsuario.update({
                where: {
                    ID_Usuario: usuario?.ID_Usuario,
                },
                data: {
                    Prestamos_Pendientes: gestionUsuario.Prestamos_Pendientes - 1,
                    Devoluciones_Realizadas: gestionUsuario.Devoluciones_Realizadas + 1,
                }
            });

            if (gestionUsuario.Prestamos_Pendientes < 3) {
                await prisma.gestionUsuario.update({
                    where: {
                        ID_Usuario: usuario?.ID_Usuario,
                    },
                    data: {
                        Candidato_Prestamo: true,
                    }
                });
            }

        }

        // Buscar el registro correspondiente en el historial de préstamos
        const historialPrestamo = await prisma.historialPrestamo.findUnique({
            where: {
                ID_Historial: Number(ID_Prestamo), // Utilizar ID_Historial en lugar de ID_Prestamo
            },
        });

        if (historialPrestamo) {
            // Actualizar el registro en el historial de préstamos como no pendiente
            await prisma.historialPrestamo.update({
                where: {
                    ID_Historial: historialPrestamo.ID_Historial,
                },
                data: {
                    Pendiente: false,
                },
            });
        }

        res.json(Devolucion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al realizar la devolución' });
    }
};
