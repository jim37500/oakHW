import './assets/main.css';
import 'leaflet/dist/leaflet.css';
import 'primeicons/primeicons.css';
import 'vue3-tour/dist/vue3-tour.css'

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';

import App from './App.vue';
import Vue3Tour from 'vue3-tour'
import router from './router';
import { LMap, LTileLayer, LPolygon, LMarker, LPopup, LIcon, LTooltip } from '@vue-leaflet/vue-leaflet';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Tooltip from 'primevue/tooltip';
import Paginator from 'primevue/paginator';


library.add(faUser);

declare global {
  interface Window {
    router: typeof router;
    Swal: typeof Swal;
  }
}

window.router = router;
window.Swal = Swal;

const pinia = createPinia();
const app = createApp(App);

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{gray.50}',
      100: '{gray.100}',
      200: '{gray.200}',
      300: '{gray.300}',
      400: '{gray.400}',
      500: '{gray.500}',
      600: '{gray.600}',
      700: '{gray.700}',
      800: '{gray.800}',
      900: '{gray.900}',
      950: '{gray.950}',
    },
  },
});

app.use(pinia);
app.use(router);
app.use(Vue3Tour)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {},
  },
});

app.directive('tooltip', Tooltip);

app.component('LMap', LMap);
app.component('LTileLayer', LTileLayer);
app.component('LPolygon', LPolygon);
app.component('LMarker', LMarker);
app.component('LTooltip', LTooltip);
app.component('LPopup', LPopup);
app.component('LIcon', LIcon);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.component('PrimeButton', Button);
app.component('PrimeDialog', Dialog);
app.component('PrimeInputGroup', InputGroup);
app.component('PrimeInputText', InputText);
app.component('PrimePaginator', Paginator);

app.mount('#app');
