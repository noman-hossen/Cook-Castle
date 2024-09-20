import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { MotionPlugin } from '@vueuse/motion'
import debounce from 'lodash-es/debounce'

createApp(App).use(MotionPlugin).use(router).use(store).mount('#app')