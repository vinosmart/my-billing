<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Back Button -->
    <button
      @click="$router.back()"
      class="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </button>

    <!-- Customer Header -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center"
          >
            <span class="text-2xl font-bold text-indigo-600">
              {{ customer.name?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              {{ customer.name }}
            </h1>
            <p class="text-gray-600">Customer ID: #{{ customer.id }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <button
            @click="editCustomer"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Edit Customer
          </button>
          <button
            @click="deleteCustomer"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Customer Information Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Contact Information -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Contact Information
        </h3>
        <div class="space-y-3">
          <div>
            <p class="text-sm text-gray-600">Phone</p>
            <p class="font-medium text-gray-800">
              {{ customer.phone || "Not provided" }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium text-gray-800">
              {{ customer.email || "Not provided" }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Customer Since</p>
            <p class="font-medium text-gray-800">
              {{ formatDate(customer.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Billing Address -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Billing Address
        </h3>
        <div class="space-y-2">
          <p class="text-gray-800">
            {{ customer.address || "No address provided" }}
          </p>
          <p class="text-gray-800">
            {{ customer.city }}, {{ customer.state }} {{ customer.pincode }}
          </p>
          <p class="text-gray-800">{{ customer.country || "India" }}</p>
        </div>
      </div>

      <!-- Purchase Summary -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Purchase Summary
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Total Orders</span>
            <span class="font-semibold text-gray-800">{{
              purchaseSummary.totalOrders
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Spent</span>
            <span class="font-semibold text-gray-800"
              >₹{{ purchaseSummary.totalSpent.toLocaleString() }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Average Order</span>
            <span class="font-semibold text-gray-800"
              >₹{{ purchaseSummary.averageOrder.toLocaleString() }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Last Order</span>
            <span class="font-semibold text-gray-800">{{
              formatDate(purchaseSummary.lastOrder)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl shadow-lg">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.name
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Purchase History Tab -->
        <div v-if="activeTab === 'history'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bill ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in customerOrders"
                :key="order.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.items.length }} items
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  ₹{{ order.total.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    Completed
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewInvoice(order)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Notes Tab -->
        <div v-if="activeTab === 'notes'" class="space-y-4">
          <div class="mb-4">
            <textarea
              v-model="newNote"
              placeholder="Add a note about this customer..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            ></textarea>
            <button
              @click="addNote"
              class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Note
            </button>
          </div>

          <div
            v-for="note in customerNotes"
            :key="note.id"
            class="bg-gray-50 rounded-lg p-4"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="text-gray-800">{{ note.content }}</p>
                <p class="text-xs text-gray-500 mt-2">
                  {{ formatDateTime(note.createdAt) }}
                </p>
              </div>
              <button
                @click="deleteNote(note.id)"
                class="text-red-600 hover:text-red-800 ml-4"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Data
const customer = ref({});
const customerOrders = ref([]);
const customerNotes = ref([]);
const activeTab = ref("history");
const newNote = ref("");

const tabs = [
  { name: "history", label: "Purchase History" },
  { name: "notes", label: "Notes" },
];

// Computed
const purchaseSummary = computed(() => {
  const totalOrders = customerOrders.value.length;
  const totalSpent = customerOrders.value.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const lastOrder =
    customerOrders.value.length > 0 ? customerOrders.value[0].date : null;

  return {
    totalOrders,
    totalSpent,
    averageOrder,
    lastOrder,
  };
});

// Helper functions
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Methods
const fetchCustomerData = async () => {
  const customerId = route.params.id;

  // Dummy data for demo
  customer.value = {
    id: customerId,
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh.kumar@example.com",
    address: "123, Gandhi Street",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    country: "India",
    createdAt: new Date("2023-01-15"),
  };

  customerOrders.value = [
    {
      id: "2024001",
      date: new Date("2024-01-10"),
      items: [{ name: "Cotton Saree", quantity: 2 }],
      total: 3500,
    },
    {
      id: "2024002",
      date: new Date("2024-01-05"),
      items: [{ name: "Silk Saree", quantity: 1 }],
      total: 5500,
    },
    {
      id: "2023015",
      date: new Date("2023-12-20"),
      items: [{ name: "Designer Blouse", quantity: 3 }],
      total: 2400,
    },
  ];

  customerNotes.value = [
    {
      id: 1,
      content: "Prefers traditional designs",
      createdAt: new Date("2024-01-10"),
    },
    {
      id: 2,
      content: "Regular customer, give 5% discount",
      createdAt: new Date("2023-12-15"),
    },
  ];
};

const editCustomer = () => {
  router.push(`/customers/${customer.value.id}/edit`);
};

const deleteCustomer = () => {
  if (confirm("Are you sure you want to delete this customer?")) {
    // API call to delete customer
    router.push("/customers");
  }
};

const viewInvoice = (order) => {
  router.push(`/invoices/${order.id}`);
};

const addNote = () => {
  if (newNote.value.trim()) {
    customerNotes.value.unshift({
      id: Date.now(),
      content: newNote.value,
      createdAt: new Date(),
    });
    newNote.value = "";
  }
};

const deleteNote = (noteId) => {
  customerNotes.value = customerNotes.value.filter(
    (note) => note.id !== noteId
  );
};

onMounted(() => {
  fetchCustomerData();
});
</script>
