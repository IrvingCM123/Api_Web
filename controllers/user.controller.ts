import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const secretKey = "Lolita";

export const isValidId = (id: string) => {
  return /^\d+$/.test(id);
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const user = await prisma.user.findUnique({
      where: { Correo_Usuario: id },
    });
    console.log("");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuario por ID" });
  }
};

export const ObtenerInfoUsuario = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  let separar = authorization?.split(" ");
  let Token = separar![1];
  const decoded = jwt.verify(Token, secretKey);
  const { email } = decoded as { email: string };
  
  let id = email;
  req.params.id = id;
  try {
    const user = getUserByEmail(req, res);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await user;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuario por ID" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const {
    Nombre_Usuario,
    Correo_Usuario,
    Contrasena_Usuario,
    Apellido_Materno,
    Apellido_Paterno,
    Url_Imagen,
  } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        url_imagen: Url_Imagen,
        Nombre_Usuario: Nombre_Usuario,
        Correo_Usuario: Correo_Usuario,
        Contrasena_Usuario: Contrasena_Usuario,
        ApellidoM_Usuario: Apellido_Materno,
        ApellidoP_Usuario: Apellido_Paterno,
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
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const updateUser = async (req: Request, res: Response) => {

  //Decodificar token
  const { authorization } = req.headers;
  let separar = authorization?.split(" ");
  let Token = separar![1];
  const decoded = jwt.verify(Token, secretKey);
  const { email } = decoded as { email: string };
  const { ID_Usuario } = decoded as { ID_Usuario: string };
  const {
    url_imagen,
    Nombre_Usuario,
    Correo_Usuario,
    Contrasena_Usuario,
    ApellidoM_Usuario,
    ApellidoP_Usuario,
    Descripcion_Usuario,
    Edad_Usuario,
    Telefono_Usuario,
    Direccion_Usuario,
    Ciudad_Usuario,
  } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { ID_Usuario: parseInt(ID_Usuario) },
      data: {
        url_imagen : url_imagen,
        Nombre_Usuario : Nombre_Usuario,
        Correo_Usuario : Correo_Usuario,
        Contrasena_Usuario : Contrasena_Usuario,
        ApellidoM_Usuario : ApellidoM_Usuario,
        ApellidoP_Usuario : ApellidoP_Usuario,
        Descripcion_Usuario : Descripcion_Usuario,
        Edad_Usuario : Edad_Usuario,
        Telefono_Usuario : Telefono_Usuario,
        Direccion_Usuario : Direccion_Usuario,
        Ciudad_Usuario : Ciudad_Usuario,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  if (!isValidId(id)) {
    return res.status(400).json({ error: "ID no válido" });
  }
  try {
    await prisma.user.delete({
      where: { ID_Usuario: parseInt(id) },
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

export const IniciarSesion = async (req: Request, res: Response) => {
  const { Correo_Usuario, Contrasena_Usuario } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { Correo_Usuario: Correo_Usuario },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (user.Contrasena_Usuario != Contrasena_Usuario) {
      return res.status(404).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ email: user.Correo_Usuario, ID_Usuario: user.ID_Usuario }, secretKey, {
      //expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        ID_Usuario: user.ID_Usuario,
        Email_Usuario: user.Correo_Usuario,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuario por ID" });
  }
};
