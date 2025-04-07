<script>

  import SocialLogin from "$lib/SocialLogin.svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
  const API_BASE_URL = "http://localhost:8000"; // URL ของ Backend

  let loading = false;
  let error = null;

  async function handleGoogleSuccess(event) {
    const { user, credential } = event.detail;
    loading = true;
    error = null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        // ใช้ API_BASE_URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential,
          userData: {
            name: user.name,
            email: user.email,
            picture: user.picture,
            googleId: user.sub,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with server");
      }

      const data = await response.json();

      if (browser) {
        localStorage.setItem("sessionToken", data.token);
      }

      goto("/dashboard");
    } catch (err) {
      console.error("Google authentication error:", err);
      error = "Failed to complete authentication. Please try again.";
    } finally {
      loading = false;
    }
  }


  async function handleFacebookSuccess(event) {
  const { accessToken, user } = event.detail;
  loading = true;
  error = null;

  try {
    if (!user.id) {
      throw new Error("Missing Facebook ID");
    }

    const response = await fetch(`${API_BASE_URL}/auth/facebook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        userData: {
          facebookId: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture?.data?.url,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error("Failed to authenticate with server");
    }

    const data = await response.json();
    localStorage.setItem("sessionToken", data.token);
    goto("/dashboard");
  } catch (err) {
    console.error("Facebook authentication error:", err);
    error = "Failed to complete authentication. Please try again.";
  } finally {
    loading = false;
  }
}


  function handleGoogleFailure(event) {
    const { error: authError } = event.detail;
    console.error("Google authentication failed:", authError);
    error = "Failed to authenticate with Google. Please try again.";
    loading = false;
  }

  function handleFacebookFailure(event) {
    const { error: authError } = event.detail;
    console.error("Facebook authentication failed:", authError);
    error = "Failed to authenticate with Facebook. Please try again.";
    loading = false;
  }
</script>

<div class="container">
  <h1>Welcome</h1>

  <div class="signin-container">
    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    {#if loading}
      <div class="loading">Signing in...</div>
    {:else}
      <SocialLogin
        googleClientId={GOOGLE_CLIENT_ID}
        facebookAppId={FACEBOOK_APP_ID}
        on:google-auth-success={handleGoogleSuccess}
        on:google-auth-failure={handleGoogleFailure}
        on:facebook-auth-success={handleFacebookSuccess}
        on:facebook-auth-failure={handleFacebookFailure}
      />
    {/if}
  </div>
</div>
