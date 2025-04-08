// src/routes/+layout.js
import { authStore } from '$lib/stores/authStore';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize auth store
export function load({ url }) {
  if (browser) {
    authStore.initialize();
  }
  
  // ตัวอย่างหน้าที่ไม่ต้องเข้าสู่ระบบ (ปรับตามความต้องการของคุณ)
  const publicPaths = ['/', '/login'];
  
  // ตรวจสอบว่าอยู่ในเส้นทางสาธารณะหรือไม่
  const isPublicPath = publicPaths.some(path => url.pathname === path || url.pathname.startsWith('/auth'));
  
  // ถ้าไม่ใช่เส้นทางสาธารณะและอยู่ในเบราว์เซอร์
  if (!isPublicPath && browser) {
    const auth = get(authStore);
    
    // ถ้าการโหลดข้อมูลเสร็จสิ้นแล้ว และไม่ได้เข้าสู่ระบบ
    if (!auth.loading && !auth.isAuthenticated) {
      // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
      goto('/');
    }
  }
  
  return {
    authenticated: browser ? get(authStore).isAuthenticated : false
  };
}