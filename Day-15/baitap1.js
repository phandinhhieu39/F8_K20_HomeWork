function classifyTriangle(a, b, c) {
  // 1. Kiểm tra cạnh hợp lệ
  if (a <= 0 || b <= 0 || c <= 0) {
    return "Cạnh không hợp lệ";
  }

  // 2. Kiểm tra bất đẳng thức tam giác
  if (a + b <= c || a + c <= b || b + c <= a) {
    return "Không tạo thành tam giác";
  }

  // 3. Tam giác đều
  if (a === b && b === c) {
    return "Tam giác đều";
  }

  // 4. Tam giác cân
  if (a === b || a === c || b === c) {
    return "Tam giác cân";
  }

  // 5. Tam giác vuông
  let sides = [a, b, c].sort((x, y) => x - y);
  if (sides[0] ** 2 + sides[1] ** 2 === sides[2] ** 2) {
    return "Tam giác vuông";
  }

  // 6. Tam giác thường
  return "Tam giác thường";
}

console.log(classifyTriangle(3, 4, 5)); // Tam giác vuông
console.log(classifyTriangle(2, 2, 2)); // Tam giác đều
console.log(classifyTriangle(1, 2, 10)); // Không tạo thành tam giác
console.log(classifyTriangle(5, 5, 7)); // Tam giác cân
console.log(classifyTriangle(0, 4, 5)); // Cạnh không hợp lệ
console.log(classifyTriangle(6, 8, 10)); // Tam giác vuông