<script>
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment"; // ตรวจสอบว่าอยู่ในเบราว์เซอร์หรือไม่

  let user = null; // เก็บข้อมูลผู้ใช้
  let error = null;

  // ดึงข้อมูลผู้ใช้จาก token
  function getUserFromToken() {
    if (!browser) {
      // หากไม่ใช่เบราว์เซอร์ ให้หยุดการทำงาน
      return;
    }

    const token = localStorage.getItem("sessionToken");
    if (!token) {
      error = "No session token found.";
      return;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      user = JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Error decoding token:", err);
      error = "Invalid session token.";
    }
  }

  // เรียกใช้ฟังก์ชันเมื่อโหลดหน้า
  getUserFromToken();

  // ฟังก์ชันออกจากระบบ
  function logout() {
    if (browser) {
      localStorage.removeItem("sessionToken");
    }
    goto("/"); // กลับไปที่หน้าแรก
  }
</script>

<div class="container">
  <h1>Dashboard</h1>

  {#if error}
    <div class="error">{error}</div>
  {:else if user}
    <div class="user-info">
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button on:click={logout}>Logout</button>
    </div>
  {:else}
    <p>Loading user information...</p>
  {/if}
</div>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .user-info {
    margin-top: 20px;
  }

  .error {
    color: red;
    margin-top: 20px;
  }

  button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #d32f2f;
  }
</style>