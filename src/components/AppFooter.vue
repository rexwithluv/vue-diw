<template>
  <footer class="bg-primary text-white text-center py-2">
    <div class="container">
      <p>© 2024 Mi Empresa. Todos los derechos reservados.
        <router-link to="/aviso-legal" class="link d-inline text-white">Aviso Legal</router-link> |
        <router-link to="/politica-privacidad" class="link d-inline text-white">Política de Privacidad</router-link>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter"
};
</script>

<style scoped>
footer {
  width: 100%;
}
</style>
