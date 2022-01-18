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
        position: 'top',
        variant: 'info',
        duration: 3000,
      });
    },
    ng: (msg: string) => {
      oruga.notification.open({
        message: msg,
        rootClass: 'toast-notification',
        position: 'top',
        variant: 'warning',
        duration: 3000,
      });
    },
  };
};

export const zeropad = (num: number | string, len: number) =>
  String(num).padStart(len, '0');

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
