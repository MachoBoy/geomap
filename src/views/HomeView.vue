<template>
  <div class="h-screen relative">
    <GeoErrorModal
      @closeGeoError="closeGeoError"
      v-if="geoError"
      :geoErrorMsg="geoErrorMsg"
    />
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script setup>
import leaflet from 'leaflet';
import { onMounted, ref } from 'vue';
import redMarker from '../assets/map-marker-red.svg';
import GeoErrorModal from '../components/GeoErrorModal.vue';

let map;
onMounted(() => {
  // init map
  map = leaflet.map('map').setView([28.538336, -81.379234], 10);
  leaflet
    .tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${
        import.meta.env.VITE_APP_API_KEY
      }`,
      {
        maxZoom: 19,
        attribution: `© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>`,
        accessToken: import.meta.env.VITE_APP_API_KEY,
      },
    )
    .addTo(map);

  getGeolocation();
});

const coords = ref(null);
const fetchCoords = ref(null);
const geoMarker = ref(null);
const geoError = ref(null);
const geoErrorMsg = ref(null);

const getGeolocation = () => {
  // check session storage for coords
  if (sessionStorage.getItem('coords')) {
    coords.value = JSON.parse(sessionStorage.getItem('coords'));
    plotGeolocation(coords.value);
    return;
  }

  fetchCoords.value = true;
  navigator.geolocation.getCurrentPosition(setCoords, getLocError);
};

const setCoords = pos => {
  // console.log(pos);
  fetchCoords.value = null;
  // set coords in session storage
  const setSessionCoords = {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
  };
  sessionStorage.setItem('coords', JSON.stringify(setSessionCoords));

  // set ref coords value
  coords.value = setSessionCoords;
  plotGeolocation(coords.value);
};

const getLocError = err => {
  fetchCoords.value = null;
  geoError.value = true;
  geoErrorMsg.value = err.message;
};

const closeGeoError = () => {
  geoError.value = null;
  geoErrorMsg.value = null;
};

const plotGeolocation = coords => {
  //create custom marker
  const customMarker = leaflet.icon({
    iconUrl: redMarker,
    iconSize: [35, 35],
  });

  // create new marker with coords and custom icon
  geoMarker.value = leaflet
    .marker([coords.lat, coords.lng], { icon: customMarker })
    .addTo(map);

  // set map view to current location
  map.setView([coords.lat, coords.lng], 10);
};
</script>
