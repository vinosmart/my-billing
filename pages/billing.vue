<!-- Complete pages/index.vue with T-6900 scanner support, auto invoice download, WhatsApp sharing, and Manual GST -->
<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Hidden input for physical barcode scanner -->
    <input
      ref="barcodeInput"
      v-model="scannedBarcode"
      @input="handleBarcodeInput"
      @keyup.enter="processBarcodeInput"
      type="text"
      class="sr-only"
      placeholder="Barcode scanner input"
      autocomplete="off"
    />

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

    <!-- WhatsApp Share Section -->
    <div
      v-if="lastGeneratedBill"
      class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-green-800 mb-2">
            🎉 Bill Generated Successfully!
          </h3>
          <p class="text-green-700 text-sm">
            Bill #{{ lastGeneratedBill.id }} for
            {{ lastGeneratedBill.customerName || "Walk-in Customer" }} • Total:
            ₹{{ lastGeneratedBill.total.toLocaleString() }}
          </p>
        </div>
        <button
          @click="lastGeneratedBill = null"
          class="text-green-600 hover:text-green-800"
        >
          ×
        </button>
      </div>

      <div class="mt-4 flex flex-col sm:flex-row gap-3">
        <button
          v-if="lastGeneratedBill.customerPhone"
          @click="shareOnWhatsApp"
          class="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.588"
            />
          </svg>
          📎 Send PDF on WhatsApp
        </button>

        <button
          v-else
          @click="shareOnWhatsAppGeneral"
          class="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.588"
            />
          </svg>
          📎 Send PDF on WhatsApp
        </button>

        <button
          @click="downloadInvoice(lastGeneratedBill)"
          class="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
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
          Download PDF Again
        </button>
      </div>

      <div class="mt-3 text-xs text-green-600">
        💡 How it works: PDF will download automatically, then WhatsApp opens.
        Attach the downloaded PDF to your message.
      </div>
    </div>

    <!-- Barcode Scanner Status -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-blue-800 font-medium">Scanner Always Ready</span>
          <span class="text-sm text-blue-600">T-6900 Active</span>
        </div>
        <div class="text-sm text-blue-600">
          Last scan: {{ lastScanTime ? formatDateTime(lastScanTime) : "None" }}
        </div>
      </div>
      <div class="mt-2 text-xs text-blue-600">
        Ready to scan continuously - adds 1 unit per scan
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

          <!-- Physical Barcode Scanner Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-md font-semibold text-gray-800 flex items-center">
                <svg
                  class="w-5 h-5 mr-2 text-green-600"
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
                Physical Scanner (T-6900)
              </h4>
              <div class="flex items-center space-x-2">
                <div
                  class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                ></div>
                <span class="text-xs text-gray-600">Always Ready</span>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-2">
                <strong>Scanner Instructions:</strong>
              </p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li>• Scanner is always ready - no delays</li>
                <li>
                  • Each scan adds exactly <strong>1 unit</strong> to cart
                </li>
                <li>• Scan multiple times to add more units</li>
                <li>• Very rapid duplicate scans (within 300ms) are ignored</li>
              </ul>
            </div>

            <!-- Focus button for scanner -->
            <button
              @click="focusBarcodeInput"
              class="w-full mt-3 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              🎯 Activate Scanner Focus (Always Ready)
            </button>
          </div>

          <!-- Manual Entry -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Manual Entry</label
            >
            <div class="flex space-x-2">
              <input
                v-model="manualBarcode"
                @keyup.enter="addProductByBarcode"
                type="text"
                placeholder="Enter product name or barcode manually"
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
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium"
                >₹{{ totalAmount.toLocaleString() }}</span
              >
            </div>
            <div v-if="discountAmount > 0" class="border-t pt-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Discount:</span>
                <span class="font-medium text-red-600"
                  >- ₹{{ discountAmount.toLocaleString() }}</span
                >
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">After Discount:</span>
                <span class="font-medium"
                  >₹{{ discountedAmount.toLocaleString() }}</span
                >
              </div>
            </div>
            <div v-if="gstEnabled" class="border-t pt-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">GST ({{ gstPercentage }}%):</span>
                <span class="font-medium"
                  >₹{{ gstAmount.toLocaleString() }}</span
                >
              </div>
            </div>
            <div class="flex justify-between text-lg font-bold border-t pt-2">
              <span>Grand Total:</span>
              <span class="text-green-600"
                >₹{{ grandTotal.toLocaleString() }}</span
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

              <!-- Discount Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Discount Amount (₹)
                </label>
                <input
                  v-model.number="discountAmount"
                  type="number"
                  min="0"
                  :max="totalAmount"
                  step="0.01"
                  placeholder="Enter discount amount (e.g., 20)"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p v-if="discountAmount > 0" class="text-xs text-gray-500 mt-1">
                  Discount: ₹{{ discountAmount.toLocaleString() }} | After
                  Discount: ₹{{ discountedAmount.toLocaleString() }}
                </p>
              </div>

              <!-- GST Toggle -->
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <label class="text-sm font-medium text-gray-700"
                    >GST Invoice {{ gstEnabled }}</label
                  >
                  <p class="text-xs text-gray-500">Enable to add custom GST</p>
                </div>
                <button
                  @click="gstEnabled = !gstEnabled"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    gstEnabled ? 'bg-green-600' : 'bg-gray-300',
                  ]"
                >
                  <span class="sr-only">Enable GST</span>
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      gstEnabled ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>

              <!-- GST Percentage Input (shown when GST is enabled) -->
              <div v-if="gstEnabled" class="mt-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  GST Percentage (%)
                </label>
                <div class="flex space-x-2">
                  <input
                    v-model.number="gstPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter GST percentage (e.g., 18)"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    @click="gstPercentage = 18"
                    class="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    18%
                  </button>
                  <button
                    @click="gstPercentage = 12"
                    class="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    12%
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  GST Amount: ₹{{ gstAmount.toLocaleString() }}
                </p>
              </div>
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
              {{ saving ? "Generating..." : "Generate Bill & Invoice" }}
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
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
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
                  <span
                    v-if="bill.gstEnabled"
                    class="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mr-1"
                  >
                    GST {{ bill.gstPercentage || 0 }}%
                  </span>
                  <span
                    v-if="bill.discountAmount > 0"
                    class="inline-block mt-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded"
                  >
                    Discount ₹{{ bill.discountAmount }}
                  </span>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-800">
                    ₹{{ bill.total.toLocaleString() }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ bill.items.length }} items
                  </p>
                  <div class="mt-2 space-y-1">
                    <button
                      @click="downloadInvoice(bill)"
                      class="block text-xs text-blue-600 hover:text-blue-800"
                    >
                      📥 Download PDF
                    </button>
                    <button
                      v-if="bill.customerPhone"
                      @click="shareExistingBillOnWhatsApp(bill)"
                      class="block text-xs text-green-600 hover:text-green-800"
                    >
                      📱 Send on WhatsApp
                    </button>
                  </div>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

