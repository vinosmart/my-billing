<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Barcode Generator</h1>

    <!-- Add Product Button -->
    <button
      @click="openForm"
      class="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      Add Product
    </button>

    <!-- Barcode Form -->
    <div v-if="showForm" class="bg-white p-4 rounded-lg shadow mb-4">
      <h2 class="text-lg font-semibold mb-3">Enter Product Details</h2>
      <div class="grid grid-cols-2 gap-4">
        <input
          v-model="newProduct.productName"
          placeholder="Product Name"
          class="border p-2 rounded"
        />
        <input
          v-model="newProduct.barcode"
          placeholder="Barcode"
          class="border p-2 rounded"
          readonly
        />
        <input
          v-model="newProduct.category"
          placeholder="Category"
          class="border p-2 rounded"
        />
        <input
          v-model.number="newProduct.quantity"
          placeholder="Quantity"
          type="number"
          class="border p-2 rounded"
        />
        <input
          v-model.number="newProduct.price"
          placeholder="Price (₹)"
          type="number"
          class="border p-2 rounded"
        />
        <select v-model="newProduct.status" class="border p-2 rounded">
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>
      <button
        @click="addProduct"
        class="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Generate Barcode
      </button>
    </div>

    <!-- Products Table with Barcodes -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full table-auto">
        <thead class="bg-gray-100">
          <tr>
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
              Barcode Image
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(product, index) in products"
            :key="index"
            class="hover:bg-gray-50 transition duration-200"
          >
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ product.productName }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ product.barcode }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ product.category }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ product.quantity }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              ₹{{ product.price }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ product.status }}
            </td>
            <td class="px-4 py-3 text-sm">
              <svg :id="'barcode-' + index"></svg>
            </td>
            <td class="px-4 py-3 text-sm">
              <button
                @click="downloadBarcode(index)"
                class="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Download
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import JsBarcode from "jsbarcode";

const products = ref([
  {
    productName: "Cotton Fabric",
    barcode: "123456789012",
    category: "Fabric",
    quantity: 100,
    price: 50,
    status: "In Stock",
  },
  {
    productName: "Silk Fabric",
    barcode: "987654321012",
    category: "Fabric",
    quantity: 50,
    price: 100,
    status: "Low Stock",
  },
]);

const showForm = ref(false);
const newProduct = ref({
  productName: "",
  barcode: "",
  category: "",
  quantity: 1,
  price: 0,
  status: "In Stock",
});

const generateUniqueBarcode = () => {
  return String(Math.floor(100000000000 + Math.random() * 900000000000));
};

const openForm = () => {
  newProduct.value = {
    productName: "",
    barcode: generateUniqueBarcode(),
    category: "",
    quantity: 1,
    price: 0,
    status: "In Stock",
  };
  showForm.value = true;
};

const addProduct = async () => {
  if (!newProduct.value.productName) return;
  products.value.push({ ...newProduct.value });
  showForm.value = false;
  await nextTick();
  generateBarcodes();
};

const generateBarcodes = () => {
  products.value.forEach((product, index) => {
    const barcodeData = `${product.barcode}|${product.productName}|${product.category}|${product.quantity}|${product.price}|${product.status}`;

    JsBarcode("#barcode-" + index, barcodeData, {
      format: "CODE128",
      width: 1,
      height: 40,
      displayValue: true,
      fontSize: 10,
      textMargin: 2,
      text: product.barcode, // Only show barcode number visually
    });
  });
};

const downloadBarcode = (index) => {
  const svg = document.getElementById(`barcode-${index}`);
  if (!svg) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `barcode-${index}.png`;
    link.click();
  };
  img.src = "data:image/svg+xml;base64," + btoa(svgString);
};

onMounted(generateBarcodes);
</script>

<style>
svg {
  width: 150px;
  height: 50px;
}
</style>
