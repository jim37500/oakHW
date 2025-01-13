<template>
  <TopBar />
  <div class="pt-24 mx-auto w-10/12">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import TopBar from '../components/TopBar.vue';
</script>
