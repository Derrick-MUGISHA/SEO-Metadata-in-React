import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createUnhead } from '@unhead/vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const head = createUnhead()

app.use(createPinia())
app.use(router)
app.use(head)

app.mount('#app')
