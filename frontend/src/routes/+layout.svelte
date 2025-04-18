<script lang="ts">
  import "../app.css";
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  import Header from "../components/Header.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import Footer from "../components/Footer.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";

  export let data; // รับข้อมูลจาก +layout.js

  // เพิ่ม interface สำหรับ User เพื่อแก้ไขปัญหา Property 'name' does not exist on type 'never'
  // interface User {
  //   name: string;
  // }

  // กำหนดประเภทสำหรับ authStore เพื่อแก้ไขปัญหาการเข้าถึง user
  interface AuthStoreType {
    isAuthenticated: boolean;
    loading: boolean;
    // user: User | null;
    initialize: () => void;
    logout: () => void;
  }

  // กำหนดค่า authStore ให้มีประเภทที่ถูกต้อง
  const typedAuthStore = authStore as unknown as AuthStoreType;

  interface Link {
    href: string;
    text: string;
    icon: string;
    submenu?: Link[];
  }

  const navLinks: Link[] = [
    { href: "/home", text: "หน้าหลัก", icon: "fa-solid fa-house" },
    {
      href: "/contract",
      text: "สัญญา",
      icon: "fa-solid fa-cogs",
      submenu: [
        {
          href: "/contract/GeneralSalesContract",
          text: "สัญญาซื้อขายทั่วไป",
          icon: "fa-solid fa-file",
        },
        {
          href: "/contract/CornSalesContract",
          text: "สัญญาซื้อขายข้าวโพด",
          icon: "fa-solid fa-file",
        },
        {
          href: "/contract/ContractFarmingAgreement",
          text: "สัญญาจ้างเลี้ยง",
          icon: "fa-solid fa-file",
        },
      ],
    },
    {
      href: "/communityEnterprise",
      text: "วิสาหกิจชุมชน",
      icon: "fa-solid fa-gavel",
      submenu: [
        {
          href: "/communityEnterprise/GeneralPetitionForm",
          text: "แบบคำร้องทั่วไป",
          icon: "fa-solid fa-file",
        },
        {
          href: "/communityEnterprise/BusinessPlan",
          text: "แผนประกอบการ",
          icon: "fa-solid fa-file",
        },
        {
          href: "/communityEnterprise/OperationResults",
          text: "ผลการดำเนินงาน",
          icon: "fa-solid fa-file",
        },
      ],
    },
    {
      href: "/officers",
      text: "หน่วยงานที่เกี่ยวข้อง",
      icon: "fa-solid fa-phone",
    },
    { href: "/about", text: "คณะผู้จัดทำ", icon: "fa-solid fa-info-circle" },
  ];

  let breadcrumbPath: { href: string; text: string }[] = [];

  function handleMenuClick(event: CustomEvent<{ href: string; text: string }>) {
    breadcrumbPath = [{ href: event.detail.href, text: event.detail.text }];
  }

  let isSidebarOpen = false;

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
  
  // จัดการกับการตรวจสอบการล็อกอิน
  $: {
    const publicPaths = ['/', '/login'];
    const isPublicPath = publicPaths.some(path => $page.url.pathname === path || $page.url.pathname.startsWith('/auth'));
    
    if (!isPublicPath && !$authStore.isAuthenticated && !$authStore.loading) {
      goto('/');
    }
  }
  
  onMount(() => {
    // เริ่มต้น authStore เมื่อหน้าโหลด
    typedAuthStore.initialize();
  });
  
  // ฟังก์ชันสำหรับการล็อกเอาต์
  function logout() {
    typedAuthStore.logout();
    goto('/');
  }
</script>

<!-- ถ้าอยู่ในหน้าล็อกอินหรือหน้าที่ไม่ต้องการเลย์เอาต์ -->
{#if $page.url.pathname === '/' || $page.url.pathname === '/login'}
  <slot />
{:else if $authStore.loading}
  <div class="loading-container">กำลังโหลด...</div>
{:else if $authStore.isAuthenticated}
  <!-- ถ้าล็อกอินแล้วให้แสดงเลย์เอาต์ปกติ -->
  <div class="layout">
    <Header />
    <div class="main-content">
      <button class="sidebar-toggle" on:click={toggleSidebar} aria-label="Toggle sidebar">
        <i class="fa-solid fa-bars"></i>
      </button>
      <Sidebar links={navLinks} on:menuClick={handleMenuClick} isOpen={isSidebarOpen} />
      <main>
        <Breadcrumb links={breadcrumbPath} />
        <slot />
      </main>
    </div>

    <Footer />
  </div>
{:else}
  <!-- ถ้ายังไม่ล็อกอินให้เปลี่ยนเส้นทางไปหน้าล็อกอิน -->
  <script>
    window.location.href = '/';
  </script>
{/if}

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
  }

  .sidebar-toggle {
    display: none;
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #333;
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1000;
    border-radius: 50%;
    padding: 0.5rem;
    transition: transform 0.3s ease;
  }

  .sidebar-toggle:hover {
    transform: scale(1.1);
  }

  .main-content {
    display: flex;
    flex: 1;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  main {
    flex: 1;
    padding: 1.5rem;
    background-color: #f4f4f4;
    border-radius: 8px;
    margin: 1rem;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.5rem;
    color: #333;
  }
  
  .user-name {
    margin-right: 10px;
    font-weight: bold;
  }
  
  .logout-btn {
    background: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .logout-btn:hover {
    background: #d32f2f;
  }

  @media (max-width: 768px) {
    .sidebar-toggle {
      display: block;
    }

    .main-content {
      flex-direction: column;
    }

    main {
      margin: 0.5rem;
      padding: 1rem;
    }
  }

  @media (max-width: 480px) {
    .sidebar-toggle {
      top: 0.5rem;
      left: 0.5rem;
      font-size: 1.2rem;
      padding: 0.3rem;
    }

    main {
      margin: 0.3rem;
      padding: 0.8rem;
    }
  }
</style>