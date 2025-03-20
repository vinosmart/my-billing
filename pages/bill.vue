<template>
  <div class="max-w-2xl mx-auto">
    <!-- Scanner Section -->
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

    <!-- Bill Section -->
    <div
      ref="billSection"
      class="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto"
    >
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Textile Shop</h1>
        <p class="text-sm text-gray-600">123 Fabric Street, Textile City</p>
        <p class="text-sm text-gray-600">
          Phone: +91 9876543210 | Email: info@textileshop.com
        </p>
      </div>

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
            <td class="px-4 py-2 text-sm text-gray-700">
              <input
                type="number"
                v-model.number="item.quantity"
                min="1"
                class="w-16 p-1 border rounded"
              />
            </td>
            <td class="px-4 py-2 text-sm text-gray-700">
              <input
                type="number"
                v-model.number="item.price"
                min="0"
                class="w-20 p-1 border rounded"
              />
            </td>
            <td class="px-4 py-2 text-sm text-gray-700">
              {{ (item.quantity * item.price).toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>

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

      <div class="flex justify-center gap-4">
        <button
          @click="printBill"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Print
        </button>
        <button
          @click="downloadPDF"
          class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Quagga from "quagga";

const items = ref([]);
const billNumber = ref("00123");
const currentDate = ref(new Date().toLocaleDateString());
const customerName = ref("John Doe");
const customerPhone = ref("+91 9876543210");
const fileInput = ref(null);
const billSection = ref(null);
let scannerActive = false;

const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.quantity * item.price, 0)
);
const tax = computed(() => subtotal.value * 0.05);
const total = computed(() => subtotal.value + tax.value);

const startScanner = () => {
  if (scannerActive) return;
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: "#barcode-scanner",
        constraints: { facingMode: "environment" },
      },
      decoder: { readers: ["code_128_reader"] },
    },
    (err) => {
      if (!err) {
        scannerActive = true;
        Quagga.start();
      }
    }
  );
  Quagga.onDetected((result) => handleBarcodeDetection(result.codeResult.code));
};

const stopScanner = () => {
  if (scannerActive) {
    Quagga.stop();
    scannerActive = false;
  }
};

const handleBarcodeDetection = (barcode) => {
  const productInfo = { name: `Unknown (${barcode})`, price: 100 };
  const existingItem = items.value.find((item) => item.barcode === barcode);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    items.value.push({ ...productInfo, barcode, quantity: 1 });
  }
  stopScanner();
};

const handleBarcodeImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const image = new Image();
    image.src = e.target.result;
    image.onload = () => {
      Quagga.decodeSingle(
        {
          src: image.src,
          numOfWorkers: 0, // Disable worker threads for single image decoding
          decoder: { readers: ["code_128_reader"] },
        },
        (result) => {
          if (result && result.codeResult) {
            const barcode = result.codeResult.code;
            handleBarcodeDetection(barcode);
          } else {
            alert("❌ No barcode detected. Try another image.");
          }
        }
      );
    };
  };
  reader.readAsDataURL(file);
};

const triggerFileUpload = () => {
  fileInput.value.click();
};

const printBill = () => {
  const printContents = billSection.value.innerHTML;
  const originalContents = document.body.innerHTML;

  // Replace the body content with the bill section
  document.body.innerHTML = printContents;

  // Trigger the print dialog
  window.print();

  // Restore the original content
  document.body.innerHTML = originalContents;

  // Reinitialize any necessary scripts or event listeners
  window.location.reload();
};
const downloadPDF = async () => {
  if (!billSection.value) {
    console.error("Error: Bill section not found.");
    alert("Bill content is not ready. Please try again.");
    return;
  }

  try {
    const html2pdf = (await import("html2pdf.js")).default;

    // Create a temporary style override to remove `oklch()` usage
    const styleOverride = document.createElement("style");
    styleOverride.textContent = `
      * {
        color: black !important;
        background-color: white !important;
      }
    `;
    document.head.appendChild(styleOverride);

    // Clone the bill section
    const clonedElement = billSection.value.cloneNode(true);

    // PDF options
    const options = {
      margin: [10, 10, 10, 10],
      filename: `Bill_${billNumber.value}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate and save PDF
    await html2pdf().set(options).from(clonedElement).save();

    // Remove temporary styles after PDF is saved
    document.head.removeChild(styleOverride);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Error generating PDF. Please try again.");
  }
};

onMounted(() => () => stopScanner());
</script>

<style scoped>
#barcode-scanner {
  width: 100%;
  height: 300px;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
}

@media print {
  body * {
    visibility: hidden;
  }
  #billSection,
  #billSection * {
    visibility: visible;
  }
  #billSection {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
