<template>
    <div id="container" class="d-flex flex-column justify-content-center align-items-center text-center">
        <img class="ms-5" :src="NotFoundImage" alt="Logo" />

        <h1 class="fs-1">404</h1>
        <p class="fs-5">Oops! Parece que te has perdido.</p>

        <router-link class="btn btn-primary btn-lg" :to="{ name: 'inicio' }">
            Volver al inicio
        </router-link>
    </div>
</template>

<script>
import NotFoundImage from "@/assets/404.png";

export default {
    name: "NotFound",
    data() {
        return {
            NotFoundImage: NotFoundImage,
        };
    },
};
</script>

<style scoped lang="css">
#container {
    height: 70vh;
}
</style>
