import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStockStore = defineStore("stockStore", () => {
  const stocks = ref([
    {
      productName: "Cotton Fabric",
      barcode: "123456789",
      category: "Fabric",
      quantity: 100,
      price: 50,
      status: "In Stock",
    },
  ]);

  const addStock = (newStock) => {
    stocks.value.push(newStock);
  };

  const updateStock = (index, updatedStock) => {
    stocks.value[index] = updatedStock;
  };

  const deleteStock = (index) => {
    stocks.value.splice(index, 1);
  };

  const stockSummary = computed(() => ({
    inStock: stocks.value.filter((s) => s.status === "In Stock").length,
    lowStock: stocks.value.filter((s) => s.status === "Low Stock").length,
    outOfStock: stocks.value.filter((s) => s.status === "Out of Stock").length,
  }));

  return { stocks, addStock, updateStock, deleteStock, stockSummary };
});
