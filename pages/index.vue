<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
      <div class="flex space-x-3">
        <select
          v-model="selectedPeriod"
          @change="fetchSalesReport"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button
          @click="refreshDashboard"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
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
          <span>{{ loading ? "Refreshing..." : "Refresh" }}</span>
        </button>
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

    <!-- Loading State for KPI Cards -->
    <div
      v-if="loading && !dashboardData"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow p-6">
        <div class="animate-pulse">
          <div class="flex items-center justify-between">
            <div>
              <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div class="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Sales</p>
            <p class="text-2xl font-bold text-gray-800">
              ₹{{ totalSales.toLocaleString() }}
            </p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Products</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalProducts }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Low Stock Items</p>
            <p class="text-2xl font-bold text-gray-800">{{ lowStockItems }}</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-full">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Today's Bills</p>
            <p class="text-2xl font-bold text-gray-800">{{ todaysBills }}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Sales Trend Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Sales Trend (Last 7 Days)
        </h3>
        <div
          v-if="chartsLoading"
          class="flex justify-center items-center"
          style="height: 300px"
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
            <p class="text-gray-500 text-sm">Loading chart...</p>
          </div>
        </div>
        <div v-else class="relative" style="height: 300px">
          <canvas ref="salesTrendChart"></canvas>
        </div>
      </div>

      <!-- Top Products Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Top Selling Products
        </h3>
        <div
          v-if="chartsLoading"
          class="flex justify-center items-center"
          style="height: 300px"
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
            <p class="text-gray-500 text-sm">Loading chart...</p>
          </div>
        </div>
        <div v-else class="relative" style="height: 300px">
          <canvas ref="topProductsChart"></canvas>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Monthly Sales Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Monthly Sales Comparison
        </h3>
        <div
          v-if="chartsLoading"
          class="flex justify-center items-center"
          style="height: 300px"
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
            <p class="text-gray-500 text-sm">Loading chart...</p>
          </div>
        </div>
        <div v-else class="relative" style="height: 300px">
          <canvas ref="monthlySalesChart"></canvas>
        </div>
      </div>

      <!-- Stock Status Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Stock Status Overview
        </h3>
        <div
          v-if="chartsLoading"
          class="flex justify-center items-center"
          style="height: 300px"
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
            <p class="text-gray-500 text-sm">Loading chart...</p>
          </div>
        </div>
        <div v-else class="relative" style="height: 300px">
          <canvas ref="stockStatusChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Sales Report Table -->
    <div
      v-if="salesReport.length > 0"
      class="mt-8 bg-white rounded-lg shadow overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1) }}
          Sales Report
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Period
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sales
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Orders
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="report in salesReport.slice(0, 10)"
              :key="report.period"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ report.period }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{{ report.total.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ report.count }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from "vue";
import * as Chart from "chart.js";

// Register Chart.js components
Chart.Chart.register(...Chart.registerables);

// Reactive data
const dashboardData = ref(null);
const salesReport = ref([]);
const loading = ref(false);
const chartsLoading = ref(false);
const error = ref("");
const selectedPeriod = ref("daily");

// Chart refs
const salesTrendChart = ref(null);
const topProductsChart = ref(null);
const monthlySalesChart = ref(null);
const stockStatusChart = ref(null);

// Chart instances
let salesTrendChartInstance = null;
let topProductsChartInstance = null;
let monthlySalesChartInstance = null;
let stockStatusChartInstance = null;

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

  async getDashboard() {
    return this.makeRequest("/analytics/dashboard");
  },

  async getSalesReport(period) {
    return this.makeRequest(`/analytics/sales/${period}`);
  },
};

// Computed properties
const totalSales = computed(() => dashboardData.value?.kpis?.totalSales || 0);
const totalProducts = computed(
  () => dashboardData.value?.kpis?.totalProducts || 0
);
const lowStockItems = computed(
  () => dashboardData.value?.kpis?.lowStockItems || 0
);
const todaysBills = computed(() => dashboardData.value?.kpis?.todaysBills || 0);

// Helper functions
const showError = (message) => {
  error.value = message;
  setTimeout(() => (error.value = ""), 5000);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getMonthName = (monthIndex) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthIndex];
};

// Chart creation functions
const createSalesTrendChart = (salesTrend) => {
  console.log("Creating sales trend chart with data:", salesTrend);

  if (!salesTrend || salesTrend.length === 0) {
    console.warn("No sales trend data available");
    return;
  }

  // Check if canvas element exists
  if (!salesTrendChart.value) {
    console.error("Sales trend chart canvas ref not found");
    return;
  }

  const ctx = salesTrendChart.value.getContext("2d");
  if (!ctx) {
    console.error("Could not get 2D context from canvas");
    return;
  }

  // Destroy existing chart
  if (salesTrendChartInstance) {
    salesTrendChartInstance.destroy();
  }

  try {
    salesTrendChartInstance = new Chart.Chart(ctx, {
      type: "line",
      data: {
        labels: salesTrend.map((item) => formatDate(item.date)),
        datasets: [
          {
            label: "Sales (₹)",
            data: salesTrend.map((item) => item.sales),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "₹" + value.toLocaleString();
              },
            },
          },
        },
        layout: { padding: 10 },
      },
    });
    console.log("Sales trend chart created successfully");
  } catch (error) {
    console.error("Error creating sales trend chart:", error);
  }
};

