<template>
    <h2 class="text-center fw-bold py-3">
        <i class="fas fa-laptop-code"></i>
        Panel de gestión
    </h2>

    <div class="container text-center pt-5">
        <div class="row align-items-center gy-4">
            <div class="col-6">
                <router-link to="/usuarios" class="btn btn-primary w-100 p-3 fs-5">
                    <i class="bi bi-people-fill me-1"></i>
                    Gestión de Usurios
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/empleo" class="btn btn-primary w-100 p-3 fs-5">
                    <i class="fas fa-file-alt me-1"></i>
                    Gestión de Empleo
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/comentarios" class="btn btn-primary w-100 p-3 fs-5">
                    <i class="bi bi-star-fill"></i>
                    Zona de Comentarios
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/articulos" class="btn btn-primary w-100 p-3 fs-5">
                    <i class="bi bi-123"></i>
                    Gestión de Articulos
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/" class="btn btn-secondary w-100 p-3 fs-5">
                    En construcción
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/" class="btn btn-secondary w-100 p-3 fs-5">
                    En construcción
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/" class="btn btn-secondary w-100 p-3 fs-5">
                    En construcción
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/" class="btn btn-secondary w-100 p-3 fs-5">
                    En construcción
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/" class="btn btn-secondary w-100 p-3 fs-5">
                    En construcción
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/" class="btn btn-secondary w-100 p-3 fs-5">
                    En construcción
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/" class="btn btn-secondary w-100 p-3 fs-5">
                    En construcción
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/" class="btn btn-secondary w-100 p-3 fs-5">
                    En construcción
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PanelGestion",
}
</script>

<style scoped></style>