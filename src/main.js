import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

import "sweetalert2/dist/sweetalert2.min.css"

import "@fortawesome/fontawesome-free/css/all.min.css"
import router from './router'
import store from './store/store.mjs'

createApp(App).use(router).use(store).mount('#app')

