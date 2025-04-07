<script>
  export let title = "ระบบงานเอกสารสัญญาทางกฏหมาย";
  export let subtitle =
    "สาขาวิชานิติศาสตร์ มหาวิทยาลัยราชภัฏบุรีรัมย์";
</script>

<header>
  <h1 class="text-xl">{title}</h1>
  <p class="text-sm">{subtitle}</p>
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
