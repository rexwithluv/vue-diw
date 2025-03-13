<template>
  <h2 class="text-center fw-bold py-3">¡Bienvenida/o!</h2>

  <div class="container d-flex flex-column pb-3">
    <div id="carrusel" class="carousel slide mb-4" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(image, index) in images" :key="index" :class="['carousel-item', { active: index === 0 }]">
          <img :src="image" class="d-block w-100 rounded" height="440" width="1020px" />
        </div>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carrusel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carrusel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>

    <div class="d-flex flex-wrap justify-content-between w-100">
      <div class="text-box">
        <h4 class="fw-bold mb-3">¿Quiénes somos?</h4>
        <div class="text-content">
          Somos un equipo <strong>apasionado</strong> que trabaja para combinar
          innovación, diseño y accesibilidad en cada uno de nuestros artículos.
          Nuestra misión es superar tus expectativas, creando una experiencia de
          compra <strong>única</strong>
          y cercana.
          <br />
          <div class="text-center m-auto">
            <span class="text-primary">¡Gracias por ser parte de nuestra historia!</span>
          </div>
        </div>
      </div>

      <div class="text-box">
        <h4 class="fw-bold mb-3">Servicios</h4>
        <ul class="text-content">
          <li class="mb-3">
            <h6 class="fw-bold">Venta y entrega de productos</h6>
            Recibe tus pedidos en casa con envíos rápidos y opciones de recogida
            en tienda.
          </li>
          <li>
            <h6 class="fw-bold">Diseño o personalización</h6>
            Creamos diseños únicos y adaptados a tus necesidades, reflejando tu
            estilo o el de tu negocio.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaginaInicio",
  data() {
    return {
      images: [
        "https://picsum.photos/1020/440?random=1",
        "https://picsum.photos/1020/440?random=2",
        "https://picsum.photos/1020/440?random=3",
      ],
    };
  },
};
</script>

<style scoped>
.text-box {
  background: rgba(0, 0, 0, 0.05);
  padding: 20px;
  border-radius: 10px;
  width: 48%;
  text-align: justify;
}

.text-content {
  font-size: 1.1rem;
}
</style>
