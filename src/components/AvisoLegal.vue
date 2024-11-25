<template>
    <h3 class="text-center fw-bold py-3">Aviso legal</h3>

    <div class="container-fluid ps-3 pe-5 text-justify">
        <ol>
            <li>
                <span class="fw-bold">Información general</span><br>
                En cumplimiento con lo establecido en la legislación vigente, se informa que el presente sitio web es
                propiedad de Import-Export Teis, S.L., con domicilio en Avenida de Galicia, 36216 Vigo, España, y con
                CIF B-12345678. Puede ponerse en contacto con nosotros a través de:
                <ul>
                    <li>Teléfono: +34 986 111 111</li>
                    <li>Correo electrónico: info@importexportteis.com</li>
                </ul>
            </li>
            <li>
                <span class="fw-bold">Condiciones de Uso</span><br>
                El acceso y uso de este sitio web implica la aceptación de los términos y condiciones establecidos en el
                presente Aviso Legal. Los usuarios se comprometen a utilizar el sitio web de forma adecuada y lícita.
            </li>
            <li>
                <span class="fw-bold">Propiedad Intelectual e Industrial</span><br>
                Todos los contenidos de este sitio web, incluidos textos, imágenes, logotipos, diseños, software, y
                cualquier otro material, son propiedad de Import-Export Teis, S.L. o de terceros que han autorizado su
                uso. Queda prohibida su reproducción, distribución, comunicación pública o transformación sin
                autorización previa y por escrito de los titulares.
            </li>
            <li>
                <span class="fw-bold">Protección de Datos Personales</span><br>
                De acuerdo con el Reglamento General de Protección de Datos (RGPD), le informamos de que los datos
                personales que nos facilite serán tratados por Import-Export Teis, S.L. con la finalidad de gestionar
                las consultas realizadas a través de este sitio web.
                Para más información, consulte nuestra <router-link to="/politica-privacidad" class="link">Política de
                    privacidad</router-link>.
            </li>
            <li>
                <span class="fw-bold">Exención de Responsabilidad</span><br>
                Import-Export Teis, S.L. no será responsable de los daños y perjuicios que puedan derivarse del uso
                incorrecto de los contenidos del sitio web, ni de posibles errores técnicos o interrupciones en el
                servicio.
            </li>
            <li>
                <span class="fw-bold">Legislación Aplicable y Jurisdicción</span><br>
                El presente Aviso Legal se rige por la legislación española. Para cualquier controversia que pueda
                surgir, ambas partes se someterán a los juzgados y tribunales de Vigo.
            </li>
        </ol>
    </div>
</template>

<script>
export default {
    name: "AvisoLegal",
}
</script>

<style scoped>
ol>li {
    margin-bottom: 1em;
}

.text-justify {
    text-align: justify;
}
</style>
