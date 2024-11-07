<template>
  <NavBar></NavBar>
  <TablaClientes></TablaClientes>
</template>

<script>
import TablaClientes from './components/TablaClientes.vue';
import NavBar from "./components/NavBar.vue";

export default {
  name: 'App',
  components: {
    TablaClientes,
    NavBar
  }
}
</script>

<style></style>
