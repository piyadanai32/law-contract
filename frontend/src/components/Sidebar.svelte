<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  export let links: {
    href: string;
    text: string;
    icon: string;
    submenu?: {
      href: string;
      text: string;
      icon: string;
    }[];
  }[] = [];

  export let isOpen: boolean = false;

  interface AuthStoreType {
    isAuthenticated: boolean;
    loading: boolean;
    // user: User | null;
    initialize: () => void;
    logout: () => void;
  }

  //breadcrumb
  const dispatch = createEventDispatcher();

  function handleClick(link: {
    href: string;
    text: string;
    icon: string;
    submenu?: { href: string; text: string; icon: string }[];
  }) {
    dispatch("menuClick", { href: link.href, text: link.text });
  }

  //login
  let isLoggedIn = false;

  // Subscribe to the auth store to get current login state
  onMount(() => {
    const unsubscribe = authStore.subscribe(auth => {
      isLoggedIn = !!auth.token;
    });

    return unsubscribe;
  });

  function handleAuth() {
    if (isLoggedIn) {
      // If already logged in, log out
      logout();
    } else {
      // If not logged in, redirect to login page
      goto('/');
    }
  }
  
  function logout() {
    authStore.logout();
    goto('/');
  }
</script>

<aside aria-label="Sidebar Navigation" class="sidebar {isOpen ? 'is-open' : ''}">
  <ul class="menu">
    {#each links as link (link.href)}
      {#if link.text == "<hr>"}
        <hr class="mt-4 mb-4" />
      {:else}
        <li>
          <a
            href={link.href}
            class="menu-item"
            on:click={() => handleClick(link)}
          >
            <i class={`icon ${link.icon}`}></i>
            {link.text}
          </a>
          {#if link.submenu}
            <ul class="submenu">
              {#each link.submenu as sublink (sublink.href)}
                <li>
                  <a
                    href={sublink.href}
                    class="submenu-item"
                    on:click={() => handleClick(sublink)}
                  >
                    <i class={`icon ${sublink.icon}`}></i>
                    {sublink.text}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/if}
    {/each}
  </ul>

  <ul class="menu login">
    <h1 class="user-name">{$authStore.user ? $authStore.user.name : 'Guest'}</h1>
    <hr />
    <li>
      <button class="menu-item" on:click={handleAuth}>
        <i class="icon fas fa-sign-in-alt"></i>
        {isLoggedIn ? "ออกจากระบบ" : "เข้าสู่ระบบ"}
      </button>
    </li>
  </ul>
</aside>

<style>
  .sidebar {
    background-color: #f4f4f4;
    padding: 1rem;
    width: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sidebar.is-open {
    display: block;
  }
  h1.user-name {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
  }
  hr {
    border: none;
    border-top: 1px solid #ccc;
    margin: 0.5rem 0;
  }

  @media (max-width: 768px) {
    .sidebar {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 250px;
      z-index: 999;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }
  }

  .menu {
    list-style: none;
    padding: 0.5rem;
  }

  .menu.login {
    margin-top: auto;
    margin-bottom: 2rem;
  }

  .menu-item,
  .submenu-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    color: #333;
    font-size: 1rem;
    font-weight: 500;
    margin: 0.2rem;
  }

  .menu-item:hover,
  .submenu-item:hover {
    background-color: #8d8d8d;
    color: #ffffff;
  }

  .icon {
    margin-right: 1rem;
    font-size: 1.25rem;
  }

  .submenu {
    margin-left: 1rem;
    margin-top: 0.5rem;
    list-style: none;
    padding: 0;
  }

  .active {
    background-color: #8d8d8d;
    color: #ffffff;
  }
</style>