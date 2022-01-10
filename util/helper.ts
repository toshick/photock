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

export const pad = (num: number, len: number) => String(num).padStart(len, '0');