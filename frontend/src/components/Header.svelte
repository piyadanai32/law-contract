<script>
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  export let title = "ระบบงานเอกสารสัญญาทางกฏหมาย";
  export let subtitle = "สาขาวิชานิติศาสตร์ มหาวิทยาลัยราชภัฏบุรีรัมย์";

  function logout() {
    authStore.logout();
    goto('/');
  }
</script>

<header>
  <h1 class="text-xl">{title}</h1>
  <p class="text-sm">{subtitle}</p>
  <!-- <div class ="user-menu">
    {#if $authStore.user}
      <span class="user-name">{$authStore.user.name}</span>
      <button class="logout-btn" on:click={logout}>
        <i class="fa-solid fa-sign-out-alt"></i> ออกจากระบบ
      </button>
    {/if}
  </div> -->
</header>

<style>
  header {
    background-color: #333;
    color: white;
    padding: 1rem;
    text-align: center;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.25rem;
    }

    p {
      font-size: 0.75rem;
    }
  }
</style>
