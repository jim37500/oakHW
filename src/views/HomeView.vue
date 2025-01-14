<template>
  <div class="mb-3 flex justify-center items-center">
    <div id="v-step-0" class="text-3xl md:text-4xl font-semibold text-center text-blue-800">新北市都市更新Demo</div>
    <i id="v-step-1" v-tooltip="'亮點'" class="pi pi-question-circle !text-xl mx-1" @click="IsHighlightDialogOpen = true" />
  </div>
  <hr class="mb-5 max-w-72 mx-auto border-blue-100" />
  <div v-if="IsLoading" class="flex justify-center items-center w-full h-full">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem" />
  </div>
  <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-4">
    <div id="v-step-3" class="w-full min-h-96 z-0 relative bg-zinc-50 border-2 border-zinc-100 p-3 rounded-2xl">
      <LMap ref="Map" v-model:zoom="Zoom" v-model:center="Center" :useGlobalLeaflet="false" @click="ClickMap">
        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></LTileLayer>
        <LPolygon v-for="(polygon, index) in PolygonCoordinates" :key="index" :lat-lngs="polygon" color="blue" :weight="1" />
        <LMarker v-if="User.FBName && User.GoogleName" :lat-lng="MyLocation">
          <LTooltip>
            <div class="p-0.5 flex flex-col justify-center w-full divide-y divide-gray-300">
              <div class="font-semibold text-lg text-blue-500">{{ User.FBName }}</div>
              <div>
                <div class="font-semibold mt-1">
                  所在位置:
                  {{ [Math.round(MyLocation.lat * 1000) / 1000, Math.round(MyLocation.lng * 1000) / 1000] }}
                </div>
              </div>
            </div>
          </LTooltip>
          <LIcon class-name="rounded-full border-2 border-yellow-600" :icon-url="User.FBPicture" :icon-size="[50, 50]" :icon-anchor="[20, 40]" />
        </LMarker>

        <LMarker v-if="FocusStop.Name" :lat-lng="[FocusStop.Latitude, FocusStop.Longitude]" @click="ClickStop(FocusStop)">
          <LTooltip>
            <div class="p-0.5 flex flex-col justify-center w-full divide-y divide-gray-300">
              <div class="font-semibold text-lg text-blue-500">{{ FocusStop.Name }}</div>
              <div>
                <div class="font-semibold mt-1">
                  距離:
                  <span class="font-semibold text-red-500">{{ FocusStop.Distance.toFixed(1) }} </span>
                  km
                </div>
                <div class="font-semibold">
                  所在位置:
                  {{ [Math.round(FocusStop.Latitude * 1000) / 1000, Math.round(FocusStop.Longitude * 1000) / 1000] }}
                </div>
              </div>
            </div>
          </LTooltip>
          <LIcon class-name="rounded-full border-2 border-rose-600" :icon-url="User.GooglePicture" :icon-size="[40, 40]" :icon-anchor="[20, 40]" />
        </LMarker>

        <div v-for="stop in Stops" :key="stop.Name">
          <LMarker v-if="!stop.IsFocus" :lat-lng="[stop.Latitude, stop.Longitude]" @click="ClickStop(stop)">
            <LTooltip>
              <div class="p-0.5 flex flex-col justify-center w-full divide-y divide-gray-300">
                <div class="font-semibold text-lg text-blue-500">{{ stop.Name }}</div>
                <div>
                  <div class="font-semibold mt-1">
                    距離:
                    <span class="font-semibold text-red-500">{{ stop.Distance.toFixed(1) }} </span>
                    km
                  </div>
                  <div class="font-semibold">
                    所在位置:
                    {{ [Math.round(stop.Latitude * 1000) / 1000, Math.round(stop.Longitude * 1000) / 1000] }}
                  </div>
                </div>
              </div>
            </LTooltip>
          </LMarker>
        </div>
      </LMap>
    </div>

    <div id="v-step-4" class="mt-4 lg:mt-0 bg-zinc-50 border-2 border-zinc-100 p-3 sm:p-6 rounded-2xl">
      <PrimeInputGroup>
        <PrimeInputText v-model="Keyword" placeholder="搜尋附近站點" :pt="{ root: { class: '!p-3 !text-xl' } }" />
        <PrimeButton icon="pi pi-search" severity="contrast" :pt="{ root: { class: '!px-6' }, icon: { class: '!text-xl' } }" @click="SearchStops" />
      </PrimeInputGroup>
      <div class="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div
          v-for="(stop, index) in DisplayStops"
          :key="index"
          :class="stop.IsFocus ? 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300' : 'bg-blue-50 border-blue-200 hover:bg-sky-100 hover:border-sky-300'"
          class="border-2 cursor-pointer p-3 sm:p-6 xl:p-3 rounded-lg sm:rounded-xl shadow-md"
          @click="ClickStop(stop)"
        >
          <div :class="stop.IsEmpty ? 'opacity-0' : ''" class="flex xl:flex-col items-center justify-between">
            <div class="font-semibold text-lg 2xl:text-xl xl:self-start">
              {{ stop.Name }}
            </div>
            <div class="text-blue-800 font-semibold xl:self-end text-lg 2xl:text-xl">{{ stop.Distance.toFixed(1) }} 公里</div>
          </div>
        </div>
      </div>

      <PrimePaginator
        class="mt-3"
        :key="PaginatorKey"
        :totalRecords="FilteredStops.length"
        :rows="StopsPerPage"
        :pageLinkSize="PaginatorPageLinkSize"
        :pt="{ root: { class: '!bg-zinc-50' }, current: { class: '!text-blue-500' } }"
        @page="ChangeDisplayStops"
      />
    </div>
  </div>

  <PrimeDialog v-model:visible="IsHighlightDialogOpen" modal class="w-10/12" :draggable="false" :closable="false">
    <template #header>
      <div class="flex w-full items-center justify-between">
        <div class="text-2xl font-semibold">亮點 ✨</div>
        <i class="pi pi-times !text-lg cursor-pointer" @click="IsHighlightDialogOpen = false" />
      </div>
    </template>
    <div class="flex flex-col items-center gap-5 p-4 divide-y divide-dashed divide-gray-300">
      <div class="w-full">
        <div class="text-xl font-semibold">1. 進入網頁時會進行網頁導覽</div>
        <img src="/highlight1.png" alt="網頁導覽" class="w-full" />
      </div>
      <div class="w-full">
        <div class="text-xl mt-3 font-semibold">2. 點選頂欄頭像可查看 Google 與 Facebook 的登入資訊</div>
        <img src="/highlight2.png" alt="登入資訊" class="w-full" />
      </div>
      <div class="w-full">
        <div class="text-xl mt-3 font-semibold">3. 點選地圖空白處可移動參考點(Facebook的頭像)</div>
        <img src="/highlight3.png" alt="移動參考點" class="w-full" />
      </div>
      <div class="w-full">
        <div class="text-xl mt-3 font-semibold">4. 點選右側站點可移動地圖中心至所選站點，並將站點更改為Google的頭像</div>
        <img src="/highlight4.png" alt="移動至站點" class="w-full" />
      </div>
      <div class="w-full">
        <div class="text-xl mt-3 font-semibold">5. 可用關鍵字搜尋站點</div>
        <img src="/highlight5.png" alt="搜尋站點" class="w-full" />
      </div>
    </div>
  </PrimeDialog>

  <v-tour name="myTour" :steps="TourSteps" :options="TourOptions"></v-tour>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue';
