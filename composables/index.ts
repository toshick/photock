import type { AppState } from '@/types/apptype';
import { pad } from '@/util/helper';

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
export const saveAlbumImage = async (
  albumId: string,
  file: File,
  index: number,
) => {
  const timestamp = new Date().getTime();
  const config = useRuntimeConfig();
  const formData = new FormData();
  formData.append('myimg', file, `${timestamp}-${pad(index, 2)}-${file.name}`);
  const url = `${config.backendURL}/albums/${albumId}/image`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return await response.json();
};

/**
 * removeAlbumImage
 */
export const removeAlbumImage = async (albumId: string, imgId: string) => {
  const config = useRuntimeConfig();
  const url = `${config.backendURL}/albums/${albumId}/image/${imgId}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return await response.json();
};

/**
 * resetAlbumImage
 */
export const resetAlbumImage = async (albumId: string) => {
  const config = useRuntimeConfig();
  const url = `${config.backendURL}/albums/${albumId}/reset/`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return await response.json();
};

/**
 * useAlbumDetail
 */
export const useAlbumDetail = (albumId: string) => {
  const config = useRuntimeConfig();
  const { data, pending, refresh, error } = useGetLazy(
    `${config.backendURL}/albums/${albumId}`,
  );
  const albumData = computed(() => {
    const ret = data?.value;
    return ret;
  });

  return { albumData, refresh };
};

/**
 * testGet
 */
export const testGet = async (albumId: string, d: object) => {
  const config = useRuntimeConfig();
  const { data, pending, refresh, error } = await usePost(
    `${config.backendURL}/albums/${albumId}/nyao/myao`,
    {
      ...d,
    },
  );
  const result = data?.value ? { ...data?.value } : { error: true };

  return result;
};
