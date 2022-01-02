import type { AppState } from '@/types/apptype';

export const useFuga = () => {
  const counter = ref(0);
  const increment = () => counter.value++;
  return { counter, increment };
};

/**
 * useAppState
 */
export const useAppState = () => {
  const appState = reactive<AppState>({
    appName: 'ほんなこつ',
  });

  return { appState };
};

/**
 * useAlbumList
 */
export const useAlbumList = () => {
  const { data, pending, refresh, error } = useLazyFetch('/api/albums');
  const albums = computed(() => data?.value?.albums || []);

  return { albums, refresh };
};

/**
 * useAlbumDetail
 */
export const useAlbumDetail = (albumId: string) => {
  const { data, pending, refresh, error } = useLazyFetch(
    `/api/albums/${albumId}`,
  );
  const albumData = computed(() => data?.value || null);

  return { albumData, refresh };
};
