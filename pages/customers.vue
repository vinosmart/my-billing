<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
    >
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Customer Management</h2>
        <p class="text-gray-600 mt-1">
          View and manage customer information and purchase history
        </p>
      </div>
      <div class="flex items-center space-x-4 mt-4 sm:mt-0">
        <div class="text-right">
          <p class="text-sm text-gray-600">Total Customers</p>
          <p class="text-2xl font-bold text-blue-600">{{ totalCustomers }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-600">Active Today</p>
          <p class="text-2xl font-bold text-green-600">
            {{ todayActiveCustomers }}
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Panel - Search and Filters -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Customer Search -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3
            class="text-lg font-semibold text-gray-800 mb-4 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search Customers
          </h3>

          <div class="space-y-4">
            <!-- Search Input -->
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="searchCustomers"
                type="text"
                placeholder="Search by name, phone, or email..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                class="w-4 h-4 text-gray-400 absolute left-3 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <!-- Filter Options -->
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Period
                </label>
                <select
                  v-model="selectedPeriod"
                  @change="applyFilters"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  v-model="sortBy"
                  @change="applySorting"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="totalSpent">Total Spent</option>
                  <option value="billCount">Bill Count</option>
                </select>
              </div>
            </div>

            <!-- Refresh Button -->
            <button
              @click="fetchCustomers"
              :disabled="loading"
              class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg
                :class="['w-4 h-4', loading ? 'animate-spin' : '']"
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
              <span>{{ loading ? "Loading..." : "Refresh" }}</span>
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Top Customer:</span>
              <span class="font-medium">{{ topCustomer?.name || "N/A" }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Avg. Purchase:</span>
              <span class="font-medium"
                >₹{{ averagePurchase.toLocaleString() }}</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Repeat Customers:</span>
              <span class="font-medium">{{ repeatCustomers }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">New This Month:</span>
              <span class="font-medium">{{ newCustomersThisMonth }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Panel - Customer List -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800">
              Customer List
              <span class="text-sm font-normal text-gray-500 ml-2">
                ({{ filteredCustomers.length }} customers)
              </span>
            </h3>
            <div class="flex items-center space-x-2">
              <button
                @click="exportCustomers"
                class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center space-x-1"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Export</span>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading && customers.length === 0" class="space-y-4">
            <div v-for="i in 6" :key="i" class="animate-pulse">
              <div
                class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div class="text-right">
                  <div class="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div class="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="filteredCustomers.length === 0"
            class="text-center py-12"
          >
            <svg
              class="w-16 h-16 mx-auto mb-4 text-gray-300"
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
            <p class="text-gray-500">No customers found</p>
            <p class="text-xs text-gray-400 mt-1">
              {{
                searchQuery
                  ? "Try adjusting your search criteria"
                  : "Customer data will appear here"
              }}
            </p>
          </div>

          <!-- Customer List -->
          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="customer in paginatedCustomers"
              :key="customer.id"
              @click="selectCustomer(customer)"
              :class="[
                'p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200',
                selectedCustomer?.id === customer.id
                  ? 'ring-2 ring-indigo-500 bg-indigo-50'
                  : '',
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <span class="text-white font-bold text-lg">
                      {{ getInitials(customer.name) }}
                    </span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">
                      {{ customer.name }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      {{ customer.phone || "No phone" }}
                      <span v-if="customer.email" class="ml-2"
                        >• {{ customer.email }}</span
                      >
                    </p>
                    <p class="text-xs text-gray-400">
                      Last visit: {{ formatDateTime(customer.lastVisit) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-800">
                    ₹{{ customer.totalSpent.toLocaleString() }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ customer.billCount }} bill{{
                      customer.billCount !== 1 ? "s" : ""
                    }}
                  </p>
                  <div class="flex items-center mt-1">
                    <span
                      :class="[
                        'inline-block w-2 h-2 rounded-full mr-1',
                        customer.isFrequent ? 'bg-green-500' : 'bg-gray-400',
                      ]"
                    ></span>
                    <span class="text-xs text-gray-500">
                      {{ customer.isFrequent ? "Frequent" : "Regular" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200"
          >
            <div class="text-sm text-gray-500">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{
                Math.min(currentPage * itemsPerPage, filteredCustomers.length)
              }}
              of {{ filteredCustomers.length }} customers
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
              >
                Previous
              </button>
              <span class="px-3 py-1 text-sm">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Detail Modal -->
    <div
      v-if="selectedCustomer"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="selectedCustomer = null"
    >
      <div
        @click.stop
        class="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800">Customer Details</h3>
          <button
            @click="selectedCustomer = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Customer Info -->
          <div>
            <h4 class="font-semibold text-gray-800 mb-3">
              Contact Information
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Name:</span>
                <span class="font-medium">{{ selectedCustomer.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phone:</span>
                <span class="font-medium">{{
                  selectedCustomer.phone || "Not provided"
                }}</span>
              </div>
              <!-- <div class="flex justify-between">
                <span class="text-gray-600">Email:</span>
                <span class="font-medium">{{
                  selectedCustomer.email || "Not provided"
                }}</span>
              </div> -->
              <div class="flex justify-between">
                <span class="text-gray-600">First Visit:</span>
                <span class="font-medium">{{
                  formatDateTime(selectedCustomer.firstVisit)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Visit:</span>
                <span class="font-medium">{{
                  formatDateTime(selectedCustomer.lastVisit)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Purchase Stats -->
          <div>
            <h4 class="font-semibold text-gray-800 mb-3">
              Purchase Statistics
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Spent:</span>
                <span class="font-medium text-green-600"
                  >₹{{ selectedCustomer.totalSpent.toLocaleString() }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Bills:</span>
                <span class="font-medium">{{
                  selectedCustomer.billCount
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Average Bill:</span>
                <span class="font-medium"
                  >₹{{
                    (
                      selectedCustomer.totalSpent / selectedCustomer.billCount
                    ).toLocaleString()
                  }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Customer Type:</span>
                <span
                  :class="[
                    'font-medium',
                    selectedCustomer.isFrequent
                      ? 'text-green-600'
                      : 'text-gray-600',
                  ]"
                >
                  {{
                    selectedCustomer.isFrequent
                      ? "Frequent Customer"
                      : "Regular Customer"
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Bills -->
        <div class="mt-6">
          <h4 class="font-semibold text-gray-800 mb-3">Recent Bills</h4>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <div
              v-for="bill in selectedCustomer.recentBills || []"
              :key="bill.id"
              class="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
            >
              <div>
                <span class="font-medium">Bill #{{ bill.id }}</span>
                <span class="text-gray-500 ml-2">{{
                  formatDateTime(bill.date)
                }}</span>
              </div>
              <span class="font-medium"
                >₹{{ bill.total.toLocaleString() }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Reactive data
const customers = ref([]);
const selectedCustomer = ref(null);
const searchQuery = ref("");
const selectedPeriod = ref("all");
const sortBy = ref("recent");
const loading = ref(false);
const error = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);

// API Configuration
const API_BASE = "https://billing-software-ten.vercel.app//api";

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

  async getCustomers() {
    return this.makeRequest("/bills/recent/list");
  },
};

// Computed properties
const filteredCustomers = computed(() => {
  let filtered = [...customers.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.includes(query)) ||
        (customer.email && customer.email.toLowerCase().includes(query))
    );
  }

  // Apply period filter
  if (selectedPeriod.value !== "all") {
    const now = new Date();
    const periodStart = new Date();

    switch (selectedPeriod.value) {
      case "today":
        periodStart.setHours(0, 0, 0, 0);
        break;
      case "week":
        periodStart.setDate(now.getDate() - 7);
        break;
      case "month":
        periodStart.setMonth(now.getMonth() - 1);
        break;
    }

    filtered = filtered.filter(
      (customer) => new Date(customer.lastVisit) >= periodStart
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "totalSpent":
      filtered.sort((a, b) => b.totalSpent - a.totalSpent);
      break;
    case "billCount":
      filtered.sort((a, b) => b.billCount - a.billCount);
      break;
    case "recent":
    default:
      filtered.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
      break;
  }

  return filtered;
});

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCustomers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage.value);
});

const totalCustomers = computed(() => customers.value.length);

const todayActiveCustomers = computed(() => {
  const today = new Date().toDateString();
  return customers.value.filter(
    (customer) => new Date(customer.lastVisit).toDateString() === today
  ).length;
});

const topCustomer = computed(() => {
  return customers.value.reduce(
    (top, customer) =>
      customer.totalSpent > (top?.totalSpent || 0) ? customer : top,
    null
  );
});

const averagePurchase = computed(() => {
  if (customers.value.length === 0) return 0;
  const total = customers.value.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );
  return total / customers.value.length;
});

const repeatCustomers = computed(() => {
  return customers.value.filter((customer) => customer.billCount > 1).length;
});

const newCustomersThisMonth = computed(() => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  return customers.value.filter(
    (customer) => new Date(customer.firstVisit) >= monthStart
  ).length;
});

// Helper functions
const showError = (message) => {
  error.value = message;
  setTimeout(() => (error.value = ""), 5000);
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

// Customer functions
const fetchCustomers = async () => {
  loading.value = true;
  try {
    const data = await apiService.getCustomers();

    // Transform the data to match our customer structure
    // Assuming the API returns bill data, we need to group by customer
    const customerMap = new Map();

    data.forEach((bill) => {
      const customerKey = bill.customerName || "Walk-in Customer";
      const customerPhone = bill.customerPhone || null;

      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          id: `customer_${customerMap.size + 1}`,
          name: customerKey,
          phone: customerPhone,
          email: null, // Not available in bills data
          firstVisit: bill.date,
          lastVisit: bill.date,
          totalSpent: 0,
          billCount: 0,
          isFrequent: false,
          recentBills: [],
        });
      }

      const customer = customerMap.get(customerKey);
      customer.totalSpent += bill.total;
      customer.billCount += 1;
      customer.lastVisit =
        new Date(bill.date) > new Date(customer.lastVisit)
          ? bill.date
          : customer.lastVisit;
      customer.firstVisit =
        new Date(bill.date) < new Date(customer.firstVisit)
          ? bill.date
          : customer.firstVisit;
      customer.isFrequent = customer.billCount >= 3;
      customer.recentBills.push(bill);
    });

    customers.value = Array.from(customerMap.values());
  } catch (err) {
    showError(err.message);
    console.error("Failed to fetch customers:", err);
  } finally {
    loading.value = false;
  }
};

const searchCustomers = () => {
  currentPage.value = 1; // Reset to first page when searching
};

const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const applySorting = () => {
  currentPage.value = 1; // Reset to first page when sorting
};

const selectCustomer = (customer) => {
  selectedCustomer.value = customer;
};

const exportCustomers = () => {
  const csvContent = [
    [
      "Name",
      "Phone",
      "Email",
      "Total Spent",
      "Bill Count",
      "First Visit",
      "Last Visit",
    ].join(","),
    ...filteredCustomers.value.map((customer) =>
      [
        customer.name,
        customer.phone || "",
        customer.email || "",
        customer.totalSpent,
        customer.billCount,
        customer.firstVisit,
        customer.lastVisit,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `customers_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Initialize
onMounted(() => {
  fetchCustomers();
});
</script>
