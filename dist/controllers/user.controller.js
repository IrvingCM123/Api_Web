"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IniciarSesion = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserByEmail = exports.getAllUsers = exports.isValidId = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const secretKey = 'Lolita';
const isValidId = (id) => {
    return /^\d+$/.test(id);
};
exports.isValidId = isValidId;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: { Correo_Usuario: (id) },
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        yield res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuario por ID' });
    }
});
exports.getUserByEmail = getUserByEmail;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Nombre_Usuario, Correo_Usuario, Contrasena_Usuario, Apellido_Materno, Apellido_Paterno, Url_Imagen } = req.body;
    try {
        const newUser = yield prisma.user.create({
            data: {
                url_imagen: Url_Imagen,
                Nombre_Usuario,
                Correo_Usuario,
                Contrasena_Usuario,
                ApellidoM_Usuario: Apellido_Materno,
                ApellidoP_Usuario: Apellido_Paterno,
                // Agrega automáticamente una entrada en GestionUsuario
                gestion_usuarios: {
                    create: {
                        Candidato_Prestamo: true,
                        Fecha_Registro: new Date().toISOString().substring(0, 10),
                        Devoluciones_Realizadas: 0,
                        Prestamos_Pendientes: 0,
                    },
                },
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { url_imagen, Nombre_Usuario, Correo_Usuario, Contrasena_Usuario, ApellidoM_Usuario, ApellidoP_Usuario } = req.body;
    if (!(0, exports.isValidId)(id)) {
        return res.status(400).json({ error: 'ID no válido' });
    }
    try {
        const updatedUser = yield prisma.user.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    if (!(0, exports.isValidId)(id)) {
        return res.status(400).json({ error: 'ID no válido' });
    }
    try {
        yield prisma.user.delete({
            where: { ID_Usuario: parseInt(id) },
        });
        res.sendStatus(204);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});
exports.deleteUser = deleteUser;
const IniciarSesion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Correo_Usuario, Contrasena_Usuario } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { Correo_Usuario: (Correo_Usuario) },
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (user.Contrasena_Usuario != Contrasena_Usuario) {
            return res.status(404).json({ error: 'Contraseña incorrecta' });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.Correo_Usuario }, secretKey, {
            expiresIn: '1h',
        });
        res.json({
            token,
            user: {
                ID_Usuario: user.ID_Usuario,
                Email_Usuario: user.Correo_Usuario,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuario por ID' });
    }
});
exports.IniciarSesion = IniciarSesion;
