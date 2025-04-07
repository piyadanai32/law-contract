<script lang="ts">
  export let links: {
    text: string;
    href: string;
  }[] = [];
</script>

<div class="breadcrumbs text-sm">
  <ul>
    {#each links as link}
      <li><span class="badge badge-secondary badge-outline">{link.text}</span></li>
    {/each}
  </ul>
</div>
