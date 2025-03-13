import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // Lista de productos en el carrito
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((acc, item) => acc + item.quantity, 0), // Número total de productos

    totalPrice: (state) =>
      state.items.reduce((acc, item) => acc + item.precio * item.quantity, 0), // Precio total

    getItems: (state) => state.items,
  },

  actions: {
    addToCart(product) {
      const existingProduct = this.items.find((item) => item.id === product.id);

      if (existingProduct) {
        if (existingProduct.quantity + 1 > existingProduct.stock) {
          throw new Error("Nos hemos quedado fuera de stock");
        }
        existingProduct.quantity += 1; // Si ya está en el carrito, incrementa la cantidad
      } else {
        this.items.push({ ...product, quantity: 1 }); // Si no está en el carrito, lo agrega con cantidad 1
      }
    },

    removeFromCart(productId) {
      this.items = this.items.filter((item) => item.id !== productId); // Elimina el producto del carrito por su ID
    },

    updateQuantity(productId, quantity) {
      const product = this.items.find((item) => item.id === productId);
      if (product) {
        product.quantity = quantity; // Actualiza la cantidad de un producto
      }
    },

    clearCart() {
      this.items = []; // Limpia el carrito
    },
  },
});
