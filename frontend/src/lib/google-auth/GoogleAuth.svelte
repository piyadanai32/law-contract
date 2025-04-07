<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let clientId;
  export let text = 'Sign in with Google';
  
  const dispatch = createEventDispatcher();
  
  let buttonContainer;
  let disabled = true;

  onMount(() => {
    // Load the GIS script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  });

  function initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      buttonContainer, 
      { 
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: text
      }
    );

    disabled = false;
  }

  function handleCredentialResponse(response) {
    if (response.credential) {
      // Decode the JWT token to get user information
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const user = JSON.parse(jsonPayload);
      
      dispatch('auth-success', { 
        user,
        credential: response.credential 
      });
    } else {
      dispatch('auth-failure', { 
        error: 'No credential received' 
      });
    }
  }
</script>

<div bind:this={buttonContainer} class:disabled></div>

<style>
  .disabled {
    pointer-events: none;
    opacity: 0.6;
  }
</style>