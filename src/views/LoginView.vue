<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center">歡迎使用</h2>
      <h2 class="text-2xl font-bold mb-6 text-center">新北市都市更新Demo</h2>
      <div ref="GoogleButton" class="flex justify-center mb-4"></div>
      <button @click="HandleFacebookLogin" class="w-full bg-blue-600 font-semibold text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserService from '@/services/UserService';

const User = ref(UserService.User);
const GoogleButton = ref(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleCredentialResponse = (response: any) => {
  const decodedToken = parseJwt(response.credential);
  User.value.GoogleName = decodedToken.name;
  User.value.GoogleEmail = decodedToken.email;
  User.value.GooglePicture = decodedToken.picture;

  console.log('JWT Token:', response.credential);
  console.log('Decoded Token:', decodedToken);
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
  const clientId = UserService.GoogleClientID;
  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(GoogleButton.value, { theme: 'outline', size: 'large' });
};

const HandleFacebookLogin = () => {
  FB.login(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any) => {
      if (response.authResponse) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        FB.api('/me', { fields: 'name,email,picture' }, (userInfo: any) => {
          User.value.FBName = userInfo.name;
          User.value.FBEmail = userInfo.email;
          User.value.FBPicture = userInfo.picture.data.url;
          console.log('User Info:', userInfo);
          console.log(User.value);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    },
    { scope: 'public_profile,email' },
  );
};

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
      appId: UserService.FaceBookAppID, // Replace with your Facebook App ID
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