const createTopProductsChart = (topProducts) => {
  if (!topProducts || topProducts.length === 0) return;

  const ctx = topProductsChart.value?.getContext("2d");
  if (ctx) {
    if (topProductsChartInstance) topProductsChartInstance.destroy();

    topProductsChartInstance = new Chart.Chart(ctx, {
      type: "bar",
      data: {
        labels: topProducts.map((item) => item.name),
        datasets: [
          {
            label: "Quantity Sold",
            data: topProducts.map((item) => item.quantity),
            backgroundColor: [
              "rgba(34, 197, 94, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(168, 85, 247, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
            borderColor: [
              "rgba(34, 197, 94, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(168, 85, 247, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(239, 68, 68, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
        layout: { padding: 10 },
      },
    });
  }
};

const createMonthlySalesChart = (monthlySales) => {
  if (!monthlySales || monthlySales.length === 0) return;

  const ctx = monthlySalesChart.value?.getContext("2d");
  if (ctx) {
    if (monthlySalesChartInstance) monthlySalesChartInstance.destroy();

    monthlySalesChartInstance = new Chart.Chart(ctx, {
      type: "bar",
      data: {
        labels: monthlySales.map((item) => getMonthName(item.month)),
        datasets: [
          {
            label: "Monthly Sales (₹)",
            data: monthlySales.map((item) => item.sales),
            backgroundColor: "rgba(168, 85, 247, 0.8)",
            borderColor: "rgba(168, 85, 247, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "₹" + value.toLocaleString();
              },
            },
          },
        },
      },
    });
  }
};

const createStockStatusChart = (stockStatus) => {
  if (!stockStatus) return;

  const ctx = stockStatusChart.value?.getContext("2d");
  if (ctx) {
    if (stockStatusChartInstance) stockStatusChartInstance.destroy();

    stockStatusChartInstance = new Chart.Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Out of Stock", "Low Stock", "Medium Stock", "High Stock"],
        datasets: [
          {
            data: [
              stockStatus.outOfStock,
              stockStatus.lowStock,
              stockStatus.mediumStock,
              stockStatus.highStock,
            ],
            backgroundColor: [
              "rgba(239, 68, 68, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(34, 197, 94, 0.8)",
            ],
            borderColor: [
              "rgba(239, 68, 68, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(34, 197, 94, 1)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 20, usePointStyle: true },
          },
        },
        layout: { padding: 10 },
      },
    });
  }
};

// Main functions
const fetchDashboardData = async () => {
  loading.value = true;
  chartsLoading.value = true;
  error.value = "";

  try {
    const data = await apiService.getDashboard();

    // Add these debug logs
    console.log("Dashboard data received:", data);
    console.log("Charts data:", data.charts);

    dashboardData.value = data;

    // Wait for next tick to ensure canvas elements are rendered
    await nextTick();

    // Add timeout to ensure DOM is ready
    setTimeout(() => {
      if (data.charts) {
        createSalesTrendChart(data.charts.salesTrend);
        createTopProductsChart(data.charts.topProducts);
        createMonthlySalesChart(data.charts.monthlySales);
        createStockStatusChart(data.charts.stockStatus);
      }
    }, 100);
  } catch (err) {
    showError(err.message);
    console.error("Failed to fetch dashboard data:", err);
  } finally {
    loading.value = false;
    chartsLoading.value = false;
  }
};

const fetchSalesReport = async () => {
  try {
    const data = await apiService.getSalesReport(selectedPeriod.value);
    salesReport.value = data;
  } catch (err) {
    showError(
      `Failed to fetch ${selectedPeriod.value} sales report: ${err.message}`
    );
    console.error("Failed to fetch sales report:", err);
  }
};

const refreshDashboard = async () => {
  await Promise.all([fetchDashboardData(), fetchSalesReport()]);
};

// Initialize data
onMounted(async () => {
  await refreshDashboard();
});

// Auto-refresh every 60 seconds
let refreshInterval;
onMounted(() => {
  refreshInterval = setInterval(refreshDashboard, 60000);
});

// Cleanup
onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
  if (salesTrendChartInstance) salesTrendChartInstance.destroy();
  if (topProductsChartInstance) topProductsChartInstance.destroy();
  if (monthlySalesChartInstance) monthlySalesChartInstance.destroy();
  if (stockStatusChartInstance) stockStatusChartInstance.destroy();
});
</script>
