import pkg from 'pg';
import format from 'format';


const { Pool } = pkg;

const pool = new Pool({
    allowExitOnIdle: true,
});

const obtenerRegistros = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1" 
    const values = [email];
    const { rows: [usuario], rowCount } = await pool.query(consulta, values);
    return usuario
}

const comprobarRegistroByEmail = async (email) => {
    console.log("entró en la comprobacion del email");
    const consulta = "SELECT * FROM usuarios WHERE email = $1" 
    const values = [email];
    const { rows: [usuario], rowCount } = await pool.query(consulta, values);
    console.log(rowCount);
    if (rowCount) throw { code: 406, message: "Email registrado en la tabla" }
}

const verificarCredencial = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1" 
    const values = [email];
    const { rowCount, rows: [userDB]  } = await pool.query(consulta, values)
    console.log("userDB y rowCount en verificarCredenciales: ", { userDB , rowCount });

    if (!rowCount) throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }

    return userDB.password
}

const registrarUsuario = async (email, password, rol, lenguage) => {
    const values = [email, password, rol, lenguage];
    console.log(values); 
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)" 
    await pool.query(consulta, values) 
}

export {obtenerRegistros, comprobarRegistroByEmail, verificarCredencial, registrarUsuario }