// const score = 10;
// if (score > 8) {
//     console.log("Bạn đạt HSG");
    
// }
// const score = 8;
// if (score > 8) {
//     console.log("Bạn đạt HSG");
// } else {
//     console.log("Bạn chưa đạt HSG");

// }
// let score = 5;
// if (score > 8) {
//     console.log("Bạn đạt HSG");
// } else if (score >5) {
//     console.log("Bạn đạt HSK");
// } else {
//     console.log("Bạn chưa đạt HSG");
// }

// let age = 20;
// if (age >=18) {
//     console.log("Trưởng thành");
    
// } else {
//     console.log("Chưa đủ tuổi");
// }

// switch (value) {
//     case value1:
//         //  Code block
//     break;
//     case value1:
//         //  Code block
//     default:
//         //  Code block
// }

// const day = "Tusday";
// switch (day) {
//     case "Monday":
//         console.log("Hôm nay là thứ 2");
//     break;
//     case "Tusday":
//         console.log("Hôm nay là thứ 3");
//     break;
//     default:
//         console.log("không phải ngày trong tuần");

// }

// const score = 2;
// switch (score) {
//     case score > 8:
//         console.log("Bạn đạt học sinh giỏi!");
//     break;
//     case score > 5:
//         console.log("Bạn đạt học sinh khá!");
//     break;
//     case score > 3:
//         console.log("Bạn đạt học sinh trung bình!");
//     break;
//     default:
//         console.log("Bạn chưa đủ điều kiện tốt nghiệp");
// }

// for (<câu lệnh khởi tạo>; <điều kiện dừng>; <bước nhảy>) {
//     // Code block 
// }

// console.log(1);
// console.log(2);
// console.log(3);
// console.log(4);
// console.log(5);
// console.log(6);
// console.log(7);
// console.log(8);
// console.log(9);
// console.log(10);

// for (let i = 1; i <= 10; i++) {
    
//     if (i ===5) {
//         break;
//     }
//     console.log(i);
// }

// while (condition) {
//     // Code block 
// }

// let count = 1;
// while (true) {
//     console.log(count);
//     if (count===10) {
//         break;
//     }
//     count++;
// }

// do {
//     // Code block 
// } while (condition);

// let count = 1;
// do {
//     console.log(count);
//     count++;
// } while (count < 0);

// let a = ""
// for (let i = 1; i <=10; i++) {
//     console.log(a += "*");
// }


// let n = 4;
// let a = 0, b = 1;

// for (let i = 0; i < n; i++) {
//     console.log(a);
//     [a, b] = [b, a + b]; 
// }

// let n = 3, a = 0, b = 1;

// for (let i = 0; i < n; i++) {
//     console.log(a);
//     let next = a+b;
//     a=b;
//     b=next;
// }

let count = 0;
for (let i = 0; i < 3; i++) {
 for (let j = 0; j < 3; j++) {
 count++;
 }
}
console.log(count);
