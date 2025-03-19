<template>
  <div class="flex h-screen">
    <aside
      :class="[
        'bg-gray-800 text-white transition-all duration-300',
        isOpen ? 'w-64' : 'w-16',
      ]"
    >
      <button @click="isOpen = !isOpen" class="p-4">
        {{ isOpen ? "Close" : "Open" }}
      </button>
      <nav
        class="overflow-hidden"
        :class="{
          'opacity-100': isOpen,
          'opacity-0': !isOpen,
          'transition-opacity duration-300': true,
        }"
      >
        <NuxtLink to="/analytics" class="block p-4">Analytics</NuxtLink>
        <NuxtLink to="/stocks" class="block p-4">Stocks</NuxtLink>
        <NuxtLink to="/bill" class="block p-4">Bill</NuxtLink>
        <NuxtLink to="/sales" class="block p-4">Sales</NuxtLink>
        <NuxtLink to="/barcode" class="block p-4">Barcode</NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 p-4">
      <slot />
    </main>
  </div>
</template>

<script setup>
const isOpen = useState("sidebar", () => true);
</script>

<style>
nav a {
  display: block;
  padding: 10px;
  transition: background 0.3s;
}
nav a:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
