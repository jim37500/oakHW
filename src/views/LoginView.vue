<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <div ref="googleButton" class="flex justify-center"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const user = ref<{ name: string; email: string } | null>(null);
const googleButton = ref(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleCredentialResponse = (response: any) => {
  const decodedToken = parseJwt(response.credential);
  user.value = {
    name: decodedToken.name,
    email: decodedToken.email,
  };
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
      .join('')
  );
  return JSON.parse(jsonPayload);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;

const initializeGoogleLogin = () => {
  // Initialize Google login
  const clientId = '97769993562-s61o6dpbp9r9qqqon1s01ii6ec0jd3h2.apps.googleusercontent.com';
  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(
    googleButton.value,
    { theme: 'outline', size: 'large' }
  );
};

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = initializeGoogleLogin;
  document.head.appendChild(script);
});
</script>
