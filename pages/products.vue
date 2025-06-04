<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800">Product List</h2>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
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
        <span>{{ loading ? "Loading..." : "Add Product" }}</span>
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

    <!-- Search Bar -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products by name, category, or barcode..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          v-model="categoryFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          <option value="Shirts">Shirts</option>
          <option value="Pants">Pants</option>
          <option value="Sarees">Sarees</option>
          <option value="Dress Materials">Dress Materials</option>
          <option value="Accessories">Accessories</option>
        </select>
        <button
          @click="fetchProducts"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          :disabled="loading"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div
        v-if="loading && products.length === 0"
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
          <p class="text-gray-500">Loading products...</p>
        </div>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Product Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Barcode
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Quantity
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Price (₹)
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Barcode Image
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="filteredProducts.length === 0" class="hover:bg-gray-50">
            <td colspan="8" class="px-6 py-4 text-center text-gray-500">
              No products found.
              {{
                searchQuery || categoryFilter
                  ? "Try adjusting your filters."
                  : "Add your first product!"
              }}
            </td>
          </tr>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
              {{ product.name }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono"
            >
              {{ product.barcode }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
              >
                {{ product.category }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ product.quantity }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-semibold">
              ₹{{ parseFloat(product.price).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusClass(product.quantity)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ getStatus(product.quantity) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div
                class="relative group inline-block"
                @mouseenter="hoveredBarcodeId = product.id"
                @mouseleave="hoveredBarcodeId = null"
              >
                <canvas
                  :id="`barcode-${product.id}`"
                  class="h-12 cursor-pointer"
                ></canvas>
                <!-- Download Button Overlay -->
                <div
                  v-show="hoveredBarcodeId === product.id"
                  class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded transition-opacity duration-200"
                >
                  <button
                    @click="downloadBarcode(product)"
                    class="bg-white text-gray-800 px-3 py-1 rounded-md shadow-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-1 text-sm"
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
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click="editProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                  :disabled="loading"
                >
                  Edit
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-900 transition-colors duration-200"
                  :disabled="loading"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Product Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        @click.stop
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      >
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingProduct ? "Edit" : "Add" }} Product
        </h3>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Product Name</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
              :disabled="saving"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Category</label
            >
            <select
              v-model="form.category"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
              :disabled="saving"
            >
              <option value="">Select Category</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Sarees">Sarees</option>
              <option value="Dress Materials">Dress Materials</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Quantity</label
            >
            <input
              v-model.number="form.quantity"
              type="number"
              min="0"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
              :disabled="saving"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Price (₹)</label
            >
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
              :disabled="saving"
            />
          </div>

          <div v-if="!editingProduct">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Barcode (Optional)</label
            >
            <input
              v-model="form.barcode"
              type="text"
              placeholder="Auto-generated if empty"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
              :disabled="saving"
            />
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
              :disabled="saving"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
              :disabled="saving"
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
              <span>{{ saving ? "Saving..." : "Save" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from "vue";

// Reactive state
const products = ref([]);
const showAddModal = ref(false);
const editingProduct = ref(null);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const successMessage = ref("");
const searchQuery = ref("");
const categoryFilter = ref("");
const hoveredBarcodeId = ref(null);

const form = ref({
  name: "",
  category: "",
  quantity: 0,
  price: 0,
  barcode: "",
});

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

  // Products API
  async getProducts() {
    return this.makeRequest("/products");
  },

  async createProduct(productData) {
    return this.makeRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id, productData) {
    return this.makeRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  async deleteProduct(id) {
    return this.makeRequest(`/products/${id}`, {
      method: "DELETE",
    });
  },

  async getProductByBarcode(barcode) {
    return this.makeRequest(`/products/barcode/${barcode}`);
  },
};

// Computed properties
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch =
      !searchQuery.value ||
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      product.barcode.includes(searchQuery.value);

    const matchesCategory =
      !categoryFilter.value || product.category === categoryFilter.value;

    return matchesSearch && matchesCategory;
  });
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

const generateBarcodeImage = async (product) => {
  await nextTick();
  try {
    if (typeof JsBarcode !== "undefined" && product.barcode) {
      JsBarcode(`#barcode-${product.id}`, product.barcode, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: false,
      });
    }
  } catch (err) {
    console.warn("Barcode generation failed:", err);
  }
};

// Barcode download function
const downloadBarcode = (product) => {
  try {
    const canvas = document.getElementById(`barcode-${product.id}`);
    if (!canvas) {
      showError("Barcode not found");
      return;
    }

    // Create a download link
    const link = document.createElement("a");
    link.download = `barcode-${product.name}-${product.barcode}.png`;
    link.href = canvas.toDataURL("image/png");

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess(`Barcode for ${product.name} downloaded successfully!`);
  } catch (err) {
    showError("Failed to download barcode");
    console.error("Download error:", err);
  }
};

// Main functions
const fetchProducts = async () => {
  loading.value = true;
  error.value = "";

  try {
    const data = await apiService.getProducts();
    products.value = data;

    // Generate barcode images after data is loaded
    await nextTick();
    products.value.forEach((product) => generateBarcodeImage(product));
  } catch (err) {
    showError(err.message);
    console.error("Failed to fetch products:", err);
  } finally {
    loading.value = false;
  }
};

const saveProduct = async () => {
  saving.value = true;
  error.value = "";

  try {
    let savedProduct;

    // Clean the form data - remove empty barcode
    const productData = { ...form.value };
    if (!productData.barcode || productData.barcode.trim() === "") {
      delete productData.barcode; // Remove empty barcode so backend generates one
    }

    if (editingProduct.value) {
      savedProduct = await apiService.updateProduct(
        editingProduct.value.id,
        productData
      );

      const index = products.value.findIndex(
        (p) => p.id === editingProduct.value.id
      );
      if (index !== -1) {
        products.value[index] = savedProduct;
      }

      showSuccess("Product updated successfully!");
    } else {
      savedProduct = await apiService.createProduct(productData);
      products.value.push(savedProduct);
      showSuccess("Product created successfully!");
    }

    await nextTick();
    generateBarcodeImage(savedProduct);
    closeModal();
  } catch (err) {
    showError(err.message);
    console.error("Failed to save product:", err);
  } finally {
    saving.value = false;
  }
};

const editProduct = (product) => {
  editingProduct.value = product;
  form.value = {
    name: product.name,
    category: product.category,
    quantity: parseInt(product.quantity),
    price: parseFloat(product.price),
    barcode: product.barcode,
  };
  showAddModal.value = true;
};

const deleteProduct = async (id) => {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await apiService.deleteProduct(id);
    products.value = products.value.filter((p) => p.id !== id);
    showSuccess("Product deleted successfully!");
  } catch (err) {
    showError(err.message);
    console.error("Failed to delete product:", err);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingProduct.value = null;
  form.value = {
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    barcode: "",
  };
};

const getStatus = (quantity) => {
  const qty = parseInt(quantity);
  if (qty === 0) return "Out of Stock";
  if (qty < 10) return "Low Stock";
  return "In Stock";
};

const getStatusClass = (quantity) => {
  const qty = parseInt(quantity);
  if (qty === 0) return "bg-red-100 text-red-800";
  if (qty < 10) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

// Watch for products changes to regenerate barcodes
watch(
  products,
  async () => {
    await nextTick();
    products.value.forEach((product) => generateBarcodeImage(product));
  },
  { deep: true }
);

// Initialize data
onMounted(() => {
  fetchProducts();
});

// Auto-refresh every 30 seconds
let refreshInterval;
onMounted(() => {
  refreshInterval = setInterval(fetchProducts, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
