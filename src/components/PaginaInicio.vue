<template>
    <h2 class="text-center fw-bold py-3">
        <i class="fas fa-laptop-code"></i>
        Panel de gestión
    </h2>

    <div class="container text-center">
        <div class="row align-items-center gy-3">
            <div class="col-6">
                <router-link to="/usuarios" class="btn btn-primary w-100 p-3 fs-5">
                    <i class="bi bi-people-fill me-1"></i> Gestión de usurios
                </router-link>
            </div>
            <div class="col-6">
                <router-link to="/empleo" class="btn btn-primary w-100 p-3 fs-5">
                    <i class="fas fa-file-alt me-1"></i> Gestión Empleo
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
    name: "PaginaInicio",
}
</script>

<style></style>