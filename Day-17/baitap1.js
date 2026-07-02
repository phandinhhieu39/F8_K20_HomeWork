// Hàm 1
const createSlug = "MacBook Pro 2024!!!";

console.log(createSlug.toLowerCase().replaceAll(" ", "-").replaceAll(/[^a-zA-Z0-9--\s]/g, ""));


// Hàm 2

function generateOrderId(productName, quantity) {
return "ORD-" 
    + productName.substring(0, 3).toUpperCase() 
    + "-" 
    + quantity 
    + "-" 
    + productName.length;}

console.log(generateOrderId("MacBook Pro", 2));


// Hàm 3
function formatPrice(price, currency) {
    if (currency === "VND") {
        return price.toLocaleString("vi-VN") + "đ";
    }else if (currency === "USD") {
        return price.toLocaleString("en-US") + "$";
    }

}

console.log(formatPrice(2000000, "USD")); // 2.000.000 ₫

// Hàm 4
const baseUrl = "https://shop.vn";
const product = { name: "MacBook Pro 2024", id: 101, category: "laptop" };

console.log(baseUrl + "/".concat(product.category + "/" + product.name.toLowerCase().replaceAll(" ", "-") + "?" + "id=" + product.id ));
