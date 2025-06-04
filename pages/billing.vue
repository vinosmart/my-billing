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

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
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

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Left Panel - Product Search & Scanner -->
      <div class="xl:col-span-1 space-y-6">
        <!-- Barcode Scanner -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center">
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
            </h3>
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
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-10V3a1 1 0 011-1h1a1 1 0 011 1v1M8 21h8"
              />
            </svg>
            <span>{{ scanning ? "Stop Scanner" : "Start Scanner" }}</span>
          </button>

          <div id="reader" class="mt-4 rounded-lg overflow-hidden"></div>

          <!-- Manual Barcode Entry -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Manual Barcode Entry</label
            >
            <div class="flex space-x-2">
              <input
                v-model="manualBarcode"
                @keyup.enter="addProductByBarcode"
                type="text"
                placeholder="Enter barcode or product name"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                :disabled="loading"
              />
              <button
                @click="addProductByBarcode"
                class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                :disabled="loading || !manualBarcode"
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
                  class="w-4 h-4"
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
              </button>
            </div>
          </div>

          <!-- Quick Product Search -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Quick Product Search</label
            >
            <div class="relative">
              <input
                v-model="productSearchQuery"
                @input="searchProducts"
                type="text"
                placeholder="Search products..."
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
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium"
                >₹{{ totalAmount.toLocaleString() }}</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tax (0%):</span>
              <span class="font-medium">₹0</span>
            </div>
            <hr class="my-2" />
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
        <div
          class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-fit"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800">Current Bill</h3>
            <span class="text-sm text-gray-500">#{{ currentBillId }}</span>
          </div>

          <!-- Customer Information -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Customer Information</label
            >
            <div class="grid grid-cols-1 gap-3">
              <input
                v-model="customerName"
                type="text"
                placeholder="Customer Name"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                v-model="customerPhone"
                type="text"
                placeholder="Phone Number (Optional)"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                <svg
                  class="w-12 h-12 mx-auto mb-3 text-gray-300"
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
                <p>No items added yet</p>
                <p class="text-xs mt-1">
                  Scan barcode or search products to add items
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center space-x-3">
                    <button
                      @click="updateQuantity(index, -1)"
                      class="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200"
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span class="w-12 text-center font-medium text-gray-800">{{
                      item.quantity
                    }}</span>
                    <button
                      @click="updateQuantity(index, 1)"
                      class="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors duration-200"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
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
              class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
            >
              <svg
                v-if="saving"
                class="w-5 h-5 animate-spin"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H9.5a2 2 0 01-2-2v0a2 2 0 012-2H14"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 17v1a2 2 0 002 2h8a2 2 0 002-2v-1"
                />
              </svg>
              <span>{{
                saving ? "Generating..." : "Generate Bill & Print"
              }}</span>
            </button>

            <div class="grid grid-cols-2 gap-3">
              <button
                @click="saveDraft"
                :disabled="billItems.length === 0"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 text-sm"
              >
                Save Draft
              </button>
              <button
                @click="clearBill"
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
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
              class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center space-x-1"
              :disabled="loading"
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
              <span>Refresh</span>
            </button>
          </div>

          <div v-if="loading && recentBills.length === 0" class="space-y-4">
            <div v-for="i in 5" :key="i" class="animate-pulse">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="recentBills.length === 0" class="text-center py-8">
            <svg
              class="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-gray-500">No bills yet</p>
            <p class="text-xs text-gray-400 mt-1">
              Recent bills will appear here
            </p>
          </div>

          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="bill in recentBills"
              :key="bill.id"
              @click="viewBillDetails(bill)"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">#{{ bill.id }}</p>
                    <p class="text-sm text-gray-500">
                      {{ bill.customerName || "Walk-in Customer" }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ formatDateTime(bill.date) }}
                    </p>
                  </div>
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
// Reactive data
const products = ref([]);
const billItems = ref([]);
const customerName = ref("");
const customerPhone = ref("");
const scanning = ref(false);
const manualBarcode = ref("");
const productSearchQuery = ref("");
const searchResults = ref([]);
const recentBills = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const successMessage = ref("");

let html5QrCode = null;

// API Configuration
const API_BASE = "http://localhost:5000/api";

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

  async getAllBills() {
    return this.makeRequest("/bills");
  },
};

// Computed properties
const currentBillId = computed(() => Date.now().toString().slice(-6));

