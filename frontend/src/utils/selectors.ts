export interface Order {
    createdAt: string;
    totalPrice: number;
    paymentStatus: string;
}
  
export const getMonthlySales = (orders: Order[]): { month: string; sales: number }[] => {
    const monthlySales: { [key: string]: number } = {};
    orders.forEach((order) => {
      if (order.paymentStatus === "Paid") {
        const date = new Date(order.createdAt);
        const month = date.toLocaleString("default", { month: "short" });
        monthlySales[month] = (monthlySales[month] || 0) + order.totalPrice;
      }
    });
  
    return Object.entries(monthlySales).map(([month, sales]) => ({
      month,
      sales,
    }));
  };
  