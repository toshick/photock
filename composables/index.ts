// import type { Album } from '@/types/apptype';

export const useFuga = () => {
  const counter = ref(0);
  const increment = () => counter.value++;
  return { counter, increment };
};

// export const useAlbum = () => {
//   const ref = reactive<{ list: Album[] }>({
//     list: [],
//   });

//   const fetch = async () => {
//     const res: any = await useFetch('/api/albums');
//     console.log('res', res);
//     if (res.albums) {
//       ref.list = res.albums;
//     }
//   };

//   fetch();

//   return { albums: ref.list, fetch };
// };
