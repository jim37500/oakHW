<template>
  <div class="mb-3 flex justify-center items-center">
    <div class="text-3xl md:text-4xl font-semibold text-center text-blue-800">新北市都市更新Demo</div>
    <i v-tooltip="'亮點'" class="pi pi-question-circle !text-xl mx-1" @click="IsHighlightDialogOpen = true" />
  </div>
  <hr class="mb-5 max-w-72 mx-auto border-blue-100" />
  <div v-if="IsLoading" class="flex justify-center items-center w-full h-full">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem" />
  </div>
  <div v-else>
    <div class="w-full h-96 z-0 relative bg-zinc-50 border-2 border-zinc-100 p-3 rounded-2xl">
      <LMap ref="map" v-model:zoom="Zoom" v-model:center="Center" :useGlobalLeaflet="false" @click="ClickMap">
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

    <div class="mt-4 bg-zinc-50 border-2 border-zinc-100 p-3 sm:p-8 rounded-2xl">
      <PrimeInputGroup>
        <PrimeInputText v-model="Keyword" placeholder="搜尋附近站點" :pt="{ root: { class: '!p-3 !text-xl' } }" />
        <PrimeButton icon="pi pi-search" severity="contrast" :pt="{ root: { class: '!px-6' }, icon: { class: '!text-xl' } }" @click="SearchStops" />
      </PrimeInputGroup>
      <div class="mt-4 grid lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        <div
          v-for="(stop, index) in DisplayStops"
          :key="index"
          :class="stop.IsFocus ? 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300' : 'bg-blue-50 border-blue-200 hover:bg-sky-100 hover:border-sky-300'"
          class="border-2 cursor-pointer p-3 sm:p-6 rounded-lg sm:rounded-2xl shadow-md"
          @click="ClickStop(stop)"
        >
          <div class="flex items-center justify-between">
            <div class="font-semibold text-lg lg:text-xl xl:text-2xl">
              {{ stop.Name }}
            </div>
            <div class="text-blue-800 font-semibold text-lg lg:text-xl xl:text-2xl">{{ stop.Distance.toFixed(1) }} 公里</div>
          </div>
        </div>
      </div>

      <PrimePaginator class="mt-3" :totalRecords="FilteredStops.length" :rows="12" :pt="{ root: { class: '!bg-zinc-50' }, current: { class: '!text-blue-500' } }" @page="ChangeDisplayStops" />
    </div>
  </div>

  <PrimeDialog v-model:visible="IsHighlightDialogOpen" modal class="w-10/12 sm:w-6/12 lg:w-4/12" :draggable="false" :closable="false">
    <template #header>
      <div class="flex w-full items-center justify-between">
        <div class="text-2xl font-semibold">亮點 ✨</div>
        <i class="pi pi-times !text-lg ml-auto cursor-pointer" @click="IsHighlightDialogOpen = false" />
      </div>
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Stop } from '@/types';
import { storeToRefs } from 'pinia';
import { userStore } from '../stores/UserStore';
import MapService from '@/services/MapService';

const store = userStore();
const { User } = storeToRefs(store);
const IsLoading = ref(false);
const map = ref();
const Zoom = ref(15);
const Center = ref({ lat: 0, lng: 0 });
const Keyword = ref('');
const PolygonCoordinates = ref<number[][][]>([]);
const MyLocation = ref(Center.value);
const Stops = ref<Stop[]>([]);
const DisplayStops = ref<Stop[]>([]);
const FilteredStops = ref<Stop[]>([]);
const FocusStop = ref({} as Stop);
const IsHighlightDialogOpen = ref(false);

let StopsMap: { [key: string]: Stop } = {};

const resetMapCenter = (lat: number, lng: number) => {
  Center.value = { lat, lng };
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const ClickStop = (stop: Stop) => {
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

const getSurroundingStops = (lng: number, lat: number) => {
  return MapService.GetSurroundingStops(lng, lat).then((o) => {
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
    DisplayStops.value = Stops.value.slice(0, 12);
  });
};

const LoadData = () => {
  IsLoading.value = true;
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
      IsLoading.value = false;
    });
};
LoadData();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ClickMap = (event: any) => {
  Keyword.value = '';
  FocusStop.value = {} as Stop;
  MyLocation.value = event.latlng;
  getSurroundingStops(event.latlng.lng, event.latlng.lat);
};

const ChangeDisplayStops = (o: { first: number }) => {
  DisplayStops.value = Stops.value.slice(o.first, o.first + 12);
};

const SearchStops = () => {
  if (!Keyword.value) {
    return;
  }

  FilteredStops.value = Stops.value.filter((o) => o.Name.includes(Keyword.value));
  DisplayStops.value = FilteredStops.value.slice(0, 12);
};

watch(
  () => Keyword.value,
  () => {
    if (!Keyword.value) {
      FilteredStops.value = Stops.value;
      DisplayStops.value = FilteredStops.value.slice(0, 12);
      return;
    }

    SearchStops();
  },
);
</script>
