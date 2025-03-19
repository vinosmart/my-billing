<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Sales Report</h1>

    <!-- Sales Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full table-auto">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              No.
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Product Name
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Quantity Sold
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Total Sales (₹)
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Sale Date
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(sale, index) in salesData"
            :key="index"
            class="hover:bg-gray-50 transition duration-200"
          >
            <td class="px-4 py-3 text-sm text-gray-700">{{ index + 1 }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ sale.productName }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ sale.quantity }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">
              ₹{{ sale.totalPrice }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ sale.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Analytics Button -->
    <div class="mt-6 text-right">
      <NuxtLink
        to="/analytics"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        View Analytics
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const salesData = ref([
  {
    productName: "Cotton Fabric",
    quantity: 10,
    totalPrice: 500,
    date: "2025-03-19",
  },
  {
    productName: "Silk Fabric",
    quantity: 5,
    totalPrice: 800,
    date: "2025-03-18",
  },
  {
    productName: "Silk Fabric",
    quantity: 5,
    totalPrice: 800,
    date: "2025-03-18",
  },
  {
    productName: "Silk Fabric",
    quantity: 5,
    totalPrice: 800,
    date: "2025-03-18",
  },
]);
</script>
