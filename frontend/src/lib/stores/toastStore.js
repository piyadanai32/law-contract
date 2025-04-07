import { writable } from "svelte/store";

export const toastStore = writable([]);

export function addToast(message, type = "info", duration = 5000) {
  const id = Date.now();

  toastStore.update(toasts => {
    if (toasts.length >= 5) {
      toasts.shift(); // ลบตัวแรกออก เพื่อให้ตัวใหม่แทนที่ตำแหน่งล่างสุด
    }
    return [...toasts, { id, message, type }];
  });

  setTimeout(() => {
    toastStore.update(toasts => toasts.filter(toast => toast.id !== id));
  }, duration);
}
