import type { AppState } from '@/types/apptype';
import { zeropad } from '@/util/helper';

const usePost = (url: string, body: any = {}) => {
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

const useDelete = (url: string, params: any = null) => {
  return useFetch(url, {
    method: 'DELETE',
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
  if (error.value) {
    return { error: error.value.message };
  }
  return { albums, refresh };
};

/**
 * saveAlbumDetail
 */
export const saveAlbumDetail = async (albumId: string, albumData: object) => {
  const config = useRuntimeConfig();
  const { data, pending, refresh, error } = await usePost(
    `${config.backendURL}/albums/${albumId}/detail`,
    {
      ...albumData,
    },
  );
  if (error.value) {
    return { error: error.value.message };
  }
  return { ...data?.value };
};

/**
 * exportAlbum
 */
export const exportAlbum = async (albumId: string) => {
  const config = useRuntimeConfig();
  const { data, pending, refresh, error } = await usePost(
    `${config.backendURL}/albums/${albumId}/export`,
  );
  if (error.value) {
    return { error: error.value.message };
  }
  return { ...data?.value };
};

/**
 * deleteAlbum
 */
export const deleteAlbum = async (albumId: string) => {
  const config = useRuntimeConfig();
  const { data, pending, refresh, error } = await useDelete(
    `${config.backendURL}/albums/${albumId}/detail`,
  );
  if (error.value) {
    return { error: error.value.message };
  }
  return { ...data?.value };
};

/**
 * backupAlbum
 */
export const backupAlbum = async (albumId: string) => {
  const config = useRuntimeConfig();
  const url = `${config.backendURL}/albums/${albumId}/backup`;
  const { data } = await usePost(url);
  return { ...data?.value };
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
  formData.append(
    'myimg',
    file,
    `${timestamp}-${zeropad(index, 2)}-${file.name}`,
  );
  const url = `${config.backendURL}/albums/${albumId}/image`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return await response.json();
};

/**
 * changeAlbumId
 */
export const changeAlbumId = async (albumId: string, newId: string) => {
  const config = useRuntimeConfig();
  const url = `${config.backendURL}/albums/${albumId}/id`;
  const { data, error } = await usePost(url, { newId });
  if (error.value) {
    return { error: error.value.message };
  }
  return { ...data.value };
};

/**
 * removeAlbumImage
 */
export const removeAlbumImage = async (albumId: string, imgId: string) => {
  const config = useRuntimeConfig();
  const url = `${config.backendURL}/albums/${albumId}/image/${imgId}`;
  const { data, error } = await useDelete(url);
  if (error.value) {
    return { error: error.value.message };
  }
  return { ...data.value };
};

/**
 * resetAlbumImage
 */
export const resetAlbumImage = async (albumId: string) => {
  const config = useRuntimeConfig();
  const url = `${config.backendURL}/albums/${albumId}/reset/`;
  const { data, error } = await useDelete(url);
  if (error.value) {
    return { error: error.value.message };
  }
  return { ...data.value };
};

/**
 * useAlbumDetail
 */
export const useAlbumDetail = async (albumId: string) => {
  const config = useRuntimeConfig();
  const { data, pending, refresh, error } = await useGet(
    `${config.backendURL}/albums/${albumId}`,
  );
  const albumData = computed(() => {
    const ret = { ...data?.value } as any;
    if (!ret.items) {
      ret.items = [];
    }
    return ret;
  });
  if (error.value) {
    return { error: error.value.message };
  }
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
  if (error.value) {
    return { error: error.value.message };
  }
  return { ...data?.value };
};
