import bcrypt from "bcryptjs";

export default async function encriptarContrasenya(passwd) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwdEncriptado = await bcrypt.hash(passwd, salt);
        return passwdEncriptado;
    } catch (error) {
        console.error("Error al encriptar la contraseña.", error);
        throw new Error("No se pudo encriptar la contraseña.");
    }
}
