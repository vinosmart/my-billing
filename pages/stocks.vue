<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">
      Textile Shop Stock Management
    </h1>

    <!-- Search Bar -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search"
        class="border border-gray-300 rounded-md p-2 text-sm w-full max-w-sm"
      />
      <div class="">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          @click="openModal()"
        >
          Add New Stock
        </button>
      </div>
    </div>

    <!-- Stock Table -->
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
              Barcode
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Quantity
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Price (₹)
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(stock, index) in filteredStocks"
            :key="index"
            class="hover:bg-gray-50 transition duration-200"
          >
            <td class="px-4 py-3 text-sm text-gray-700">{{ index + 1 }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ stock.productName }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ stock.barcode }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ stock.category }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ stock.quantity }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ stock.price }}</td>
            <td class="px-4 py-3 text-sm">
              <span
                :class="{
                  'bg-green-100 text-green-800': stock.status === 'In Stock',
                  'bg-yellow-100 text-yellow-800': stock.status === 'Low Stock',
                  'bg-red-100 text-red-800': stock.status === 'Out of Stock',
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ stock.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <button
                class="text-blue-500 hover:text-blue-700"
                @click="openModal(stock, index)"
              >
                Edit
              </button>
              <button
                class="text-red-500 hover:text-red-700 ml-2"
                @click="confirmDelete(index)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add New Stock Button -->

    <!-- Modal for Add/Edit Stock -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          @click="closeModal"
        >
          ✖
        </button>
        <h2 class="text-xl font-bold mb-4">
          {{ isEditing ? "Edit Stock" : "Add New Stock" }}
        </h2>

        <label class="block text-sm font-medium text-gray-700"
          >Product Name</label
        >
        <input
          v-model="form.productName"
          type="text"
          class="border w-full p-2 rounded mb-3"
        />

        <label class="block text-sm font-medium text-gray-700">Barcode</label>
        <input
          v-model="form.barcode"
          type="text"
          class="border w-full p-2 rounded mb-3"
        />

        <label class="block text-sm font-medium text-gray-700">Category</label>
        <input
          v-model="form.category"
          type="text"
          class="border w-full p-2 rounded mb-3"
        />

        <label class="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          v-model.number="form.quantity"
          type="number"
          class="border w-full p-2 rounded mb-3"
        />

        <label class="block text-sm font-medium text-gray-700">Price</label>
        <input
          v-model="form.price"
          type="text"
          class="border w-full p-2 rounded mb-3"
        />

        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select v-model="form.status" class="border w-full p-2 rounded mb-4">
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>

        <div class="flex justify-end space-x-2">
          <button class="bg-gray-300 px-4 py-2 rounded" @click="closeModal">
            Cancel
          </button>
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded"
            @click="saveStock"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="isDeleteConfirm"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <p class="text-lg font-semibold mb-4">
          Are you sure you want to delete this stock?
        </p>
        <div class="flex justify-center space-x-4">
          <button
            class="bg-gray-300 px-4 py-2 rounded"
            @click="isDeleteConfirm = false"
          >
            Cancel
          </button>
          <button
            class="bg-red-600 text-white px-4 py-2 rounded"
            @click="deleteStock"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useStockStore } from "@/stores/stockStore";

const stockStore = useStockStore();
const searchQuery = ref("");
const isModalOpen = ref(false);
const isEditing = ref(false);
const editIndex = ref(null);
const form = ref({});
const isDeleteConfirm = ref(false);
const deleteIndex = ref(null);

const filteredStocks = computed(() =>
  stockStore.stocks.filter((stock) =>
    stock.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

function openModal(stock = null, index = null) {
  isEditing.value = !!stock;
  editIndex.value = index;
  form.value = stock
    ? { ...stock }
    : {
        productName: "",
        barcode: "",
        category: "",
        quantity: 0,
        price: "",
        status: "In Stock",
      };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function saveStock() {
  if (isEditing.value) {
    stockStore.updateStock(editIndex.value, { ...form.value });
  } else {
    stockStore.addStock({ ...form.value });
  }
  closeModal();
}

function confirmDelete(index) {
  isDeleteConfirm.value = true;
  deleteIndex.value = index;
}

function deleteStock() {
  stockStore.deleteStock(deleteIndex.value);
  isDeleteConfirm.value = false;
}
</script>
