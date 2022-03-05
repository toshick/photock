import type { AppState, AlbumItemEdit } from '@/types/apptype';
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

function getErrorFromRes(data: any, error: any) {
  if (error.value) {
    return { error: error.value?.message };
  }
  if (data?.value?.error) {
    return { error: data?.value.error };
  }
  return null;
}

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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
  }
  return { albums, refresh };
};

/**
 * fetchSetting
 */
export const fetchSetting = async () => {
  const config = useRuntimeConfig();
  const { data, pending, refresh, error } = await useGet(
    `${config.backendURL}/setting`,
  );

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
  }
  return { ...data?.value };
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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
  }
  return { ...data?.value };
};

/**
 * saveAlbumImageToFireStorage
 */
export const saveAlbumImageToFireStorage = async (
  albumId: string,
  itemList: AlbumItemEdit[],
) => {
  const config = useRuntimeConfig();
  const { data, pending, refresh, error } = await usePost(
    `${config.backendURL}/albums/${albumId}/firestorage`,
    {
      itemList,
    },
  );

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
  }
  return { ...data?.value };
};

/**
 * backupAlbum
 */
export const backupAlbum = async (albumId: string) => {
  const config = useRuntimeConfig();
  const url = `${config.backendURL}/albums/${albumId}/backup`;
  const { data, error } = await usePost(url);
  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
  }
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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
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

  const err = getErrorFromRes(data, error);
  if (err) {
    return { error: err.error };
  }
  return { ...data?.value };
};