import type { Stop } from '@/types';
import { storeToRefs } from 'pinia';
import { userStore } from '../stores/UserStore';
import MapService from '@/services/MapService';

const app = getCurrentInstance();
const store = userStore();
const { User } = storeToRefs(store);

const IsLoading = ref(false);
const Map = ref();
const Zoom = ref(15);
const Center = ref({ lat: 0, lng: 0 });
const Keyword = ref('');
const PolygonCoordinates = ref<number[][][]>([]);
const MyLocation = ref(Center.value);
const Stops = ref<Stop[]>([]);
const DisplayStops = ref<Stop[]>([]); // 顯示在清單上的站點
const FilteredStops = ref<Stop[]>([]); // 搜尋過後的站點
const FocusStop = ref({} as Stop);
const PaginatorKey = ref(0);
const PaginatorPageLinkSize = ref(5);
const IsHighlightDialogOpen = ref(false);

const TourOptions = ref({
  labels: {
    buttonSkip: '略過',
    buttonPrevious: '上一個',
    buttonNext: '下一個',
    buttonStop: '完成',
  },
});
const TourSteps = ref([
  {
    target: '#v-step-0',
    content: '歡迎使用新北市都市更新Demo!',
    params: {
      placement: 'left',
    },
  },
  {
    target: '#v-step-1',
    content: '點選此處可查看Demo亮點',
    params: {
      placement: 'right',
    },
  },
  {
    target: '#v-step-2',
    content: '點選頭像可查看帳號資訊',
    params: {
      placement: 'bottom',
    },
  },
  {
    target: '#v-step-3',
    content: '點選地圖空白處可移動參考點',
    params: {
      placement: 'top',
    },
  },
  {
    target: '#v-step-4',
    content: '點選下列站點可將地圖中心移至所選站點',
    params: {
      placement: 'top',
    },
  },
]);

