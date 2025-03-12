<template>
  <footer class="bg-primary text-white text-center pb-2 pt-4 mt-4">
    <div class="container">
      <p class="mb-1">© {{ currentYear }} Mi Empresa. Todos los derechos reservados.</p>
      <p>
        <router-link to="/aviso-legal" class="link d-inline text-white">Aviso Legal</router-link> |
        <router-link to="/politica-privacidad" class="link d-inline text-white">Política de Privacidad</router-link>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",

  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style scoped>
footer {
  width: 100%;
}
</style>
