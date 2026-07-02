console.log("PHAN DINH HIEU");
// Syntax
// Guide style
// If else, truthy - false, switch case
// Loop: for, while, do while
// Data types: number, string, bigint, undefined, null, symbol, Boolean, object
// Array (Object)
// String, Number, Function (Object)

// const name0 = 'Jonh';
// const name1 = "Jonh";
// const name2 = 'Jonh';
// const name3 = `Jonh`;
// const name4 = "Jo\vnh";

// const name5 = new String("Jonh");
// const name6 = new String("Jonh");
// console.log(name5 == name6);
// console.log(name0 == name1);

// Độ dài chuỗi
const name = "John Doe";

// const temp = new String("John")
// console.log(temp.length);

// console.log(name.length);

// temp = null;

// // Hủy biến tạm temp

// // là Auto boxing

// // Phương thức truy xuất ký tự trong chuỗi
// console.log(name.at(7));
// console.log(name.charAt(7));
// console.log(name[-1]);

// console.log(name.charCodeAt(0));
// console.log(name.codePointAt(0));

// Phương thúc truy xuất chuỗi con 
// console.log(name.slice(-3)); //có hỗ trợ số âm
// console.log(name.substring(-1,4)); //số âm coi như là số 0
// console.log(name.substr(5,2)); //lỗi thời không nên dùng

// Phương thúc tìm kiếm trong chuỗi
// console.log(name.indexOf("o", 5));
// console.log(name.lastIndexOf("o"));
// console.log(name.search(/O/i));
// console.log(name.includes("b")); //Tìm kiếm có nằm trong chuỗi hay k
// const arr = name.match("o")
// // console.log(arr.index);
// // console.log(arr.input);
// const arrs = name.matchAll("o");
// console.log(arrs.forEach(item => {
//     console.log(item);
    
//     },
// ));

// console.log(name.startsWith("Do", 5));
// console.log(name.endsWith("hn", 4));

// console.log(name.match("o")); ["o"]

// Phương thức nối chuỗi
// console.log(name.concat(",", "Jane"));

// Phương thức làm đầy chuỗi 
// const number = "123";
// const phone = "0987";
// console.log(number.padStart(5, "0"));
// console.log(number.padEnd(5, "0"));
// console.log(phone.padEnd(10, "*"));

// Phương thức khác
// console.log(name.trim()); //cắt hết tất cả dấu cách
// console.log(name.trimStart());
// console.log(name.trimEnd());

// console.log(name.toUpperCase()); //TẤT CẢ VIẾT HOA
// console.log(name.toLowerCase()); //tất cả viết thường

// Ngăn cách giữa các phần tử
// console.log(name.split("n"));

// Thay thế phần tử
// console.log(name.replace("o", "a"));
// console.log(name.replace(/o/g, "a"));
// console.log(name.replaceAll("o", "a"));

// // ***BÀI TẬP
// const paragraph = `Mình từng tích hợp OpenAI API vào một app nội bộ, chạy ngon 2 tháng đầu. Tháng thứ 3, hóa đơn tăng gấp đôi vì context window dài hơn mình ước tính. Đó là lúc mình nhận ra: chọn API không phải chỉ là "cái nào xịn hơn" - mà là cái nào phù hợp với use case và ngân sách của bạn.

// Hiện tại có 3 nhà cung cấp đang chiếm phần lớn thị phần AI API cho developer: OpenAI (GPT-4o, o1), Anthropic (Claude 3.5 Sonnet/Haiku), và Google (Gemini 1.5 Pro/Flash). Ba cái tên này xuất hiện trong hầu hết mọi tech stack khi team muốn thêm AI vào sản phẩm web.

// Bài này mình sẽ không nói "API X tốt nhất" vì không có câu trả lời chung. Thay vào đó, mình sẽ đi qua từng tiêu chí mà dev web thực sự cần quan tâm: chất lượng đầu ra, context window, multimodal, và chi phí triển khai.`;

// console.log(paragraph.replaceAll("\n\n", " "));
// console.log(paragraph.replaceAll("AI", "XXX"));

const fullname = "nguyen van a";
const result = fullname.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1));
console.log(result.join(" "));



















