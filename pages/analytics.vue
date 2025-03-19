<template>
  <div class="p-6 max-w-[550px]">
    <h1 class="text-2xl font-bold mb-4">Stock Analytics</h1>
    <canvas ref="stockChart"></canvas>
  </div>
  <div class="bg-white rounded-lg shadow p-6 mb-8 max-w-[550px]">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Sales Chart</h2>
    <canvas ref="salesChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import { useStockStore } from "@/stores/stockStore";

// Define salesData for the sales chart
const salesData = ref([
  {
    productName: "Cotton Fabric",
    quantity: 10,
    totalPrice: 500,
    date: "2025-03-19",
  },
  {
    productName: "Silk Fabric",
    quantity: 5,
    totalPrice: 800,
    date: "2025-03-18",
  },
  {
    productName: "Silk Fabric",
    quantity: 5,
    totalPrice: 800,
    date: "2025-03-18",
  },
  {
    productName: "Silk Fabric",
    quantity: 5,
    totalPrice: 800,
    date: "2025-03-18",
  },
]);

const stockStore = useStockStore();
const stockChart = ref(null);
const salesChart = ref(null);
let stockChartInstance = null;

// Render stock chart
const renderStockChart = () => {
  if (stockChartInstance) stockChartInstance.destroy();

  stockChartInstance = new Chart(stockChart.value, {
    type: "bar",
    data: {
      labels: ["In Stock", "Low Stock", "Out of Stock"],
      datasets: [
        {
          data: [
            stockStore.stockSummary.inStock,
            stockStore.stockSummary.lowStock,
            stockStore.stockSummary.outOfStock,
          ],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
        },
      ],
    },
  });
};

// Render sales chart
const renderSalesChart = () => {
  const ctx = salesChart.value.getContext("2d");
  new Chart(ctx, {
    type: "bar", // You can change this to "line" for a line chart
    data: {
      labels: salesData.value.map((sale) => sale.productName),
      datasets: [
        {
          label: "Total Sales (₹)",
          data: salesData.value.map((sale) => sale.totalPrice),
          backgroundColor: "rgba(79, 70, 229, 0.6)", // Indigo color
          borderColor: "rgba(79, 70, 229, 1)",
          borderWidth: 1,
        },
        {
          label: "Quantity Sold",
          data: salesData.value.map((sale) => sale.quantity),
          backgroundColor: "rgba(99, 102, 241, 0.6)", // Purple color
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(() => {
  renderStockChart();
  renderSalesChart();
});

// Watch for changes in stock and update chart
watch(
  () => stockStore.stockSummary,
  () => {
    renderStockChart();
  },
  { deep: true }
);
</script>