// Meta
useHead({
  title: "Billing System",
  meta: [
    {
      name: "description",
      content: "Professional billing system",
    },
  ],
});

// Company configuration (You can modify these)
const companyConfig = {
  name: "Your Company Name",
  address: "123, Main Street, City - 600001",
  phone: "+91 12345 67890",
  email: "info@yourcompany.com",
  gstin: "29ABCDE1234F1Z5", // Your GST number if applicable
  logo: "", // Base64 logo if you want to add one
};

// Reactive data for barcode scanner
const scannedBarcode = ref("");
const lastScanTime = ref("");
const barcodeInput = ref(null);
const barcodeBuffer = ref("");
const lastInputTime = ref(0);
const lastScannedBarcode = ref("");
const lastBarcodeTime = ref(0);

// Existing reactive data
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
const scannedProduct = ref(null);
const gstEnabled = ref(false); // GST toggle state
const gstPercentage = ref(0); // Manual GST percentage input
const discountAmount = ref(0); // Discount amount input
const lastGeneratedBill = ref(null); // Track last generated bill for WhatsApp sharing

// API Configuration
const API_BASE = "https://billing-software-ten.vercel.app/api";

// Computed properties
const currentBillId = computed(() => Date.now().toString().slice(-6));
const totalAmount = computed(() =>
  billItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const discountedAmount = computed(() => {
  const afterDiscount = totalAmount.value - discountAmount.value;
  return afterDiscount > 0 ? afterDiscount : 0;
});
const gstAmount = computed(() =>
  gstEnabled.value ? (discountedAmount.value * gstPercentage.value) / 100 : 0
);
const grandTotal = computed(() => discountedAmount.value + gstAmount.value);
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

// Load jsPDF dynamically
const loadJsPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve(window.jspdf);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => {
      resolve(window.jspdf);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
const generateInvoicePDF = async (billData) => {
  try {
    const { jsPDF } = await loadJsPDF();
    const doc = new jsPDF();

    // Colors
    const primaryColor = [41, 128, 185];
    const textColor = [44, 62, 80];
    const lightGray = [189, 195, 199];

    let y = 20;

    // Company Header
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, "bold");
    doc.text(companyConfig.name, 105, y, { align: "center" });

    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont(undefined, "normal");
    doc.text(companyConfig.address, 105, y, { align: "center" });

    y += 5;
    doc.text(
      `Phone: ${companyConfig.phone} | Email: ${companyConfig.email}`,
      105,
      y,
      { align: "center" }
    );

    if (companyConfig.gstin) {
      y += 5;
      doc.text(`GSTIN: ${companyConfig.gstin}`, 105, y, { align: "center" });
    }

    // Invoice Title
    y += 15;
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("INVOICE", 105, y, { align: "center" });

    // Line separator
    y += 5;
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);

    // Invoice Details
    y += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

    // Left side - Bill details
    doc.text(`Invoice No: ${billData.id}`, 20, y);
    doc.text(
      `Date: ${new Date(billData.date).toLocaleDateString("en-IN")}`,
      20,
      y + 5
    );
    doc.text(
      `Time: ${new Date(billData.date).toLocaleTimeString("en-IN")}`,
      20,
      y + 10
    );

    // Right side - Customer details
    doc.setFont(undefined, "bold");
    doc.text("Bill To:", 120, y);
    doc.setFont(undefined, "normal");
    doc.text(billData.customerName || "Walk-in Customer", 120, y + 5);
    if (billData.customerPhone) {
      doc.text(`Phone: ${billData.customerPhone}`, 120, y + 10);
    }

    // Items table header
    y += 25;
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, y, 170, 8, "F");

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("S.No", 25, y + 5.5);
    doc.text("Item Description", 45, y + 5.5);
    doc.text("Category", 110, y + 5.5);
    doc.text("Qty", 140, y + 5.5);
    doc.text("Rate", 155, y + 5.5);
    doc.text("Amount", 175, y + 5.5);

    // Items
    y += 8;
    doc.setTextColor(...textColor);
    doc.setFont(undefined, "normal");

    let subtotal = 0;
    billData.items.forEach((item, index) => {
      y += 8;

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(20, y - 5, 170, 8, "F");
      }

      doc.text((index + 1).toString(), 25, y);
      doc.text(item.name, 45, y);
      doc.text(item.category, 110, y);
      doc.text(item.quantity.toString(), 142, y, { align: "center" });
      doc.text(`₹${item.price}`, 155, y);

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      doc.text(`₹${itemTotal.toLocaleString()}`, 185, y, { align: "right" });
    });

    // Summary line
    y += 10;
    doc.setDrawColor(...lightGray);
    doc.line(20, y, 190, y);
    // Totals
    y += 8;
    doc.setFont(undefined, "bold");
    doc.text("Subtotal:", 140, y);
    doc.text(`₹${subtotal.toLocaleString()}`, 185, y, { align: "right" });

    // Show discount if applied
    if (
      typeof billData.discountAmount !== "undefined" &&
      Number(billData.discountAmount) > 0
    ) {
      y += 5;
      doc.setTextColor(220, 38, 38); // Red color for discount
      doc.text("Discount:", 140, y);
      doc.text(
        `- ₹${Number(billData.discountAmount).toLocaleString()}`,
        185,
        y,
        {
          align: "right",
        }
      );

      y += 5;
      doc.setTextColor(...textColor);
      doc.text("After Discount:", 140, y);
      const afterDiscount = subtotal - Number(billData.discountAmount);
      doc.text(`₹${afterDiscount.toLocaleString()}`, 185, y, {
        align: "right",
      });
    }

    // Show GST if enabled
    console.log("GST Enabled:", billData.gstEnabled);
    console.log("GST Percentage:", billData.gstPercentage);
    console.log("GST Amount:", billData.gstAmount);
    console.log("GST Amount Type:", typeof billData.gstAmount);
    if (
      billData.gstEnabled &&
      Number(billData.gstPercentage) > 0 &&
      typeof billData.gstAmount !== "undefined"
    ) {
      y += 5;
      doc.setTextColor(...textColor);
      doc.text(`GST (${Number(billData.gstPercentage)}%):`, 140, y);
      doc.text(`₹${Number(billData.gstAmount).toLocaleString()}`, 185, y, {
        align: "right",
      });
    }

    // Grand Total
    y += 8;
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(120, y - 5, 70, 10, "F");

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Grand Total:", 140, y + 2);
    doc.text(`₹${billData.total.toLocaleString()}`, 185, y + 2, {
      align: "right",
    });
    // Terms and conditions
    y += 20;
    doc.setTextColor(...textColor);
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.text("Terms & Conditions:", 20, y);
    doc.text(
      "1. Goods once sold will not be taken back or exchanged",
      20,
      y + 5
    );
    doc.text("2. Subject to local jurisdiction only", 20, y + 10);

    // Footer
    y = 270;
    doc.setDrawColor(...lightGray);
    doc.line(20, y, 190, y);
    doc.setFontSize(8);
    doc.text("Thank you for your business!", 105, y + 5, { align: "center" });
    doc.text(
      `Generated on ${new Date().toLocaleString("en-IN")}`,
      105,
      y + 10,
      { align: "center" }
    );

    return doc;
  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
};

