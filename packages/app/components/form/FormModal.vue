<template>
  <o-modal :active="active" ref="modal" :canCancel="[]">
    <form action="">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
        </header>
        <section class="modal-card-body">
          <o-field label="アルバム名">
            <o-input
              type="name"
              :value="s.name"
              placeholder="オナマエ"
              required
            >
            </o-input>
          </o-field>
        </section>
        <footer class="modal-card-foot">
          <o-button type="button" @click="doClose">Close</o-button>
          <o-button variant="primary">Login</o-button>
        </footer>
      </div>
    </form>
  </o-modal>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Album } from '@/types/apptype';
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
});
const modal = ref(null);
//----------------------
// state
//----------------------
const s = reactive({
  name: '',
  active: false,
});
const active = computed(() => s.active);
const doClose = () => {
  if (modal && modal.value?.close) {
    modal.value?.close();
    s.active = false;
  }
};
watchEffect(() => {
  if (props.show) {
    s.active = props.show;
  } else {
    doClose();
  }
});
</script>

<style scoped lang="scss">
.modal-card {
  box-shadow: 0 0 4px 0px rgba(#000, 0.3);
  border-radius: 4px;
}
</style>
