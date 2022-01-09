import type { AppState } from '@/types/apptype';

const usePost = (url: string, body: any) => {
  return useFetch(url, {
    method: 'POST',
    body,
  });
};

const useGet = (url: string, params: any = null) => {
  return useFetch(url, {
    method: 'GET',
    params,
  });
};

const useGetLazy = (url: string, params: any = null) => {
  return useFetch(url, {
    method: 'GET',
    params,
    lazy: true,
  });
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
  const { data, pending, refresh, error } = useGetLazy('/api/albums');
  const albums = computed(() => data?.value?.albums || []);

  return { albums, refresh };
};

/**
 * saveAlbumDetail
 */
export const saveAlbumDetail = async (albumId: string, albumData: object) => {
  const { data, pending, refresh, error } = await usePost(
    `/api/albums/${albumId}/detail`,
    {
      ...albumData,
    },
  );
  const result = data?.value ? { ...data?.value } : { error: true };

  return result;
};

/**
 * saveAlbumImage
 */
export const saveAlbumImage = async (albumId: string, file: File) => {
  const formData = new FormData();
  formData.append('myimg', file, file.name);
  const url = `http://localhost:9000/albums/${albumId}/image`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return await response.json();
};

/**
 * useAlbumDetail
 */
export const useAlbumDetail = (albumId: string) => {
  const { data, pending, refresh, error } = useGetLazy(
    `/api/albums/${albumId}`,
  );
  const albumData = computed(() => {
    const ret = data?.value;
    return ret[albumId] || null;
  });

  return { albumData, refresh };
};

/**
 * testGet
 */
export const testGet = async (albumId: string, d: object) => {
  const { data, pending, refresh, error } = await usePost(
    `/api/albums/${albumId}/nyao/myao`,
    {
      ...d,
    },
  );
  const result = data?.value ? { ...data?.value } : { error: true };

  return result;
};
