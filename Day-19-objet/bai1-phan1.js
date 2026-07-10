function Order(orderId, customerName, items, status = "pending") {
    this.orderId = orderId;
    this.customerName = customerName;
    this.items = items;
    this.status = status;

    // tính tổng tiền đơn hàng
    this.getTotalAmount = function() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity,0);
    };

    // tổng số lượng sản phẩm trong đơn
    this.getItemCount = function() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    };

    // cập nhật trạng thái
    this.updateStatus = function(newStatus) {
        this.status = newStatus;
        return `Order ${this.orderId} status updated to ${this.status}`;
    };

    // thêm sản phẩm 
    this.addItem = function(item) {
        this.items.push(item);
        return this.getTotalAmount();
    };

    // tóm tắt đơn hàng
    this.getSummary = function() {
        return {
            orderId : this.orderId,
            customerName : this.customerName,
            totalAmount : this.totalAmount,
            itemCount : this.itemCount,
            status : this.status,
        };
    };
}

const order1 = new Order("ORD01", "Nguyễn An", [
  { name: "Áo thun", price: 150000, quantity: 2 },
  { name: "Quần jean", price: 350000, quantity: 1 },
]);

const order2 = new Order("ORD02", "Trần Bình", [
  { name: "iPhone 15", price: 25000000, quantity: 1 },
]);

// test case 
// order1.getTotalAmount()   // 650000
console.log(order1.getTotalAmount());

// order1.getItemCount()     // 3
console.log(order1.getItemCount());

// order1.getSummary()
console.log(order1.getSummary());

// // {
// //   orderId: "ORD01",
// //   customerName: "Nguyễn An",
// //   totalAmount: 650000,
// //   itemCount: 3,
// //   status: "pending"
// // }

// order1.updateStatus("completed")
console.log(order1.updateStatus("completed"));

// // "Đơn hàng ORD01 đã chuyển sang: completed"

// order1.addItem({ name: "Mũ", price: 120000, quantity: 2 })
console.log(order1.addItem({ name: "Mũ", price: 120000, quantity: 2 }));

// // 890000  (tổng tiền mới sau khi thêm)

// order2.getTotalAmount()   // 25000000
console.log(order2.getTotalAmount());

// order2.status             // "pending"
console.log(order2.status);


// // Kiểm tra instanceof
console.log(order1 instanceof Order)  // true
console.log(order2 instanceof Order)  // true
