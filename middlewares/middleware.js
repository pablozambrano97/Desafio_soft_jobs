import Jwt from 'jsonwebtoken';
import { comprobarRegistroByEmail } from "../database/consultas.js";
import { handleError } from "../handleError.js"

const reportarConsulta = async (req, res, next) => {
    const parametros = req.params;
    const querys = req.query;
    const body = req.body;
    const url = req.url;
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url} 
    con los parámetros, querys y body:
    `, parametros, querys, body)
    next(); // informa el codigo y continua al siguiente bloque
}

const verificarInput = async (req, res, next) => {
    try {
        const {email, password, rol, lenguage} = req.body;
        console.log("estos son los datos entregados para el registro: ", email, password, rol, lenguage);
        if(!email || !password || !rol || !lenguage){
            throw {
                code: 400, message: "faltan campos requeridos"
            }
        }
        await comprobarRegistroByEmail(email);
        console.log("email apto para el registro: ", email);
        next();
    } catch (error) {
        console.log(error);
        const { status, message } = handleError(error.code);
        return res.status(status).json({ ok: false, result: message });
    }

}

const verificarCredenciales = async (req, res, next) => {
    try {
        const Authorization = req.header("Authorization"); 
        const token = Authorization.split("Bearer ")[1];
        console.log(token); 
        if (!token){
            throw{code: 401, message:"token no proporcionado"}
        }
        console.log("verifico el token");
        Jwt.verify(token, process.env.JWT_PASSWORD ); 
        const { email } = Jwt.decode(token);
        req.body={email};
        next();
    } catch (error) {
        console.log(error);
        const { status, message } = handleError(error.code);
        return res.status(status).json({ ok: false, result: message });
    }
    

}

export {reportarConsulta, verificarInput, verificarCredenciales};