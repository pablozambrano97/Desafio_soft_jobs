import Jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { handleError } from "../handleError.js";
import { obtenerRegistros, registrarUsuario, verificarCredencial } from "../database/consultas.js";

const login = async (req, res) =>{
    try {
        const { email, password } = req.body
        console.log("contraseña original:", password, typeof password );


        if (!email || !password) {
            throw { message: "email y la constraseña requeridos" };
        }
        const dbUserPassword = await verificarCredencial(email);
        console.log("dbUserPassword devuelto de verfificar credenciales: ", dbUserPassword )
        console.log("password recibido del body: ", password)

        // verifico comparando los passwords
        const validatePassword = await bcrypt.compare(password, dbUserPassword);

        console.log("validatePassword: ", validatePassword)

        // validacion contraseña
        if (validatePassword == false) {
            throw {code:401, message: "Contraseña incorrecta del usuario" };
        } 
        
        const token=Jwt.sign({ email }, process.env.JWT_PASSWORD); 
        console.log("Token generado en Login: ", token);
        res.status(200).json({token: token});
    } catch (error) {
        console.log(error);
        const { status, message } = handleError(error.code);
        return res.status(status).json({ ok: false, result: message })
    }
}

const register = async (req, res) =>{
    try {
        let { email, password, rol, lenguage } = req.body;
        console.log("password original: ", password);
        console.log("antes de encriptar la contraseña");
        const passwordEncriptada = await bcrypt.hash(password, 10);
        console.log("password encriptada: ", passwordEncriptada);
        await registrarUsuario(email, passwordEncriptada, rol, lenguage);
        const token=Jwt.sign({ email }, process.env.JWT_PASSWORD); 
        console.log("Token generado: ", token);
        res.status(200).json({ok: true, message: "Usuario registrado con exito", token: token});
    } catch (error) {
        const { status, message } = handleError(error.code);
        return res.status(status).json({ ok: false, result: message })
    }
}

const users = async (req, res) => {
    try {
        const {email}= req.body;
        console.log(email);
        const user = await obtenerRegistros(email);
        console.log("registro: ",user);
        res.status(200).json([user]);

    } catch (error) {
        const { status, message } = handleError(error.code);
        return res.status(status).json({ ok: false, result: message })
    }
    
}

export const softController = {
    login,
    register,
    users
}