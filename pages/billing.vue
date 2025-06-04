<!-- pages/index.vue -->
<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
    >
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Billing System</h2>
        <p class="text-gray-600 mt-1">
          Create professional invoices and manage sales
        </p>
      </div>
      <div class="flex items-center space-x-4 mt-4 sm:mt-0">
        <div class="text-right">
          <p class="text-sm text-gray-600">Today's Sales</p>
          <p class="text-2xl font-bold text-green-600">
            ₹{{ todaysSales.toLocaleString() }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-600">Bills Count</p>
          <p class="text-2xl font-bold text-blue-600">{{ todaysBillsCount }}</p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      <div class="flex">
        <span>{{ error }}</span>
        <button @click="error = ''" class="ml-auto">×</button>
      </div>
    </div>

    <div
      v-if="successMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
    >
      <div class="flex">
        <span>{{ successMessage }}</span>
        <button @click="successMessage = ''" class="ml-auto">×</button>
      </div>
    </div>

    <!-- Scanned Product Details Modal -->
    <ClientOnly>
      <div
        v-if="scannedProduct"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Product Scanned</h3>
            <button
              @click="scannedProduct = null"
              class="text-gray-500 hover:text-gray-700"
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

          <div class="space-y-3">
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div class="text-center">
              <h4 class="font-semibold text-gray-800 text-lg">
                {{ scannedProduct.name }}
              </h4>
              <p class="text-gray-600">{{ scannedProduct.category }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="text-center">
                <p class="text-gray-600">Price</p>
                <p class="font-semibold text-gray-800">
                  ₹{{ scannedProduct.price }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-gray-600">Stock</p>
                <p class="font-semibold text-gray-800">
                  {{ scannedProduct.quantity }}
                </p>
              </div>
            </div>

            <div class="text-center">
              <p class="text-xs text-gray-500">
                Barcode: {{ scannedProduct.barcode }}
              </p>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              @click="scannedProduct = null"
              class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              @click="addScannedProductToCart"
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Left Panel - Product Search -->
      <div class="xl:col-span-1 space-y-6">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Product Search
          </h3>

          <!-- Barcode Scanner Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-md font-semibold text-gray-800 flex items-center">
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4M6 12H4m6 11h2m-6 0h-2v-4m0 11v-3m0 0h-.01M12 12h-4.01M12 12h4.01M12 12v-4m6-4h2m-6 0h-2v-4m0 4v3m0 0h.01"
                  />
                </svg>
                Barcode Scanner
              </h4>
              <div class="flex items-center space-x-2">
                <div
                  :class="[
                    'w-2 h-2 rounded-full',
                    scanning ? 'bg-green-500' : 'bg-gray-400',
                  ]"
                ></div>
                <span class="text-xs text-gray-600">{{
                  scanning ? "Active" : "Inactive"
                }}</span>
              </div>
            </div>

            <ClientOnly>
              <button
                @click="toggleScanner"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2',
                  scanning
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white',
                ]"
              >
                <svg
                  v-if="scanning"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 10h6v4H9z"
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
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{{ scanning ? "Stop Scanner" : "Start Scanner" }}</span>
              </button>

              <div
                id="reader"
                class="mt-4 rounded-lg overflow-hidden"
                :class="{ hidden: !scanning }"
              ></div>
            </ClientOnly>
          </div>

          <!-- Manual Entry -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Add Product</label
            >
            <div class="flex space-x-2">
              <input
                v-model="manualBarcode"
                @keyup.enter="addProductByBarcode"
                type="text"
                placeholder="Enter product name or barcode"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :disabled="loading"
              />
              <button
                @click="addProductByBarcode"
                class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                :disabled="loading || !manualBarcode"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Quick Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Search Products</label
            >
            <input
              v-model="productSearchQuery"
              @input="searchProducts"
              type="text"
              placeholder="Search products..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <!-- Search Results -->
            <div
              v-if="searchResults.length > 0"
              class="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg"
            >
              <div
                v-for="product in searchResults"
                :key="product.id"
                @click="addProductToCart(product)"
                class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-medium text-gray-800">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ product.category }} • ₹{{ product.price }}
                    </p>
                  </div>
                  <span class="text-xs bg-gray-100 px-2 py-1 rounded"
                    >Stock: {{ product.quantity }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bill Summary -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Bill Summary</h3>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Items:</span>
              <span class="font-medium">{{ billItems.length }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Quantity:</span>
              <span class="font-medium">{{ totalQuantity }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span class="text-green-600"
                >₹{{ totalAmount.toLocaleString() }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Center Panel - Current Bill -->
      <div class="xl:col-span-1">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800">Current Bill</h3>
            <span class="text-sm text-gray-500">#{{ currentBillId }}</span>
          </div>

          <!-- Customer Info -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Customer Information</label
            >
            <div class="grid grid-cols-1 gap-3">
              <input
                v-model="customerName"
                type="text"
                placeholder="Customer Name"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                v-model="customerPhone"
                type="text"
                placeholder="Phone Number (Optional)"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Bill Items -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-medium text-gray-700">Items</h4>
              <button
                v-if="billItems.length > 0"
                @click="clearBill"
                class="text-xs text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            </div>

            <div
              class="border border-gray-200 rounded-lg max-h-96 overflow-y-auto"
            >
              <div
                v-if="billItems.length === 0"
                class="p-8 text-center text-gray-500"
              >
                <p>No items added yet</p>
                <p class="text-xs mt-1">
                  Search and add products to create bill
                </p>
              </div>

              <div
                v-for="(item, index) in billItems"
                :key="index"
                class="p-4 border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-800">{{ item.name }}</h5>
                    <p class="text-sm text-gray-500">
                      {{ item.category }} • ₹{{ item.price }} each
                    </p>
                  </div>
                  <button
                    @click="removeItem(index)"
                    class="text-red-500 hover:text-red-700 ml-2"
                  >
                    🗑️
                  </button>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center space-x-3">
                    <button
                      @click="updateQuantity(index, -1)"
                      class="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span class="w-12 text-center font-medium text-gray-800">{{
                      item.quantity
                    }}</span>
                    <button
                      @click="updateQuantity(index, 1)"
                      class="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-800">
                      ₹{{ (item.price * item.quantity).toLocaleString() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <button
              @click="generateBill"
              :disabled="billItems.length === 0 || saving"
              class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {{ saving ? "Generating..." : "Generate  Bill" }}
            </button>

            <div class="grid grid-cols-2 gap-3">
              <button
                @click="saveDraft"
                :disabled="billItems.length === 0"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
              >
                Save Draft
              </button>
              <button
                @click="clearBill"
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
              >
                Clear Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Recent Bills -->
      <div class="xl:col-span-1">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800">Recent Bills</h3>
            <button
              @click="fetchRecentBills"
              class="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              Refresh
            </button>
          </div>

          <div v-if="recentBills.length === 0" class="text-center py-8">
            <p class="text-gray-500">No bills yet</p>
          </div>

          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="bill in recentBills"
              :key="bill.id"
              @click="viewBillDetails(bill)"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-800">#{{ bill.id }}</p>
                  <p class="text-sm text-gray-500">
                    {{ bill.customerName || "Walk-in Customer" }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ formatDateTime(bill.date) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-800">
                    ₹{{ bill.total.toLocaleString() }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ bill.items.length }} items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// Meta
useHead({
  title: " Billing System",
  meta: [
    {
      name: "description",
      content: "Professional billing system for ",
    },
  ],
  script: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js",
      defer: true,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      defer: true,
    },
  ],
});

// Reactive data
const products = ref([]);
const billItems = ref([]);
const customerName = ref("");
const customerPhone = ref("");
const manualBarcode = ref("");
const productSearchQuery = ref("");
const searchResults = ref([]);
const recentBills = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const successMessage = ref("");
const scanning = ref(false);
const scannedProduct = ref(null);

let html5QrCode = null;

// API Configuration
const API_BASE = "http://localhost:5000/api";

// Computed properties
const currentBillId = computed(() => Date.now().toString().slice(-6));
const totalAmount = computed(() =>
  billItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const totalQuantity = computed(() =>
  billItems.value.reduce((sum, item) => sum + item.quantity, 0)
);
const todaysSales = computed(() => {
  const today = new Date().toDateString();
  return recentBills.value
    .filter((bill) => new Date(bill.date).toDateString() === today)
    .reduce((sum, bill) => sum + bill.total, 0);
});
const todaysBillsCount = computed(() => {
  const today = new Date().toDateString();
  return recentBills.value.filter(
    (bill) => new Date(bill.date).toDateString() === today
  ).length;
});

// Scanner functions
const toggleScanner = () => {
  if (!scanning.value) {
    startScanner();
  } else {
    stopScanner();
  }
};

const startScanner = () => {
  if (typeof Html5Qrcode === "undefined") {
    showError("Barcode scanner library not loaded. Please refresh the page.");
    return;
  }

  html5QrCode = new Html5Qrcode("reader");
  html5QrCode
    .start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      onScanSuccess,
      onScanFailure
    )
    .then(() => {
      scanning.value = true;
    })
    .catch((err) => {
      console.error("Unable to start scanning", err);
      showError("Unable to start camera. Please check permissions.");
    });
};

const stopScanner = () => {
  if (html5QrCode) {
    html5QrCode
      .stop()
      .then(() => {
        html5QrCode.clear();
        scanning.value = false;
      })
      .catch(console.error);
  }
};

const onScanSuccess = async (decodedText) => {
  console.log("Barcode scanned:", decodedText);

  // Find product by barcode
  const product = products.value.find(
    (p) => p.barcode === decodedText || p.barcode === decodedText.toString()
  );

  if (product) {
    scannedProduct.value = { ...product };
    // Auto-stop scanner when product is found
    if (scanning.value) {
      stopScanner();
    }
  } else {
    // Try API call for barcode
    try {
      const apiProduct = await apiService.getProductByBarcode(decodedText);
      scannedProduct.value = { ...apiProduct };
      if (scanning.value) {
        stopScanner();
      }
    } catch (err) {
      showError(`Product not found for barcode: ${decodedText}`);
    }
  }
};

const onScanFailure = () => {
  // Ignore scan failures - they're common
};

const addScannedProductToCart = () => {
  if (scannedProduct.value) {
    addProductToCart(scannedProduct.value);
    scannedProduct.value = null;
  }
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

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// API service
const apiService = {
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
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

  async getProducts() {
    return this.makeRequest("/products");
  },

  async getProductByBarcode(barcode) {
    return this.makeRequest(`/products/barcode/${barcode}`);
  },

  async createBill(billData) {
    return this.makeRequest("/bills", {
      method: "POST",
      body: JSON.stringify(billData),
    });
  },

  async getRecentBills() {
    return this.makeRequest("/bills/recent/list");
  },
};

// Mock products data for demo
const mockProducts = [
  {
    id: 1,
    name: "Cotton Shirt",
    category: "Shirting",
    price: 599,
    quantity: 25,
    barcode: "1234567890123",
  },
  {
    id: 2,
    name: "Formal Suit",
    category: "Suiting",
    price: 2999,
    quantity: 10,
    barcode: "1234567890124",
  },
  {
    id: 3,
    name: "T-Shirt",
    category: "Hosiery",
    price: 299,
    quantity: 50,
    barcode: "1234567890125",
  },
  {
    id: 4,
    name: "Polo Shirt",
    category: "Hosiery",
    price: 499,
    quantity: 30,
    barcode: "1234567890126",
  },
  {
    id: 5,
    name: "Dress Shirt",
    category: "Shirting",
    price: 799,
    quantity: 20,
    barcode: "1234567890127",
  },
];

// Product functions
const fetchProducts = async () => {
  try {
    const data = await apiService.getProducts();
    products.value = data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    // Use mock data for demo
    products.value = mockProducts;
  }
};

const searchProducts = () => {
  if (!productSearchQuery.value) {
    searchResults.value = [];
    return;
  }
  const query = productSearchQuery.value.toLowerCase();
  searchResults.value = products.value
    .filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.barcode.includes(query)
    )
    .slice(0, 5);
};

const addProductByBarcode = async () => {
  if (!manualBarcode.value) return;

  loading.value = true;
  try {
    const product = await apiService.getProductByBarcode(manualBarcode.value);
    addProductToCart(product);
    manualBarcode.value = "";
  } catch (err) {
    // Try local search
    const product = products.value.find(
      (p) =>
        p.barcode === manualBarcode.value ||
        p.name.toLowerCase().includes(manualBarcode.value.toLowerCase())
    );
    if (product) {
      addProductToCart(product);
      manualBarcode.value = "";
    } else {
      showError(
        "Product not found. Please check the input or search manually."
      );
    }
  } finally {
    loading.value = false;
  }
};

const addProductToCart = (product) => {
  if (product.quantity <= 0) {
    showError(`${product.name} is out of stock!`);
    return;
  }

  const existingItem = billItems.value.find((item) => item.id === product.id);
  if (existingItem) {
    if (existingItem.quantity < product.quantity) {
      existingItem.quantity++;
      showSuccess(`Increased quantity of ${product.name}`);
    } else {
      showError(`Only ${product.quantity} units available for ${product.name}`);
    }
  } else {
    billItems.value.push({ ...product, quantity: 1 });
    showSuccess(`Added ${product.name} to cart`);
  }

  productSearchQuery.value = "";
  searchResults.value = [];
};

const updateQuantity = (index, change) => {
  const item = billItems.value[index];
  const newQuantity = item.quantity + change;

  if (newQuantity > 0) {
    const product = products.value.find((p) => p.id === item.id);
    if (newQuantity <= product.quantity) {
      item.quantity = newQuantity;
    } else {
      showError(`Only ${product.quantity} units available`);
    }
  }
};

const removeItem = (index) => {
  const item = billItems.value[index];
  billItems.value.splice(index, 1);
  showSuccess(`Removed ${item.name} from cart`);
};

const clearBill = () => {
  billItems.value = [];
  customerName.value = "";
  customerPhone.value = "";
  manualBarcode.value = "";
  searchResults.value = [];
  showSuccess("Cleared current bill");
};
const saveDraft = async () => {
  if (billItems.value.length === 0) {
    showError("Cannot save empty bill");
    return;
  }

  const draftData = {
    customerName: customerName.value,
    customerPhone: customerPhone.value,
    items: billItems.value.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
    total: totalAmount.value,
    date: new Date().toISOString(),
  };

  try {
    await apiService.createBill(draftData);
    showSuccess("Draft saved successfully");
    clearBill();
  } catch (err) {
    showError(`Failed to save draft: ${err.message}`);
  }
};
const generateBill = async () => {
  if (billItems.value.length === 0) {
    showError("Cannot generate empty bill");
    return;
  }

  saving.value = true;
  const billData = {
    customerName: customerName.value,
    customerPhone: customerPhone.value,
    items: billItems.value.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
    total: totalAmount.value,
    date: new Date().toISOString(),
  };

  try {
    const bill = await apiService.createBill(billData);
    showSuccess(`Bill #${bill.id} generated successfully`);

    // Reset current bill
    clearBill();

    // Fetch recent bills to update list
    await fetchRecentBills();

    // Generate PDF (optional)
    // await generatePdf(bill)
  } catch (err) {
    showError(`Failed to generate bill: ${err.message}`);
  } finally {
    saving.value = false;
  }
};
const fetchRecentBills = async () => {
  try {
    recentBills.value = await apiService.getRecentBills();
  } catch (err) {
    console.error("Failed to fetch recent bills:", err);
    showError("Unable to fetch recent bills. Please try again later.");
  }
};
// View bill details
const viewBillDetails = (bill) => {
  // For now, just log the bill details
  console.log("Viewing bill details:", bill);
  // You can implement a modal or new page to show detailed bill info
};
// Lifecycle hooks
onMounted(() => {
  fetchProducts();
  fetchRecentBills();
});
onUnmounted(() => {
  if (html5QrCode) {
    stopScanner();
  }
});
</script>
