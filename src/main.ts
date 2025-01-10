import './assets/main.css';
import 'leaflet/dist/leaflet.css';

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';


import App from './App.vue';
import router from './router';
import { LMap, LGeoJson, LTileLayer, LPolyline, LPolygon, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet';

import Button from "primevue/button"

declare global {
  interface Window {
    router: typeof router;
  }
}

window.router = router;

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

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {},
  },
});

app.component('LMap', LMap);
app.component('LTileLayer', LTileLayer);
app.component('LGeoJson', LGeoJson);
app.component('LPolyline', LPolyline);
app.component('LPolygon', LPolygon);
app.component('LMarker', LMarker);
app.component('LPopup', LPopup);
app.component('LIcon', LIcon);
app.component('PrimeButton', Button);

app.mount('#app');
