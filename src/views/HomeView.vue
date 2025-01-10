<template>
  <div class="mx-auto w-10/12">
    <div class="bg-blue-500 cursor-pointer" @click="router.push('login')">test</div>
    <div class="w-full h-96">
      <LMap ref="map" v-model:zoom="Zoom" v-model:center="Center" :useGlobalLeaflet="false" @click="OnMapClick">
        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></LTileLayer>
        <LPolygon v-for="(polygon, index) in PolygonCoordinates" :key="index" :lat-lngs="polygon" color="blue" :weight="1" />
        <LMarker v-if="User.FBName && User.GoogleName" :lat-lng="PointerLatLng">
          <LPopup>
            <div class="font-semibold text-lg text-blue-500 mb-2">{{ User.FBName }}</div>
            <div class="font-semibold mb-1">所在經度: {{ Math.round(PointerLatLng.lng * 100) / 100 }}</div>
            <div class="font-semibold">所在緯度: {{ Math.round(PointerLatLng.lat * 100) / 100 }}</div>
          </LPopup>
          <LIcon class-name="rounded-full border-4 border-rose-500" :icon-url="User.FBPicture" :icon-size="[40, 40]" :icon-anchor="[20, 40]" />
        </LMarker>
        <LMarker :lat-lng="Center"></LMarker>
      </LMap>
    </div>

    <PrimeButton label="Verify" />
    <div class="mt-4">
      <div class="font-semibold text-lg text-blue-500 mb-2">附近公車站</div>
      <div v-for="(stop, index) in Stops" :key="index" class="flex items-center justify-between border-b border-gray-300 py-2">
        <div class="flex items-center">
          <div class="font-semibold text-2xl">{{ stop.name }}</div>
          <div class="text-gray-500 ml-2">{{ Math.round(stop.distance * 100) / 100 }} 公里</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MapService from '@/services/MapService';
import UserService from '@/services/UserService';

const router = useRouter();
const User = ref(UserService.User);
const map = ref();
const Zoom = ref(15);
const Center = ref({ lat: 24.973462004810624, lng: 121.44213666307334 });

const PolygonCoordinates = ref<number[][][]>([]);
const PointerLatLng = ref(Center.value);
const Stops = ref<{ name: string; latitude: number; longitude: number; distance: number }[]>([]);
const StopsMap: {
  [key: string]: { latitude: number; longitude: number; distance: number };
} = {};

const LoadData = () => {
  MapService.GetUrbanAreas().then((o) => {
    console.log(o);
    console.log('Urban Areas:', o.result.features);
    o.result.features.forEach((area: { geometry: { coordinates: [number, number][][] } }) => {
      PolygonCoordinates.value.push(area.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]));
    });
    console.log('Formatted Polygon Coordinates:', PolygonCoordinates.value);
  });
};
LoadData();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OnMapClick = (event: any) => {
  PointerLatLng.value = event.latlng;
  MapService.GetSurroundingStops(event.latlng.lng, event.latlng.lat).then((o) => {
    console.log(o);
    o.result.forEach((stop: { stop_name: string; latitude: number; longitude: number; distance: number }) => {
      if (!StopsMap[stop.stop_name]) {
        StopsMap[stop.stop_name] = {
          latitude: stop.latitude,
          longitude: stop.longitude,
          distance: stop.distance,
        };
      } else {
        StopsMap[stop.stop_name].distance = Math.min(StopsMap[stop.stop_name].distance, stop.distance);
      }
    });
    Stops.value = Object.keys(StopsMap)
      .map((stopName) => ({
        name: stopName,
        latitude: StopsMap[stopName].latitude,
        longitude: StopsMap[stopName].longitude,
        distance: StopsMap[stopName].distance,
      }))
      .sort((a, b) => a.distance - b.distance);
    console.log(Stops.value);
  });
};
</script>
