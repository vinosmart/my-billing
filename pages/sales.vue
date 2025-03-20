<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Sales Report</h1>

    <!-- Add Product Form -->
    <div class="mb-6 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Add New Product</h2>
      <form @submit.prevent="addProduct" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Product Name</label
          >
          <input
            v-model="newProduct.productName"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Quantity Sold</label
          >
          <input
            v-model="newProduct.quantity"
            type="number"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Total Sales (₹)</label
          >
          <input
            v-model="newProduct.totalPrice"
            type="number"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Sale Date</label
          >
          <input
            v-model="newProduct.date"
            type="date"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>

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

const salesData = ref([]);
const newProduct = ref({
  productName: "",
  quantity: 0,
  totalPrice: 0,
  date: "",
});

// Fetch sales data on component mount
onMounted(async () => {
  await fetchSalesData();
});

// Fetch sales data from the backend
async function fetchSalesData() {
  try {
    const response = await fetch("http://localhost:3000/api/sales");
    const data = await response.json();
    salesData.value = data;
  } catch (error) {
    console.error("Failed to fetch sales data:", error);
  }
}

// Add a new product
async function addProduct() {
  try {
    const response = await fetch("http://localhost:3000/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct.value),
    });

    if (response.ok) {
      // Clear the form
      newProduct.value = {
        productName: "",
        quantity: 0,
        totalPrice: 0,
        date: "",
      };

      // Refresh the sales data
      await fetchSalesData();
    } else {
      console.error("Failed to add product:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
}
</script>
