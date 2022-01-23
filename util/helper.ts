import { createVNode, render } from 'vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

export const BACKEND_URL = 'http://localhost:9000';

export const readFile = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      resolve({ error: reader.error });
    };
    reader.readAsDataURL(file);
  });
};

export const createToast = (oruga) => {
  return {
    ok: (msg: string) => {
      oruga.notification.open({
        message: msg,
        rootClass: 'toast-notification',
        position: 'bottom-left',
        variant: 'success',
        duration: 3000,
      });
    },
    ng: (msg: string) => {
      oruga.notification.open({
        message: msg,
        rootClass: 'toast-notification',
        position: 'bottom-left',
        variant: 'danger',
        duration: 3000,
      });
    },
  };
};

export const createLoadingOverlay = () => {
  let $target = null;
  let vnode = null;
  const prop = { active: true };
  return {
    open() {
      $target = document.createElement('div');
      document.getElementById('__nuxt').appendChild($target);
      vnode = createVNode(LoadingOverlay, prop);
      render(vnode, $target);
    },
    close() {
      if (!vnode) return;

      vnode.component.props.active = false;
      setTimeout(() => {
        render(null, $target);
        $target.parentNode.removeChild($target);
        vnode = null;
        $target = null;
      }, 500);
    },
  };
};

export const zeropad = (num: number | string, len: number) =>
  String(num).padStart(len, '0');

/**
 * sleep
 */
export const sleep = (millisecond: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, millisecond);
  });
};

/**
 * shuffle
 */
export function shuffle(array: Array<any>): Array<any> {
  const ret: Array<any> = array.concat();
  for (let i = ret.length - 1; i > 0; i -= 1) {
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = ret[i];
    ret[i] = ret[r];
    ret[r] = tmp;
  }
  return ret;
}

/**
 * asort
 */
export function asort(ary: Array<any>, key: string = 'id') {
  return ary.sort((a, b) => {
    const A = zeropad(a[key], 5);
    const B = zeropad(b[key], 5);
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
}