// Generate invoice PDF

// Download invoice for any bill
const downloadInvoice = async (billData) => {
  try {
    const doc = await generateInvoicePDF(billData);
    const fileName = `invoice_${billData.id}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
    showSuccess(`Invoice downloaded: ${fileName}`);
  } catch (err) {
    showError(`Failed to generate invoice: ${err.message}`);
  }
};
// WhatsApp sharing functions
const shareOnWhatsApp = async () => {
  if (!lastGeneratedBill.value) return;

  const bill = lastGeneratedBill.value;
  const phoneNumber = bill.customerPhone;

  // Clean phone number (remove spaces, dashes, and ensure it starts with country code)
  let cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");

  // Add +91 for Indian numbers if not present
  if (!cleanPhone.startsWith("+")) {
    if (cleanPhone.startsWith("91")) {
      cleanPhone = "+" + cleanPhone;
    } else if (cleanPhone.length === 10) {
      cleanPhone = "+91" + cleanPhone;
    }
  }

  // Generate and download PDF first
  try {
    // await downloadInvoice(bill);

    // Build items list
    const itemsList = bill.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name} - ${item.quantity} x ₹${item.price} = ₹${(
            item.price * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    const dateObj = new Date(bill.date);
    const dateStr = dateObj.toLocaleDateString("en-IN");
    const timeStr = dateObj.toLocaleTimeString("en-IN");

    const message = `Invoice from ${companyConfig.name}

Hello ${bill.customerName || "Customer"}!  

Thank you for your purchase. Here are your bill details:

  Bill ${bill.id}
  Date: ${dateStr}
  Time: ${timeStr}

  Items Purchased:
${itemsList}
  Discount: ₹${bill.discountAmount || 0}
  GST (${bill.gstPercentage || 0}%): ₹${bill.gstAmount || 0}
  Total Amount: ₹${bill.total.toLocaleString()}

  Invoice PDF is attached

Thank you for choosing ${companyConfig.name}!  

For any queries, feel free to contact us:
  ${companyConfig.phone}
  ${companyConfig.email}
`;

    const whatsappUrl = `https://wa.me/${cleanPhone.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    showSuccess(
      "📱 PDF downloaded! WhatsApp opened - please attach the downloaded invoice."
    );
  } catch (err) {
    showError("Failed to prepare invoice for WhatsApp sharing");
  }
};