const StopsPerPage = 8;

let StopsMap: { [key: string]: Stop } = {}; // 站點名稱對應站點資訊

const resetMapCenter = (lat: number, lng: number) => {
  Center.value = { lat, lng };
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const ClickStop = (stop: Stop) => {
  if (stop.IsEmpty) {
    return;
  }

  resetMapCenter(stop.Latitude, stop.Longitude);
  if (FocusStop.value.Name) {
    const prevStop = Stops.value.find((o) => o.Name === FocusStop.value.Name);
    if (prevStop) {
      prevStop.IsFocus = false;
    }
  }

  const nowStop = Stops.value.find((o) => o.Name === stop.Name);
  if (nowStop) {
    nowStop.IsFocus = true;
    FocusStop.value = nowStop;
  }
};

const getSurroundingStops = async (lng: number, lat: number) => {
  const o = await MapService.GetSurroundingStops(lng, lat);
  StopsMap = {};
  o.result.forEach((stop: { stop_name: string; latitude: number; longitude: number; distance: number }) => {
    if (!StopsMap[stop.stop_name]) {
      StopsMap[stop.stop_name] = {
        Name: stop.stop_name,
        Latitude: stop.latitude,
        Longitude: stop.longitude,
        Distance: stop.distance,
      };
    } else if (StopsMap[stop.stop_name].Distance > stop.distance) {
      StopsMap[stop.stop_name].Distance = stop.distance;
      StopsMap[stop.stop_name].Latitude = stop.latitude;
      StopsMap[stop.stop_name].Longitude = stop.longitude;
    }
  });

  Stops.value = Object.keys(StopsMap)
    .map((stopName) => ({
      Name: stopName,
      Latitude: StopsMap[stopName].Latitude,
      Longitude: StopsMap[stopName].Longitude,
      Distance: StopsMap[stopName].Distance,
      IsFocus: false,
    }))
    .sort((a, b) => a.Distance - b.Distance);

  FilteredStops.value = Stops.value;
  DisplayStops.value = Stops.value.slice(0, StopsPerPage);
};

const LoadData = () => {
  IsLoading.value = true;
  // 若 為手機版 則將分頁連結數量設為3
  if (window.innerWidth < 600) {
    PaginatorPageLinkSize.value = 3;
  }

  MapService.GetUrbanUpdatePolygon()
    .then((o) => {
      o.result.features.forEach((area: { geometry: { coordinates: [number, number][][] } }) => {
        PolygonCoordinates.value.push(area.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]));
      });

      Center.value = {
        lat: PolygonCoordinates.value[0][0][0],
        lng: PolygonCoordinates.value[0][0][1],
      };
      MyLocation.value = Center.value;
    })
    .then(() => getSurroundingStops(Center.value.lng, Center.value.lat))
    .then(() => {
      if (app && app.proxy && app.proxy.$tours && app.proxy.$tours['myTour'] && window.innerWidth >= 1280) {
        app.proxy.$tours['myTour'].start();
      }
      IsLoading.value = false;
    });
};
LoadData();

// 填滿站點清單，以維持地圖大小
const fillUpDisplayStops = () => {
  while (DisplayStops.value.length < StopsPerPage && window.innerWidth >= 1280) {
    DisplayStops.value.push({
      Name: 'Empty',
      Latitude: 0,
      Longitude: 0,
      Distance: 0,
      IsFocus: false,
      IsEmpty: true,
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ClickMap = (event: any) => {
  Keyword.value = '';
  FocusStop.value = {} as Stop;
  MyLocation.value = event.latlng;
  getSurroundingStops(event.latlng.lng, event.latlng.lat);
  PaginatorKey.value += 1;
};

// 換頁時更新顯示站點
const ChangeDisplayStops = (o: { first: number }) => {
  DisplayStops.value = Stops.value.slice(o.first, o.first + StopsPerPage);

  fillUpDisplayStops();
};

const SearchStops = () => {
  if (!Keyword.value) {
    return;
  }

  FilteredStops.value = Stops.value.filter((o) => o.Name.includes(Keyword.value));
  DisplayStops.value = FilteredStops.value.slice(0, StopsPerPage);
  fillUpDisplayStops();
};

watch(
  () => Keyword.value,
  () => {
    if (!Keyword.value) {
      FilteredStops.value = Stops.value;
      DisplayStops.value = FilteredStops.value.slice(0, StopsPerPage);
      return;
    }

    SearchStops();
  },
);
</script>
