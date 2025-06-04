export const useProducts = () => {
  const products = useState("products", () => []);

  const generateBarcode = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      barcode: generateBarcode(),
      createdAt: new Date().toISOString(),
    };
    products.value.push(newProduct);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    const index = products.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updates };
    }
  };

  const deleteProduct = (id) => {
    products.value = products.value.filter((p) => p.id !== id);
  };

  const getProductByBarcode = (barcode) => {
    return products.value.find((p) => p.barcode === barcode);
  };

  const updateStock = (id, quantity) => {
    const product = products.value.find((p) => p.id === id);
    if (product) {
      product.quantity = Math.max(0, product.quantity + quantity);
    }
  };

  return {
    products: readonly(products),
    addProduct,
    updateProduct,
    deleteProduct,
    getProductByBarcode,
    updateStock,
  };
};
