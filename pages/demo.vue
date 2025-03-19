<template>
  <div class="p-6">
    <label for="name" class="block text-lg font-semibold"
      >Enter your name:</label
    >
    <input
      v-model="names"
      type="text"
      class="border p-2 rounded-md w-full mt-2"
    />
    <input
      v-model="number"
      type="text"
      class="border p-2 rounded-md w-full mt-2"
    />
    <p class="mt-4 text-xl">Hello, {{ names }}!</p>
    <p class="mt-4 text-xl">Hello, {{ number }}!</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      names: "",
      number: "",
    };
  },
};
</script>