const shareOnWhatsAppGeneral = async () => {
  if (!lastGeneratedBill.value) return;

  const bill = lastGeneratedBill.value;

  // Build items list
  const itemsList = bill.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} - ${item.quantity} x ₹${item.price} = ₹${(
          item.price * item.quantity
        ).toLocaleString()}`
    )
    .join("\n");

  const dateObj = new Date(bill.date);
  const dateStr = dateObj.toLocaleDateString("en-IN");
  const timeStr = dateObj.toLocaleTimeString("en-IN");

  const message = `Invoice from ${companyConfig.name}

Hello ${bill.customerName || "Customer"}!  

Thank you for your purchase. Here are your bill details:

  Bill #${bill.id}
  Date: ${dateStr}
  Time: ${timeStr}

  Items Purchased:
${itemsList}

  Total Amount: ₹${bill.total.toLocaleString()}

Thank you for choosing ${companyConfig.name}!  

For any queries, feel free to contact us:
  ${companyConfig.phone}
  ${companyConfig.email}
`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  // Open WhatsApp
  window.open(whatsappUrl, "_blank");

  showSuccess("WhatsApp opened - select contact and send the bill details.");
};

const shareExistingBillOnWhatsApp = async (bill) => {
  const phoneNumber = bill.customerPhone;

  // Clean phone number
  let cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");

  if (!cleanPhone.startsWith("+")) {
    if (cleanPhone.startsWith("91")) {
      cleanPhone = "+" + cleanPhone;
    } else if (cleanPhone.length === 10) {
      cleanPhone = "+91" + cleanPhone;
    }
  }

  // Generate and download PDF first
  try {
    await downloadInvoice(bill);

    // Build items list
    const itemsList = bill.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name} - ${item.quantity} x ₹${item.price} = ₹${(
            item.price * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    const dateObj = new Date(bill.date);
    const dateStr = dateObj.toLocaleDateString("en-IN");
    const timeStr = dateObj.toLocaleTimeString("en-IN");

    const message = `Invoice from ${companyConfig.name}

