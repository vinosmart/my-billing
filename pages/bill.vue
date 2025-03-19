<template>
  <div class="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
    <!-- Shop Header -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Textile Shop</h1>
      <p class="text-sm text-gray-600">123 Fabric Street, Textile City</p>
      <p class="text-sm text-gray-600">
        Phone: +91 9876543210 | Email: info@textileshop.com
      </p>
    </div>

    <!-- Barcode Scanner Section -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-4 text-gray-800">Scan Barcode</h2>
      <div class="flex gap-4">
        <button
          @click="startScanner"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Start Scanner
        </button>
        <button
          @click="stopScanner"
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Stop Scanner
        </button>
        <input
          type="file"
          accept="image/*"
          @change="handleBarcodeImageUpload"
          class="hidden"
          ref="fileInput"
        />
        <button
          @click="triggerFileUpload"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Upload Barcode Image
        </button>
      </div>
      <div id="barcode-scanner" class="mt-4"></div>
    </div>

    <!-- Bill Details -->
    <div class="flex justify-between mb-6">
      <div>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Bill No:</span> {{ billNumber }}
        </p>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Date:</span> {{ currentDate }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Customer Name:</span> {{ customerName }}
        </p>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Phone:</span> {{ customerPhone }}
        </p>
      </div>
    </div>

    <!-- Product Table -->
    <table class="w-full table-auto mb-6">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            #
          </th>
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            Product Name
          </th>
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            Quantity
          </th>
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            Price (₹)
          </th>
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            Total (₹)
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="(item, index) in items" :key="item.barcode">
          <td class="px-4 py-2 text-sm text-gray-700">{{ index + 1 }}</td>
          <td class="px-4 py-2 text-sm text-gray-700">{{ item.name }}</td>
          <td class="px-4 py-2 text-sm text-gray-700">{{ item.quantity }}</td>
          <td class="px-4 py-2 text-sm text-gray-700">
            {{ item.price.toFixed(2) }}
          </td>
          <td class="px-4 py-2 text-sm text-gray-700">
            {{ (item.quantity * item.price).toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Total Amount -->
    <div class="flex justify-end mb-6">
      <div class="w-1/3">
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Subtotal:</span> ₹{{
            subtotal.toFixed(2)
          }}
        </p>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Tax (5%):</span> ₹{{ tax.toFixed(2) }}
        </p>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Total:</span> ₹{{ total.toFixed(2) }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center border-t pt-4">
      <p class="text-sm text-gray-600">Thank you for shopping with us!</p>
      <p class="text-sm text-gray-600">Terms & Conditions apply.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Quagga from "quagga";

// Reactive data
const items = ref([]);
const billNumber = ref("00123");
const currentDate = ref(new Date().toLocaleDateString());
const customerName = ref("John Doe");
const customerPhone = ref("+91 9876543210");
const fileInput = ref(null);
let scannerActive = false;

// Computed properties
const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.quantity * item.price, 0)
);

const tax = computed(() => subtotal.value * 0.05);
const total = computed(() => subtotal.value + tax.value);

// Product database
const productDatabase = {
  "1111111111111111111": {
    name: "Premium Cotton Fabric",
    price: 75.0,
  },
  "2222222222222222222": {
    name: "Silk Chiffon Material",
    price: 150.0,
  },
  "3333333333333333333": {
    name: "Woolen Coating",
    price: 200.0,
  },
};

// Scanner functions
const startScanner = () => {
  if (scannerActive) return;

  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#barcode-scanner"),
        constraints: { facingMode: "environment" },
      },
      decoder: { readers: ["code_128_reader"] },
      locator: { halfSample: true, patchSize: "medium" },
    },
    (err) => {
      if (err) {
        console.error("Scanner initialization failed:", err);
        return;
      }
      scannerActive = true;
      Quagga.start();
    }
  );

  Quagga.onDetected((result) => {
    const barcode = result.codeResult.code;
    handleBarcodeDetection(barcode);
  });
};

const stopScanner = () => {
  if (scannerActive) {
    Quagga.stop();
    scannerActive = false;
  }
};

const triggerFileUpload = () => fileInput.value.click();

const handleBarcodeImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => decodeBarcodeFromImage(e.target.result);
    reader.readAsDataURL(file);
  }
};

const decodeBarcodeFromImage = (imageData) => {
  Quagga.decodeSingle(
    {
      decoder: { readers: ["code_128_reader"] },
      locator: { halfSample: true, patchSize: "medium" },
      locate: true,
      src: imageData,
    },
    (result) => {
      if (result?.codeResult) {
        handleBarcodeDetection(result.codeResult.code);
      } else {
        alert("Could not decode barcode from image");
      }
    }
  );
};

const handleBarcodeDetection = (barcode) => {
  const productInfo = productDatabase[barcode] || {
    name: `Unknown Product (${barcode})`,
    price: 100.0,
  };

  const existingItem = items.value.find((item) => item.barcode === barcode);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    items.value.push({
      ...productInfo,
      barcode: barcode,
      quantity: 1,
    });
  }

  stopScanner();
};

// Cleanup
onMounted(() => () => stopScanner());
</script>

<style scoped>
#barcode-scanner {
  width: 100%;
  height: 300px;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
