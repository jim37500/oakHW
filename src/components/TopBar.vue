<template>
  <div class="min-h-full">
    <nav class="bg-gray-800 w-full fixed z-10 py-1">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="flex-shrink-0 cursor-pointer m-2">
              <img class="size-12 rounded-full" src="/elephant.png" alt="Your Company" />
            </div>
            <div class="px-3 py-2 font-medium text-2xl sm:text-3xl cursor-pointer text-yellow-500">新北市都市更新Demo</div>
          </div>
          <div id="v-step-2" @click="ClickUserIcon" class="flex items-center cursor-pointer">
            <div v-if="User.FBPicture">
              <img class="size-12 rounded-full" :src="User.FBPicture" alt="Your Profile" />
            </div>
            <div v-else class="flex items-center justify-center rounded-full border-white border-2 w-10 h-10">
              <FontAwesomeIcon icon="fa-regular fa-user" class="text-white cursor-pointer text-xl" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>

  <PrimeDialog v-model:visible="IsAccountDialogOpen" modal class="w-10/12 sm:w-6/12 lg:w-4/12" :draggable="false" :closable="false">
    <template #header>
      <div class="flex w-full items-center justify-between">
        <div class="text-2xl font-semibold">帳號資訊</div>
        <i class="pi pi-times !text-lg ml-auto cursor-pointer" @click="IsAccountDialogOpen = false" />
      </div>
    </template>
    <div class="flex items-center mb-4">
      <img class="w-8" src="/google_icon.webp" />
      <span class="ml-2 text-xl font-semibold">Google</span>
    </div>
    <div v-if="User.GoogleName" class="flex items-center mb-4">
      <div class="w-4/12 flex justify-center">
        <img class="w-12 rounded-full border-2 border-gray-300" :src="User.GooglePicture" />
      </div>
      <div class="w-8/12 pl-4">
        <div class="font-semibold text-lg text-blue-500 mb-1">{{ User.GoogleName }}</div>
        <div class="text-gray-600">Email: {{ User.GoogleEmail }}</div>
      </div>
    </div>
    <hr class="my-4" />
    <div class="flex items-center mb-4">
      <img class="w-8" src="/facebook_icon.svg" />
      <span class="ml-2 text-xl font-semibold">Facebook</span>
    </div>
    <div v-if="User.FBName" class="flex items-center">
      <div class="w-4/12 flex justify-center">
        <img class="w-12 rounded-full border-2 border-gray-300" :src="User.FBPicture" />
      </div>
      <div class="w-8/12 pl-4">
        <div class="font-semibold text-lg text-blue-500 mb-1">{{ User.FBName }}</div>
        <div class="text-gray-600">Email: {{ User.FBEmail }}</div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center w-full">
        <PrimeButton label="登出" severity="contrast" @click="Logout" />
      </div>
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { userStore } from '../stores/UserStore';
import UtilityService from '@/services/UtilityService';

const store = userStore();
const { Alert, Confirm } = UtilityService;
const { User } = storeToRefs(store);
const IsAccountDialogOpen = ref(false);

const ClickUserIcon = () => {
  if (!User.value.FBName && !User.value.GoogleName) return;

  IsAccountDialogOpen.value = true;
};

const Logout = () => {
  Confirm('確定要登出？').then((o) => {
    if (o.isConfirmed) {
      User.value = {
        GoogleName: '',
        GoogleEmail: '',
        GooglePicture: '',
        FBName: '',
        FBEmail: '',
        FBPicture: '',
      };
      IsAccountDialogOpen.value = false;
      Alert('登出成功', 'success');
      window.router.push('/login');
    }
  });
};
</script>