Hello ${bill.customerName || "Customer"}!  

Thank you for your purchase. Here are your bill details:

  Bill #${bill.id}
  Date: ${dateStr}
  Time: ${timeStr}

  Items Purchased:
${itemsList}

  Total Amount: ₹${bill.total.toLocaleString()}

  Invoice PDF is attached

Thank you for choosing ${companyConfig.name}!  

For any queries, feel free to contact us:
  ${companyConfig.phone}
  ${companyConfig.email}
`;

    const whatsappUrl = `https://wa.me/${cleanPhone.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    showSuccess(
      "📱 PDF downloaded! WhatsApp opened - please attach the invoice."
    );
  } catch (err) {
    showError("Failed to prepare invoice for WhatsApp sharing");
  }
};

// Physical barcode scanner functions
const focusBarcodeInput = () => {
  nextTick(() => {
    if (barcodeInput.value) {
      barcodeInput.value.focus();
      showSuccess("Scanner focus activated. Always ready to scan!");
    }
  });
};

const handleBarcodeInput = (event) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - lastInputTime.value;

  // If time difference is small, it's likely from a barcode scanner
  if (timeDiff < 100) {
    barcodeBuffer.value += event.target.value;
  } else {
    barcodeBuffer.value = event.target.value;
  }

  lastInputTime.value = currentTime;

  // Auto-process if input looks complete (typical barcode length)
  if (barcodeBuffer.value.length >= 8) {
    // Process immediately - no cooldown
    setTimeout(() => {
      processBarcodeInput();
    }, 50);
  }
};

