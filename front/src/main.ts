import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'

const vuetify = createVuetify()

createApp(App)
    .use(createPinia())
    .use(vuetify)
    .mount('#app')