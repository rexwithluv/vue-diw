<template>
    <div class="container">
        <div class="text-center p-4 bg-white shadow rounded mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="green"
                class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path
                    d="M16 8a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM6.354 11.354a.5.5 0 0 0 .707 0l4.5-4.5a.5.5 0 1 0-.707-.707L6.5 10.293 4.146 7.94a.5.5 0 1 0-.707.707l2.915 2.707z" />
            </svg>

            <h1 class="mt-3">¡Pago realizado con éxito!</h1>
            <p class="text-muted">
                Gracias por tu compra. Hemos recibido tu pago correctamente.
            </p>

            <p>Descargue su factura en formato PDF:</p>

            <button @click="generarFacturaPdf" class="btn btn-primary">
                <i class="bi bi-file-earmark-pdf" />
                Descargar factura
            </button><br />

            <router-link to="/" class="btn btn-success mt-3">
                Volver al inicio
                <i class="bi bi-arrow-return-left" />
            </router-link>
        </div>
    </div>
</template>

<script>
import { useCartStore } from "@/store/carts";
import jsPDF from "jspdf";
import { watch } from "vue";
import propiedad from "/public/propiedad.png";
import autoTable from "jspdf-autotable";
import { agregarFactura } from "@/js/facturaServicios";
import { actualizarArticulo } from "@/js/articuloServicios";

export default {
    name: "PagoAprobado",
    data() {
        return {
            cartItems: [],
            totalPrice: 0,
            cliente: null,
            factura: null,
        };
    },

    async mounted() {
        const cartStore = useCartStore();

        // Recuperamos los items del localStorage
        const items = JSON.parse(localStorage.getItem("carrito"));

        // Los volvemos a guardar en el store
        cartStore.items = items;
        this.cartItems = items;
        this.totalPrice = cartStore.totalPrice;

        watch(() => cartStore.items, (newVal) => {
            this.cartItems = newVal;
        }, { deep: true }
        );

        this.cliente = await this.getCliente();
        const clienteID = this.cliente.id;
        const factura = {
            clienteID: clienteID,
            items: this.formatearListaItems(items),
            totalFactura: cartStore.totalPrice,
            fecha: Date.now(),
        };

        this.factura = await agregarFactura(factura);
        console.log(this.factura);

        // biome-ignore lint/complexity/noForEach: <explanation>
        cartStore.items.forEach((item) => {
            this.updateStock(item, item.quantity);
        });
    },

    methods: {
        async getMunicipioCliente(municipioID) {
            const response = await fetch("http://localhost:3000/municipios");
            const municipios = await response.json();

            return municipios.find(municipio => municipio.id === municipioID).nm
        },
        async getProvinciaCliente(provinciaID) {
            const response = await fetch("http://localhost:3000/provincias");
            const provincias = await response.json();

            console.log(provincias.find(provincia => provincia.id === provinciaID));
            console.log(provinciaID);
            return provincias.find(provincia => provincia.id === provinciaID).nm
        },
        async getCliente() {
            const clienteEmail = localStorage.getItem("email");
            const response = await fetch(
                `http://localhost:3000/usuarios?email=${encodeURI(clienteEmail)}`
            );
            if (!response.ok) {
                console.error("Error al obtener el cliente");
            }

            const data = await response.json();
            const cliente = data[0]

            cliente.provincia = await this.getProvinciaCliente(cliente.provincia);
            cliente.municipio = await this.getMunicipioCliente(cliente.municipio);
            return cliente;
        },

        generarFacturaPdf() {
            if (this.cartItems.length === 0) {
                console.error("No hay productos en el carrito, no se puede generar la factura");
                return;
            }

            const doc = new jsPDF();
            const cart = this.factura.items;

            // Logo
            doc.addImage(propiedad, "PNG", 10, 10, 25, 25);

            // Título
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("Factura de Compra", 75, 20);

            // Información del negocio
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Razón Social: Regalos Teis", 120, 40);
            doc.text("Dirección: Avenida Galicia 101, Vigo - 36216", 120, 45);
            doc.text("Tel: 986 111 333 - Email: regalos@example.com", 120, 50);

            // Número de factura
            doc.setFont("helvetica", "bold");
            doc.text(`Nº Factura: ${this.factura._id}`, 120, 35);

            // Información del cliente
            if (this.cliente) {
                doc.setFont("helvetica", "bold");
                doc.text("Datos del Cliente:", 10, 50);
                doc.setFont("helvetica", "normal");
                doc.text(`Nombre: ${this.cliente.nombre} ${this.cliente.apellidos}`, 10, 55);
                doc.text(`DNI: ${this.cliente.dni}`, 10, 60);
                doc.text(`Dirección: ${this.cliente.direccion}, ${this.cliente.municipio} - ${this.cliente.provincia}`, 10, 65);
                doc.text(`Teléfono: ${this.cliente.telefono}`, 10, 70);
                doc.text(`Email: ${this.cliente.email}`, 10, 75);
            }

            // Fecha de emisión
            const fecha = new Date().toLocaleDateString();
            doc.text(`Fecha de emisión: ${fecha}`, 150, 75);

            // Tabla con los productos
            const headers = [
                ["ID", "Producto", "Cantidad", "Precio Unitario (€)", "Total (€)"],
            ];
            const data = cart.map((item) => [
                item.productoId,
                item.nombre,
                item.cantidad,
                item.precio.toFixed(2),
                (item.cantidad * item.precio).toFixed(2),
            ]);

            autoTable(doc, {
                startY: 85,
                head: headers,
                body: data,
                theme: "striped",
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [40, 40, 40], textColor: 255 },
                columnStyles: {
                    0: { halign: "center" },
                    2: { halign: "center" },
                    3: { halign: "right" },
                    4: { halign: "right" },
                },
            });

            // Total de la factura
            const finalY = doc.lastAutoTable.finalY + 10;
            const totalFactura = this.factura.totalFactura.toFixed(2);

            doc.setFillColor(40, 40, 40);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.rect(150, finalY, 40, 10, "F");
            doc.text(`Total: ${totalFactura} €`, 155, finalY + 7);

            // Guardar PDF
            doc.save(
                `Factura_${this.factura._id}_${this.cliente.nombre}_${fecha}.pdf`
            );
            console.log("Factura generada correctamente");
        },

        updateStock(item, cantidad) {
            item.stock -= cantidad;
            delete item.quantity;
            actualizarArticulo(item.id, item);
        },

        formatearListaItems(items) {
            const listaItemsNueva = items.map((item) => {
                return {
                    productoId: item.id,
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.quantity,
                    total: Number.parseInt(item.precio) * Number.parseInt(item.quantity),
                };
            });
            return listaItemsNueva;
        },
    },

    beforeUnmount() {
        const cartStore = useCartStore();
        cartStore.clearCart();
    },
};
</script>

<style scoped></style>
