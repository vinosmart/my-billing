<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white shadow-lg transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-16',
      ]"
    >
      <!-- Header with Toggle Button -->
      <div class="flex items-center justify-between p-4">
        <h1
          v-show="isOpen"
          class="text-xl font-bold text-gray-800 transition-opacity duration-300"
        >
          Mera Thugan
        </h1>
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg
            :class="[
              'w-6 h-6 text-gray-600 transition-transform duration-300',
              isOpen ? 'rotate-0' : 'rotate-180',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-4">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center mx-2 mb-1 px-3 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group relative"
          active-class="bg-indigo-50 text-indigo-600 shadow-sm"
        >
          <!-- Icon -->
          <span
            v-html="item.icon"
            :class="[
              'w-6 h-6 transition-colors duration-200',
              isOpen ? 'mr-3' : 'mx-auto',
            ]"
          />

          <!-- Menu Text -->
          <span
            v-show="isOpen"
            class="font-medium transition-opacity duration-300"
          >
            {{ item.name }}
          </span>

          <!-- Tooltip for collapsed state -->
          <div
            v-show="!isOpen"
            class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
          >
            {{ item.name }}
          </div>
        </NuxtLink>
      </nav>

      <!-- Footer (optional) -->
      <div class="absolute bottom-4 left-0 right-0 px-4">
        <div
          v-show="isOpen"
          class="text-xs text-gray-500 text-center transition-opacity duration-300"
        >
          © 2025 TextileBill Pro
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto transition-all duration-300">
      <!-- Top Header Bar -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ currentPageTitle }}
          </h2>

          <!-- Mobile menu button (shows on small screens) -->
          <button
            @click="toggleSidebar"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-6">
        <slot />
      </div>
    </main>

    <!-- Mobile Overlay -->
    <div
      v-show="isOpen && isMobile"
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

// Icons as Vue components

// Reactive state
const isOpen = ref(true);
const isMobile = ref(false);
const route = useRoute();

// Menu items with proper icon components
const menuItems = [
  {
    name: "Analytics",
    path: "/analytics",
    icon: `   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>`,
  },
  {
    name: "Products",
    path: "/products",
    icon: `  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>`,
  },
  {
    name: "Purchase",
    path: "/purchase",
    icon: ` <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>`,
  },
  {
    name: "Billing",
    path: "/billing",
    icon: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `,
  },
  {
    name: "customers",
    path: "/customers",
    icon: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M16 11a4 4 0 11-8 0 4 4 0 018 0zm-1.5 7.5a6.5 6.5 0 00-13 0v1.5a1.5 1.5 0 001.5 1.5h10a1.5 1.5 0 001.5-1.5V18z" />
    </svg>
  `,
  },
];

// Computed properties
const currentPageTitle = computed(() => {
  const currentItem = menuItems.find((item) => item.path === route.path);
  return currentItem ? currentItem.name : "Dashboard";
});

// Methods
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
  if (isMobile.value) {
    isOpen.value = false;
  }
};

// Handle responsive behavior
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
  }
};

// Lifecycle hooks
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);

  // Load saved sidebar state
  const savedState = localStorage.getItem("sidebarOpen");
  if (savedState !== null && !isMobile.value) {
    isOpen.value = JSON.parse(savedState);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// Watch for sidebar state changes and save to localStorage
import { watch } from "vue";
watch(isOpen, (newVal) => {
  if (!isMobile.value) {
    localStorage.setItem("sidebarOpen", JSON.stringify(newVal));
  }
});
</script>

<style scoped>
/* Custom scrollbar for main content */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
