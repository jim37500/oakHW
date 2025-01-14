import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userStore = defineStore('user', () => {
  const User = ref({
    GoogleName: '',
    GoogleEmail: '',
    GooglePicture: '',
    FBName: '',
    FBEmail: '',
    FBPicture: '',
  });

  const GoogleClientID = '97769993562-s61o6dpbp9r9qqqon1s01ii6ec0jd3h2.apps.googleusercontent.com';

  const FaceBookAppID = '2277578655947804';

  return { User, GoogleClientID, FaceBookAppID };
});
