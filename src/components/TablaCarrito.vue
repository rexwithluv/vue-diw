<template>
  <h2 class="text-center fw-bold py-3">
    <i class="fas fa-shopping-cart"></i>
    Carrito
    <router-link to="/" class="ms-5">
      <i class="fas fa-reply"></i>
    </router-link>
  </h2>

  <div class="container" v-if="cartStore.items.length > 0">
    <table class="table mt-2">
      <thead>
        <tr class="table-primary">
          <th scope="col" class="w-20 text-start align-middle">Nombre</th>
          <th scope="col" class="w-45 text-center align-middle">Descripción</th>
          <th scope="col" class="w-10 text-center align-middle">Precio</th>
          <th scope="col" class="w-10 text-center align-middle">Foto</th>
          <th scope="col" class="w-10 text-center align-middle">Cantidad</th>
          <th scope="col" class="w-10 text-center align-middle">Total</th>
          <th scope="col" class="table-info text-center align-middle">
            Eliminar
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in this.cartStore.getItems" :key="item.id">
          <td class="text-center align-middle">{{ item.nombre }}</td>
          <td class="text-center align-middle">{{ item.descripcion }}</td>
          <td class="text-center align-middle">{{ item.precio }} &euro;</td>

          <td>
            <img :src="`http://localhost:5000/uploads/images/${item.imagen}`" alt="Foto de producto" width="64"
              height="64" class="img-thumbnail" @click="openModal()" />
          </td>
          <!-- El modal (ventana emergente) que muestra la imagen expandida -->
          <div v-if="isModalOpen" class="modal" @click="closeModal">
            <img :src="`http://localhost:5000/uploads/images/${item.imagen}`" alt="Foto expandida"
              class="modal-content" />
          </div>
          <td class="align-middle">
            <div class="gap-2 d-flex align-items-center justify-content-center">
              <button @click="decrease(item)" class="btn btn-primary p-0 px-2">
                -
              </button>
              <span class="border bg-white px-2">{{ item.quantity }}</span>
              <button @click="increase(item)" class="btn btn-primary p-0 px-2" :disabled="item.stock === item.quantity">
                +
              </button>
            </div>
          </td>
          <td>{{ (item.quantity * item.precio).toFixed(2) }} €</td>
          <td class="text-center align-middle table-info">
            <button class="btn btn-danger" @click="eliminarArticulo(item)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Ejercicio 1 y 2, descuento con cupones y gastos de envío -->
    <div class="row">
      <div class="col-6">
        <div class="input-group">
          <label class="input-group-text">Cupón de descuento</label>
          <input type="text" class="form-control" v-model="this.cuponDescuento" />
        </div>
      </div>
      <div class="col-6">
        <div class="input-group">
          <label class="input-group-text">Gastos de envío</label>
          <input type="text" class="form-control" :value="this.gastosEnvio" disabled />
        </div>
      </div>
    </div>

    <h2 class="text-end">
      Precio total:
      {{ !descuento ?
        cartStore.totalPrice.toFixed(2) :
        cartStore.totalPrice.toFixed(2) - (cartStore.totalPrice.toFixed(2) * 10 / 100) }} €
    </h2>
    <button class="btn btn-primary" @click="finalizarCompra">
      Finalizar compra
    </button>
  </div>
  <div v-else>
    <div class="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <i class="bi bi-dropbox fs-1"></i>
      <h3>El carrito está vacío</h3>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/store/carts.js";
import { loadStripe } from "@stripe/stripe-js";

export default {
  name: "TablaCarrito",
  components: {},

  data() {
    return {
      cartStore: useCartStore(),
      cuponDescuento: ""
    };
  },

  mounted() {
    console.log("Items del carrito", this.cartStore.getItems);
  },

  computed: {
    gastosEnvio() {
      const precioTotal = this.cartStore.totalPrice.toFixed(2);

      if (precioTotal >= 50) {
        return "0.00€";
      }
      return `${(precioTotal * 5 / 100).toFixed(2)}€`;
    },

    descuento() {
      const cuponesValidos = ["DESCUENTO"];
      return cuponesValidos.includes(this.cuponDescuento);
    }
  },


  methods: {
    eliminarArticulo(articulo) {
      this.cartStore.removeFromCart(articulo.id);
    },

    increase(articulo) {
      this.cartStore.updateQuantity(articulo.id, articulo.quantity + 1);
    },

    decrease(articulo) {
      if (articulo.quantity - 1 === 0) {
        this.eliminarArticulo(articulo);
      } else {
        this.cartStore.updateQuantity(articulo.id, articulo.quantity - 1);
      }
    },

    async finalizarCompra() {
      localStorage.setItem("carrito", JSON.stringify(this.cartStore.items));
      const stripe = await loadStripe(process.env.VUE_APP_PUBLIC_KEY);
      const response = await fetch(
        "http://localhost:5000/crear-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: this.cartStore.items,
            amount: this.cartStore.totalPrice,
          }),
        }
      );

      const session = await response.json();

      if (!session.id) {
        console.error("No se recibio sesionId de stripe");
        return;
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error("Error en el pago", error);
      }
    },
  },
};
</script>
<style scoped></style>
