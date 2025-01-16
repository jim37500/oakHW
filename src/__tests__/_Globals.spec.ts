import { LMap, LTileLayer, LPolygon, LMarker, LPopup, LIcon, LTooltip } from '@vue-leaflet/vue-leaflet';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Tooltip from 'primevue/tooltip';
import Paginator from 'primevue/paginator';
import { defaultOptions } from 'primevue/config';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

library.add(faUser);

export default {
  directives: { badge() {}, tooltip: Tooltip, auth() {} },
  components: {
    LMap,
    LTileLayer,
    LPolygon,
    LMarker,
    LPopup,
    LIcon,
    LTooltip,
    PrimeButton: Button,
    PrimeDialog: Dialog,
    PrimeInputGroup: InputGroup,
    PrimeInputText: InputText,
    PrimePaginator: Paginator,
    FontAwesomeIcon,
  },
  mocks: {
    $primevue: {
      config: defaultOptions,
    },
  },
};
