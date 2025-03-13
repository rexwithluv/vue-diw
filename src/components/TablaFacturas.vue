<template>
    <!-- Tabla -->
  <h2 class="text-center fw-bold mt-4">Tabla facturas</h2>

  <div class="my-3 mx-2">
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col" class="bg-info-subtle text-center">Factura ID</th>
            <th scope="col" class="bg-info-subtle text-center">Cliente ID</th>
            <th scope="col" class="bg-info-subtle text-center">Fecha</th>
            <th scope="col" class="bg-info-subtle text-center">Total Factura</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="factura in facturas" :key="factura._id">
            <td class="align-middle text-center">{{ factura._id }}</td>
            <td class="align-middle text-center">{{ factura.clienteID }}</td>
            <td class="align-middle text-center">
                {{ formatearFecha(factura.fecha) }}
            </td>
            <td class="align-middle text-center">
                {{ formatearPrecio(factura.totalFactura) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</div>
</template>

<script>
import {obtenerFacturas} from "@/js/facturaServicios";

export default{
    name: "TablaFacturas",

    data(){
        return{
            facturas: []
        }
    },
    mounted(){
        this.obtenerFacturas();
    },
    // computed:{

    // },
    methods:{
        async obtenerFacturas(){
            try {
                this.facturas = await obtenerFacturas();
            } catch (error) {
                console.error(error);
            }
        },

        formatearFecha(fecha){
        const enFormatoFecha = new Date (Date.parse(fecha));
        return enFormatoFecha.toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        },
        formatearPrecio(precio){
            return precio.toFixed(2).replace(".", ",") + "€";
        },
    }
}
</script>

<style lang="css" scoped></style>