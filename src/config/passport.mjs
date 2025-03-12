import bcrypt from "bcryptjs";

export async function encriptarContrasenya(passwd) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwdEncriptado = await bcrypt.hash(passwd, salt);
    return passwdEncriptado;
  } catch (error) {
    console.error("Error al encriptar la contraseña.", error);
    throw new Error("No se pudo encriptar la contraseña.");
  }
}

export async function verificarContrasenya(passwd, passwdEncrypt) {
  try {
    const esCorrecta = await bcrypt.compare(passwd, passwdEncrypt);
    return esCorrecta;
  } catch (error) {
    console.error("Error al verificar la contraseña", error);
    throw new Error("No se pudo verificar la contraseña");
  }
}
