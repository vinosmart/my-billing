<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6">Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Products</h3>
        <p class="text-3xl font-bold text-gray-900">{{ products.length }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Stock Value</h3>
        <p class="text-3xl font-bold text-gray-900">₹{{ totalStockValue }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Today's Sales</h3>
        <p class="text-3xl font-bold text-gray-900">₹{{ todaysSales }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Low Stock Items</h3>
        <p class="text-3xl font-bold text-gray-900">{{ lowStockItems }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">Recent Bills</h3>
        <div class="space-y-2">
          <div
            v-for="bill in recentBills"
            :key="bill.id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded"
          >
            <span class="font-medium">{{ bill.billNo }}</span>
            <span class="text-gray-600">₹{{ bill.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">Low Stock Products</h3>
        <div class="space-y-2">
          <div
            v-for="product in lowStockProducts"
            :key="product.id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded"
          >
            <span class="font-medium">{{ product.name }}</span>
            <span class="text-red-600">{{ product.quantity }} left</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { products } = useProducts();
const { bills } = useBilling();

const totalStockValue = computed(() => {
  return products.value
    .reduce((sum, p) => sum + p.price * p.quantity, 0)
    .toFixed(2);
});

const todaysSales = computed(() => {
  const today = new Date().toDateString();
  return bills.value
    .filter((b) => new Date(b.createdAt).toDateString() === today)
    .reduce((sum, b) => sum + b.total, 0)
    .toFixed(2);
});

const lowStockItems = computed(() => {
  return products.value.filter((p) => p.quantity < 10).length;
});

const recentBills = computed(() => {
  return bills.value.slice(-5).reverse();
});

const lowStockProducts = computed(() => {
  return products.value.filter((p) => p.quantity < 10).slice(0, 5);
});
</script>
