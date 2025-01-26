/* c8 ignore start */
<template>
  <TopBar />
  <div class="pt-24 mx-auto w-11/12">
    <div class="w-full flex flex-col items-center justify-center mb-8">
      <div class="text-4xl font-semibold">歡迎使用</div>
      <div class="text-4xl font-semibold">新北市都市更新Demo</div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div class="w-full">
        <img class="" src="/hero.png" alt="Your Company" />
      </div>
      <div class="w-full bg-zinc-50 border-2 border-zinc-100 px-8 py-8 rounded-2xl">
        <div class="text-2xl font-semibold mb-2">使用說明</div>
        <div class="mb-4">
          <div class="text-xl font-semibold mb-1">
            1. 登入Google
            <span v-if="User.GoogleName" class="text-green-600"><i class="pi pi-check-circle"></i></span>
          </div>
          <div v-if="!User.GoogleName" ref="GoogleButton"></div>
        </div>

        <div class="mb-4">
          <div class="text-xl font-semibold mb-1">
            2. 綁定Facebook
            <i v-tooltip="'因FB登入開發者需商業認證，若無法登入請同意略過登入'" class="pi pi-question-circle !text-xl mr-1" />
            <span v-if="User.FBName" class="text-green-600"><i class="pi pi-check-circle"></i></span>
          </div>
          <div v-if="!User.FBName" class="flex justify-center w-full">
            <button @click="LoginFacebook" class="w-full bg-blue-600 font-semibold text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
              <svg class="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.675V1.325C24 .6 23.4 0 22.675 0z"
                />
              </svg>
              綁定Facebook
            </button>
          </div>
        </div>

        <div class="text-xl font-semibold mb-1">3. 開始使用</div>
        <PrimeButton class="w-full" label="開始使用" severity="contrast" :outlined="!CanLogin" @click="StartToUse" />
      </div>
    </div>
  </div>
</template>
/* c8 ignore stop */

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { userStore } from '../stores/UserStore';
import UtilityService from '@/services/UtilityService';
import TopBar from '../components/TopBar.vue';

const { Alert, Confirm } = UtilityService;
const router = useRouter();
const store = userStore();
const { User } = storeToRefs(store);
const GoogleButton = ref(null);
const CanLogin = ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleCredentialResponse = (response: any) => {
  const decodedToken = parseJwt(response.credential);
  User.value.GoogleName = decodedToken.name;
  User.value.GoogleEmail = decodedToken.email;
  User.value.GooglePicture = decodedToken.picture;
};

const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(jsonPayload);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const FB: any;

const initializeGoogleLogin = () => {
  google.accounts.id.initialize({
    client_id: store.GoogleClientID,
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(GoogleButton.value, { theme: 'outline', size: 'large' });
};

const LoginFacebook = () => {
  FB.login(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any) => {
      if (response.authResponse) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        FB.api('/me', { fields: 'name,email,picture' }, (userInfo: any) => {
          User.value.FBName = userInfo.name;
          User.value.FBEmail = userInfo.email;
          User.value.FBPicture = userInfo.picture.data.url;
        });
      } else {
        Confirm('FB無法登入，是否跳過FB登入？').then((o: { isConfirmed: boolean }) => {
          if (o.isConfirmed) {
            if (!User.value.GoogleName) {
              Alert('請先登入Google', 'error');
              return;
            }
            User.value.FBName = User.value.GoogleName;
            User.value.FBEmail = User.value.GoogleEmail;

            Alert('已經跳過FB登入', 'info');
          }
        });
      }
    },
    { scope: 'public_profile,email' },
  );
};

const StartToUse = () => {
  if (!User.value.GoogleName) {
    return Alert('請先登入Google帳號', 'error');
  }

  if (!User.value.FBName) {
    return Alert('請先綁定Facebook帳號', 'error');
  }

  router.push('/');
};

watchEffect(() => {
  CanLogin.value = Boolean(User.value.GoogleName && User.value.FBName);
});

declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}

onMounted(() => {
  // Load Google SDK
  const googleScript = document.createElement('script');
  googleScript.src = 'https://accounts.google.com/gsi/client';
  googleScript.async = true;
  googleScript.defer = true;
  googleScript.onload = initializeGoogleLogin;
  document.head.appendChild(googleScript);

  // Load Facebook SDK
  window.fbAsyncInit = function () {
    FB.init({
      appId: store.FaceBookAppID,
      cookie: true,
      xfbml: true,
      version: 'v12.0',
    });
  };

  (function (d, s, id) {
    // eslint-disable-next-line prefer-const
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;

    // eslint-disable-next-line prefer-const
    js = d.createElement(s);
    js.id = id;
    (js as HTMLScriptElement).src = 'https://connect.facebook.net/en_US/sdk.js';
    if (fjs && fjs.parentNode) {
      fjs.parentNode.insertBefore(js, fjs);
    }
  })(document, 'script', 'facebook-jssdk');
});
</script>
