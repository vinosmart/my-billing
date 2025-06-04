export const useBilling = () => {
  const bills = useState("bills", () => []);

  const createBill = (items, customerInfo = {}) => {
    const bill = {
      id: Date.now(),
      billNo: "BILL-" + Date.now(),
      items,
      customerInfo,
      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      tax: 0,
      discount: 0,
      total: 0,
      createdAt: new Date().toISOString(),
    };

    bill.tax = bill.subtotal * 0.18; // 18% GST
    bill.total = bill.subtotal + bill.tax - bill.discount;

    bills.value.push(bill);
    return bill;
  };

  return {
    bills: readonly(bills),
    createBill,
  };
};
