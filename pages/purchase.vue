<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800">Purchase Management</h2>
      <button
        @click="showAddPurchaseModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        :disabled="loading"
      >
        <svg
          v-if="loading"
          class="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>{{ loading ? "Loading..." : "New Purchase Order" }}</span>
      </button>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <div class="flex">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ error }}</span>
        <button @click="error = ''" class="ml-auto">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
    >
      <div class="flex">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ successMessage }}</span>
        <button @click="successMessage = ''" class="ml-auto">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 mr-4">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Purchases</p>
            <p class="text-2xl font-bold text-gray-800">
              ₹{{ totalPurchases.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 mr-4">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Purchase Orders</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 mr-4">
            <svg
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Pending Orders</p>
            <p class="text-2xl font-bold text-gray-800">{{ pendingOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 mr-4">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Active Suppliers</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ activeSuppliers }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Recent Purchases -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Recent Purchases -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow p-2">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Recent Purchase Orders
        </h3>
        <div
          v-if="loading && purchaseOrders.length === 0"
          class="flex justify-center items-center h-24"
        >
          <div class="flex flex-col items-center">
            <svg
              class="w-6 h-6 animate-spin text-indigo-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <p class="text-gray-500 text-sm">Loading orders...</p>
          </div>
        </div>
        <div v-else class="space-y-3">
          <div
            v-if="recentOrders.length === 0"
            class="text-center text-gray-500 py-8"
          >
            No purchase orders yet. Create your first order!
          </div>
          <div
            v-for="order in recentOrders.slice(0, 3)"
            :key="order.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-800">{{ order.supplier }}</p>
              <p class="text-sm text-gray-600">
                {{ formatDate(order.date) }} • {{ order.items.length }} items
              </p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-800">
                ₹{{ order.total.toLocaleString() }}
              </p>
              <span
                :class="getStatusClass(order.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Suppliers -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Top Suppliers</h3>
        <div class="space-y-3">
          <div
            v-if="topSuppliers.length === 0"
            class="text-center text-gray-500 py-8"
          >
            No suppliers yet
          </div>
          <div
            v-for="supplier in topSuppliers.slice(0, 3)"
            :key="supplier.name"
            class="flex justify-between items-center"
          >
            <div>
              <p class="font-medium text-gray-800">{{ supplier.name }}</p>
              <p class="text-sm text-gray-600">{{ supplier.orders }} orders</p>
            </div>
            <p class="font-semibold text-gray-800">
              ₹{{ supplier.total.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Orders Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
        >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search orders, suppliers..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-96"
          />
          <div class="flex space-x-3">
            <select
              v-model="statusFilter"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              v-model="supplierFilter"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Suppliers</option>
              <option
                v-for="supplier in uniqueSuppliers"
                :key="supplier"
                :value="supplier"
              >
                {{ supplier }}
              </option>
            </select>
            <button
              @click="fetchPurchaseOrders"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              :disabled="loading"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="loading && purchaseOrders.length === 0"
        class="flex justify-center items-center h-64"
      >
        <div class="flex flex-col items-center">
          <svg
            class="w-8 h-8 animate-spin text-indigo-600 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <p class="text-gray-500">Loading purchase orders...</p>
        </div>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Order ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Supplier
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Items
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total Amount
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="filteredOrders.length === 0" class="hover:bg-gray-50">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
              {{
                searchQuery || statusFilter || supplierFilter
                  ? "No orders match your filters."
                  : "No purchase orders yet. Create your first order!"
              }}
            </td>
          </tr>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-gray-50"
          >
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              #{{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ order.supplier }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.items.length }} items
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              ₹{{ order.total.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusClass(order.status)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click="viewOrder(order)"
                  class="text-indigo-600 hover:text-indigo-900"
                  :disabled="loading"
                >
                  View
                </button>
                <button
                  v-if="order.status === 'Pending'"
                  @click="updateOrderStatus(order.id, 'Received')"
                  class="text-green-600 hover:text-green-900"
                  :disabled="loading"
                >
                  Mark Received
                </button>
                <button
                  v-if="order.status === 'Pending'"
                  @click="updateOrderStatus(order.id, 'Cancelled')"
                  class="text-red-600 hover:text-red-900"
                  :disabled="loading"
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Purchase Modal -->
    <div
      v-if="showAddPurchaseModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showAddPurchaseModal = false"
    >
      <div
        @click.stop
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <h3 class="text-lg font-bold text-gray-900 mb-4">
            Create New Purchase Order
          </h3>

          <form @submit.prevent="createPurchaseOrder" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Supplier</label
              >
              <input
                v-model="newOrder.supplier"
                type="text"
                required
                placeholder="Supplier name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :disabled="saving"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Item Name</label
                >
                <input
                  v-model="newItem.name"
                  type="text"
                  placeholder="Product name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :disabled="saving"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Quantity</label
                >
                <input
                  v-model.number="newItem.quantity"
                  type="number"
                  min="1"
                  placeholder="Qty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :disabled="saving"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Unit Price</label
                >
                <div class="flex">
                  <input
                    v-model.number="newItem.price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :disabled="saving"
                  />
                  <button
                    type="button"
                    @click="addItemToOrder"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                    :disabled="saving"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <!-- Items List -->
            <div v-if="newOrder.items.length > 0" class="border rounded-md p-4">
              <h4 class="font-medium text-gray-700 mb-2">Order Items:</h4>
              <div class="space-y-2">
                <div
                  v-for="(item, index) in newOrder.items"
                  :key="index"
                  class="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span
                    >{{ item.name }} ({{ item.quantity }} × ₹{{
                      item.price
                    }})</span
                  >
                  <div class="flex items-center space-x-2">
                    <span class="font-medium"
                      >₹{{
                        (item.quantity * item.price).toLocaleString()
                      }}</span
                    >
                    <button
                      type="button"
                      @click="removeItemFromOrder(index)"
                      class="text-red-600 hover:text-red-800"
                      :disabled="saving"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-2 pt-2 border-t">
                <div class="flex justify-between font-semibold">
                  <span>Total: ₹{{ newOrder.total.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showAddPurchaseModal = false"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                :disabled="saving"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="newOrder.items.length === 0 || saving"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg
                  v-if="saving"
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{{
                  saving ? "Creating..." : "Create Purchase Order"
                }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Reactive data
const purchaseOrders = ref([]);
const searchQuery = ref("");
const statusFilter = ref("");
const supplierFilter = ref("");
const showAddPurchaseModal = ref(false);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const successMessage = ref("");

const newOrder = ref({
  supplier: "",
  items: [],
  total: 0,
  status: "Pending",
});

const newItem = ref({
  name: "",
  quantity: 1,
  price: 0,
});

// API Configuration
const API_BASE = "https://billing-software-ten.vercel.app/api";

// API Service
const apiService = {
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        throw new Error(
          "Unable to connect to server. Please check if the backend is running on port 5000."
        );
      }
      throw err;
    }
  },

  // Purchase API
  async getPurchases() {
    return this.makeRequest("/purchases");
  },

  async createPurchase(purchaseData) {
    return this.makeRequest("/purchases", {
      method: "POST",
      body: JSON.stringify(purchaseData),
    });
  },

  async updatePurchaseStatus(id, status) {
    return this.makeRequest(`/purchases/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// Helper functions
const showError = (message) => {
  error.value = message;
  setTimeout(() => (error.value = ""), 5000);
};

const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => (successMessage.value = ""), 3000);
};

// Computed properties
const filteredOrders = computed(() => {
  return purchaseOrders.value.filter((order) => {
    const matchesSearch =
      order.supplier.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.id.toString().includes(searchQuery.value);

    const matchesStatus =
      !statusFilter.value || order.status === statusFilter.value;
    const matchesSupplier =
      !supplierFilter.value || order.supplier === supplierFilter.value;

    return matchesSearch && matchesStatus && matchesSupplier;
  });
});

const totalPurchases = computed(() => {
  return purchaseOrders.value
    .filter((order) => order.status === "Received")
    .reduce((sum, order) => parseFloat(sum) + parseFloat(order.total), 0);
});

const totalOrders = computed(() => purchaseOrders.value.length);

const pendingOrders = computed(() => {
  return purchaseOrders.value.filter((order) => order.status === "Pending")
    .length;
});

const activeSuppliers = computed(() => {
  const suppliers = new Set(
    purchaseOrders.value.map((order) => order.supplier)
  );
  return suppliers.size;
});

const recentOrders = computed(() => {
  return purchaseOrders.value
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

const topSuppliers = computed(() => {
  const supplierStats = {};

  purchaseOrders.value.forEach((order) => {
    if (!supplierStats[order.supplier]) {
      supplierStats[order.supplier] = { orders: 0, total: 0 };
    }
    supplierStats[order.supplier].orders++;
    if (order.status === "Received") {
      supplierStats[order.supplier].total += order.total;
    }
  });

  return Object.entries(supplierStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
});

const uniqueSuppliers = computed(() => {
  return [...new Set(purchaseOrders.value.map((order) => order.supplier))];
});

// Main functions
const fetchPurchaseOrders = async () => {
  loading.value = true;
  error.value = "";

  try {
    const data = await apiService.getPurchases();
    purchaseOrders.value = data;
  } catch (err) {
    showError(err.message);
    console.error("Failed to fetch purchase orders:", err);
  } finally {
    loading.value = false;
  }
};

const addItemToOrder = () => {
  if (!newItem.value.name || !newItem.value.quantity || !newItem.value.price) {
    showError("Please fill all item details");
    return;
  }

  newOrder.value.items.push({ ...newItem.value });
  newOrder.value.total += newItem.value.quantity * newItem.value.price;

  // Reset form
  newItem.value = { name: "", quantity: 1, price: 0 };
};

const removeItemFromOrder = (index) => {
  const item = newOrder.value.items[index];
  newOrder.value.total -= item.quantity * item.price;
  newOrder.value.items.splice(index, 1);
};

const createPurchaseOrder = async () => {
  if (!newOrder.value.supplier || newOrder.value.items.length === 0) {
    showError("Please add supplier and at least one item");
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    const orderData = {
      supplier: newOrder.value.supplier,
      items: newOrder.value.items,
      total: newOrder.value.total,
      status: "Pending",
    };

    const savedOrder = await apiService.createPurchase(orderData);
    purchaseOrders.value.unshift(savedOrder);

    // Reset form
    newOrder.value = {
      supplier: "",
      items: [],
      total: 0,
      status: "Pending",
    };

    showAddPurchaseModal.value = false;
    showSuccess("Purchase order created successfully!");
  } catch (err) {
    showError(err.message);
    console.error("Failed to create purchase order:", err);
  } finally {
    saving.value = false;
  }
};

const updateOrderStatus = async (orderId, status) => {
  if (
    !confirm(
      `Are you sure you want to mark this order as ${status.toLowerCase()}?`
    )
  ) {
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await apiService.updatePurchaseStatus(orderId, status);

    // Update local state
    const order = purchaseOrders.value.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
    }

    showSuccess(`Order marked as ${status.toLowerCase()} successfully!`);
  } catch (err) {
    showError(err.message);
    console.error("Failed to update order status:", err);
  } finally {
    loading.value = false;
  }
};

const viewOrder = (order) => {
  const itemsList = order.items
    .map((item) => `• ${item.name} (${item.quantity} × ₹${item.price})`)
    .join("\n");
  alert(
    `Order #${order.id}\n\nSupplier: ${order.supplier}\nDate: ${formatDate(
      order.date
    )}\nStatus: ${
      order.status
    }\n\nItems:\n${itemsList}\n\nTotal: ₹${order.total.toLocaleString()}`
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Received":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Initialize data
onMounted(() => {
  fetchPurchaseOrders();
});

// Auto-refresh every 30 seconds
let refreshInterval;
onMounted(() => {
  refreshInterval = setInterval(fetchPurchaseOrders, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
