<template>
  <main class>
    <GlobalHeader>
      <o-button size="small" variant="primary" @click="save">保存</o-button>
    </GlobalHeader>

    <section class="container py-6">
      <p class="pb-10 text-lg">アルバムしょうさい: {{ albumData.name }}</p>
      <o-button tag="a" variant="primary" @click="refresh">
        <span>再取得</span>
      </o-button>
      <o-button tag="a" variant="primary" @click="save">
        <span>save</span>
      </o-button>

      <div>
        {{ albumData }}
      </div>
      <div>
        <o-field class="file">
          <o-upload @input="onSelectFiles" multiple>
            <o-button tag="a" variant="primary">
              <span>Click to upload</span>
            </o-button>
          </o-upload>
        </o-field>
        <ul class="" v-if="filedata.length > 0">
          <li v-for="f in filedata">
            <div>
              <img class="block" :src="f.src" :alt="f.alt" />
              <o-button
                tag="a"
                variant="primary"
                @click="() => saveImg(f.file)"
              >
                <span>画像保存</span>
              </o-button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useNuxtApp } from '#app';
import type { Album, FileData } from '@/types/apptype';
import { createToast } from '@/util/helper';

const oruga = inject('oruga');
const toast = createToast(oruga);

const files = ref<File[]>([]);
const filedata = computed(() => {
  return files.value.map((f: File) => {
    return { file: f, src: URL.createObjectURL(f), alt: '' };
  });
});
const r = useRoute();
const { id: albumId } = r.params;

const { albumData, refresh } = useAlbumDetail(albumId as string);

const onSelectFiles = async (e: InputEvent) => {
  const filelist: FileList = (e.target as HTMLInputElement).files;
  files.value = Array.from(filelist);
};

const save = async () => {
  console.log('files', { ...files.value });
  const res = await saveAlbumDetail(albumId, {
    ...albumData.value,
    hoge: {
      yyyy: 444,
    },
  });
  if (res.error) {
    toast.error(`❗️アルバム情報保存エラー ${res.error}`);
    return;
  }
  toast.ok('保存したケロ');
  refresh();
};

const saveImg = async (file: File) => {
  const res = await saveAlbumImage(albumId, file);
  console.log('がぞうほぞん', res);
  if (res.error) {
    toast.error(`❗️画像保存エラー ${res.error}`);
    return;
  }
  toast.ok('保存したケロ');
};

const nyao = async () => {
  const res = await testGet(albumId, { nnnn: 5555 });
  console.log('nyaoけっか', res);
};

// watch(rr.currentRoute.value, () => {
//   console.log('ぱすへんこう', rr.currentRoute.value);
// });

// watchEffect(() => {
//   const { id: albumId } = r.params;
//   console.log('albumId', albumId, r.path);
//   if (!albumId) return;

//   const { albumData: data } = useAlbumDetail(albumId as string);
//   album.albumData = data;
// });

// onMounted(() => {
//   const r = useRoute();
//   const myid = r.params.id;
//   console.log('idちぇっく', myid);
//   id.value = myid as string;
// });

//----------------------
// use
//----------------------
</script>