const processBarcodeInput = async () => {
  const barcode = scannedBarcode.value.trim() || barcodeBuffer.value.trim();

  if (!barcode) return;

  const currentTime = Date.now();

  // Very short duplicate prevention (300ms) only for exact same barcode
  if (
    barcode === lastScannedBarcode.value &&
    currentTime - lastBarcodeTime.value < 300
  ) {
    console.log("Rapid duplicate scan ignored:", barcode);
    clearScannerInput();
    return;
  }

  console.log("Processing barcode from scanner:", barcode);

  try {
    // Find product by barcode
    const product = products.value.find(
      (p) => p.barcode === barcode || p.barcode === barcode.toString()
    );

    if (product) {
      addSingleProductToCart(product);
      lastScanTime.value = new Date().toISOString();
      lastScannedBarcode.value = barcode;
      lastBarcodeTime.value = currentTime;
      showSuccess(`Added 1x ${product.name} via scanner!`);
    } else {
      // Try API call for barcode
      try {
        const apiProduct = await apiService.getProductByBarcode(barcode);
        addSingleProductToCart(apiProduct);
        lastScanTime.value = new Date().toISOString();
        lastScannedBarcode.value = barcode;
        lastBarcodeTime.value = currentTime;
        showSuccess(`Added 1x ${apiProduct.name} via scanner!`);
      } catch (err) {
        showError(`Product not found for barcode: ${barcode}`);
      }
    }
  } catch (err) {
    showError(`Scanner error: ${err.message}`);
  } finally {
    clearScannerInput();
  }
};

// New function specifically for scanner input - adds exactly 1 unit
const addSingleProductToCart = (product) => {
  if (product.quantity <= 0) {
    showError(`${product.name} is out of stock!`);
    return;
  }

  const existingItem = billItems.value.find((item) => item.id === product.id);
  if (existingItem) {
    if (existingItem.quantity < product.quantity) {
      existingItem.quantity += 1; // Add exactly 1 unit
      showSuccess(
        `Quantity increased: ${product.name} (${existingItem.quantity})`
      );
    } else {
      showError(`Only ${product.quantity} units available for ${product.name}`);
    }
  } else {
    // Add new item with exactly 1 unit
    billItems.value.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      barcode: product.barcode,
      quantity: 1, // Always start with 1 unit
    });
    showSuccess(`Added to cart: ${product.name} (1 unit)`);
  }
};

// Helper function to clear scanner input
const clearScannerInput = () => {
  scannedBarcode.value = "";
  barcodeBuffer.value = "";

  // Immediately refocus for next scan
  nextTick(() => {
    focusBarcodeInput();
  });
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
  gstEnabled.value = false; // Reset GST toggle
  gstPercentage.value = 0; // Reset GST percentage
  discountAmount.value = 0; // Reset discount amount
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
    subtotal: totalAmount.value,
    discountAmount: discountAmount.value,
    gstEnabled: gstEnabled.value,
    gstPercentage: gstPercentage.value,
    gstAmount: gstAmount.value,
    total: grandTotal.value,
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
    subtotal: totalAmount.value,
    discountAmount: discountAmount.value,
    gstEnabled: gstEnabled.value,
    gstPercentage: gstPercentage.value,
    gstAmount: gstAmount.value,
    total: grandTotal.value, // Use grandTotal instead of totalAmount
    date: new Date().toISOString(),
  };

  try {
    const bill = await apiService.createBill(billData);
    showSuccess(`Bill #${bill.id} generated successfully`);

    // Store the generated bill for WhatsApp sharing
    lastGeneratedBill.value = {
      ...bill,
      gstAmount: billData.gstAmount,
      gstPercentage: billData.gstPercentage,
      discountAmount: billData.discountAmount,
      gstEnabled: billData.gstEnabled,
    };

    // Generate and download invoice automatically
    await downloadInvoice({
      ...bill,
      gstAmount: billData.gstAmount,
      gstPercentage: billData.gstPercentage,
      discountAmount: billData.discountAmount,
      gstEnabled: billData.gstEnabled,
    });

    // Reset current bill
    clearBill();

    // Fetch recent bills to update list
    await fetchRecentBills();
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

const viewBillDetails = (bill) => {
  console.log("Viewing bill details:", bill);
};

// Global keyboard event listener for barcode scanner
const handleGlobalKeydown = (event) => {
  // Focus the hidden input when scanner starts typing
  if (
    barcodeInput.value &&
    !barcodeInput.value.contains(document.activeElement)
  ) {
    const currentTime = Date.now();
    if (currentTime - lastInputTime.value < 100) {
      focusBarcodeInput();
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchProducts();
  fetchRecentBills();

  // Auto-focus scanner input when page loads
  focusBarcodeInput();

  // Add global keyboard listener
  document.addEventListener("keydown", handleGlobalKeydown);

  // Keep scanner always focused and ready
  // Check every 2 seconds instead of 5
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleGlobalKeydown);
});
</script>