const totalAmount = computed(() => {
  return billItems.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

const totalQuantity = computed(() => {
  return billItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

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
      { fps: 10, qrbox: { width: 250, height: 250 } },
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

const onScanSuccess = (decodedText) => {
  manualBarcode.value = decodedText;
  addProductByBarcode();
};

const onScanFailure = () => {
  // Ignore scan failures
};

// Product functions
const fetchProducts = async () => {
  try {
    const data = await apiService.getProducts();
    products.value = data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
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
    // First try to find by barcode via API
    const product = await apiService.getProductByBarcode(manualBarcode.value);
    addProductToCart(product);
    manualBarcode.value = "";
  } catch (err) {
    // If not found by barcode, search in local products
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
        "Product not found. Please check the barcode or search manually."
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
    billItems.value.push({
      ...product,
      quantity: 1,
    });
    showSuccess(`Added ${product.name} to cart`);
  }

  // Clear search
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
  productSearchQuery.value = "";
  searchResults.value = [];
  showSuccess("Bill cleared");
};

// Bill functions
const generateBill = async () => {
  if (billItems.value.length === 0) {
    showError("Please add items to the bill");
    return;
  }

  saving.value = true;
  try {
    const billData = {
      customerName: customerName.value || "Walk-in Customer",
      customerPhone: customerPhone.value,
      items: billItems.value.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
      })),
      total: totalAmount.value,
    };

    const savedBill = await apiService.createBill(billData);

    // Generate PDF
    generateModernBillPDF(savedBill);

    // Update recent bills
    recentBills.value.unshift(savedBill);

    // Clear current bill
    clearBill();

    showSuccess("Bill generated successfully!");
  } catch (err) {
    showError(err.message);
    console.error("Failed to generate bill:", err);
  } finally {
    saving.value = false;
  }
};

const generateModernBillPDF = (bill) => {
  if (typeof window.jspdf === "undefined") {
    showError("PDF library not loaded. Please refresh the page.");
    return;
  }

  const doc = new window.jspdf.jsPDF();

  // Modern header with company branding
  doc.setFillColor(79, 70, 229); // Indigo
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("TextileBill Pro", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Professional Textile Management System", 20, 32);

  // Invoice header
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 150, 25);

  // Invoice details box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(130, 30, 60, 25);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${bill.id}`, 135, 37);
  doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, 135, 43);
  doc.text(`Time: ${new Date(bill.date).toLocaleTimeString()}`, 135, 49);

  // Customer information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 70);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(bill.customerName || "Walk-in Customer", 20, 78);
  if (bill.customerPhone) {
    doc.text(`Phone: ${bill.customerPhone}`, 20, 85);
  }

  // Items table header
  const tableTop = 100;
  doc.setFillColor(248, 250, 252);
  doc.rect(20, tableTop, 170, 10, "F");

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, tableTop, 190, tableTop);
  doc.line(20, tableTop + 10, 190, tableTop + 10);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Item", 25, tableTop + 7);
  doc.text("Qty", 110, tableTop + 7);
  doc.text("Price", 130, tableTop + 7);
  doc.text("Amount", 160, tableTop + 7);

  // Items
  let yPosition = tableTop + 20;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  bill.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(20, yPosition - 5, 170, 10, "F");
    }

    doc.text(item.name, 25, yPosition);
    doc.text(item.category, 25, yPosition + 5);
    doc.text(item.quantity.toString(), 110, yPosition);
    doc.text(`₹${item.price.toLocaleString()}`, 130, yPosition);
    doc.text(
      `₹${(item.price * item.quantity).toLocaleString()}`,
      160,
      yPosition
    );

    yPosition += 15;
  });

  // Total section
  const totalTop = yPosition + 10;
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1);
  doc.line(130, totalTop, 190, totalTop);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total Amount:", 130, totalTop + 10);
  doc.setTextColor(34, 197, 94); // Green
  doc.text(`₹${bill.total.toLocaleString()}`, 160, totalTop + 10);

  // Footer
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", 105, 270, { align: "center" });
  doc.text("This is a computer generated invoice.", 105, 275, {
    align: "center",
  });
  doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 280, {
    align: "center",
  });

  // Save PDF
  doc.save(
    `TextileBill_${bill.id}_${new Date().toISOString().split("T")[0]}.pdf`
  );
};

const saveDraft = () => {
  if (billItems.value.length === 0) {
    showError("No items to save as draft");
    return;
  }

  const draft = {
    customerName: customerName.value,
    customerPhone: customerPhone.value,
    items: [...billItems.value],
    total: totalAmount.value,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem("billDraft", JSON.stringify(draft));
  showSuccess("Draft saved successfully");
};

const fetchRecentBills = async () => {
  loading.value = true;
  try {
    const bills = await apiService.getRecentBills();
    recentBills.value = bills;
  } catch (err) {
    showError(err.message);
    console.error("Failed to fetch recent bills:", err);
  } finally {
    loading.value = false;
  }
};

const viewBillDetails = (bill) => {
  const itemsList = bill.items
    .map(
      (item) =>
        `• ${item.name} - ${item.quantity} × ₹${item.price} = ₹${(
          item.quantity * item.price
        ).toLocaleString()}`
    )
    .join("\n");

  alert(
    `Bill Details\n\nBill ID: #${bill.id}\nCustomer: ${
      bill.customerName || "Walk-in Customer"
    }\nDate: ${formatDateTime(
      bill.date
    )}\n\nItems:\n${itemsList}\n\nTotal: ₹${bill.total.toLocaleString()}`
  );
};

// Initialize
onMounted(async () => {
  await Promise.all([fetchProducts(), fetchRecentBills()]);

  // Load draft if exists
  const draft = localStorage.getItem("billDraft");
  if (draft) {
    const draftData = JSON.parse(draft);
    customerName.value = draftData.customerName || "";
    customerPhone.value = draftData.customerPhone || "";
    billItems.value = draftData.items || [];
  }
});

onUnmounted(() => {
  if (scanning.value) {
    stopScanner();
  }
});
</script>
