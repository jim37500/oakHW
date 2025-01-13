import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userStore = defineStore('user', () => {
  // const User = ref({
  //   GoogleName: 'jim37500',
  //   GoogleEmail: '',
  //   GooglePicture: 'https://lh3.googleusercontent.com/a/ACg8ocKSHRtMObRDxOhOJ0c73lo4or0vNJ8d2jLj7CKW7dpOENRaVOXy=s96-c',
  //   FBName: 'jim37500',
  //   FBEmail: '',
  //   FBPicture: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=8640126959425754&height=50&width=50&ext=1739091305&hash=AbbYVGGRKag566_LDPHpwzTN',
  // });

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
