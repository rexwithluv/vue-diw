<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Clientes</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Artículos</a>
                    </li>
                </ul>

                <input class="form-control me-4 w-25 ms-auto" type="search" placeholder="Buscar" aria-label="Search">
                <button class="btn btn-outline-primary bg-light" type="submit">
                    <i class="bi bi-search"></i>
                </button>

            </div>
        </div>
    </nav>

    <h2 class="text-center fw-bold py-3">Gestión clientes</h2>
</template>

<script>
export default {
    name: "NavBar"
}
</script>
<style scoped></style>