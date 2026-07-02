const comments = [
  { id: 1, user: "An", content: "Sản phẩm rất tốt!", rating: 5, verified: true, likes: 12 },
  { id: 2, user: "", content: "ok", rating: 3, verified: false, likes: 0 },
  { id: 3, user: "Bình", content: "Mua lần 2 rồi, vẫn chất lượng", rating: 4, verified: true, likes: 8 },
  { id: 4, user: "Chi", content: "   ", rating: null, verified: false, likes: 2 },
  { id: 5, user: "Duy", content: "Giao hàng nhanh, đóng gói cẩn thận, sẽ ủng hộ tiếp!", rating: 5, verified: true, likes: 20 },
  { id: 6, user: null, content: "Tệ quá", rating: 1, verified: false, likes: 0 },
  { id: 7, user: "Em", content: "Bình thường", rating: 3, verified: true, likes: 1 },
];


// Hàm 1
function isValidComment(comment) {
  // kiểm tra user
  let validUser =
    typeof comment.user === "string" &&
    comment.user.trim() !== "";

  // kiểm tra content
  let validContent =
    typeof comment.content === "string" &&
    comment.content.trim().length >= 5;

  // kiểm tra rating
  let validRating =
    typeof comment.rating === "number" &&
    comment.rating >= 1 &&
    comment.rating <= 5;

  return validUser && validContent && validRating;
}

// test
for (let i = 0; i < comments.length; i++) {
  console.log(comments[i].id, isValidComment(comments[i]));
}

// Hàm 2
function filterValidComments(comments) {
  let validComments = [];

  for (let i = 0; i < comments.length; i++) {
    if (isValidComment(comments[i])) {
      validComments.push(comments[i]);
    }
  }

  return validComments;
}

// test
console.log(filterValidComments(comments));

// Hàm 3
function getCommentStats(validComments) {
  let total = validComments.length;
  let totalRating = 0;
  let totalLikes = 0;
  let verifiedCount = 0;
  let topComment = validComments[0];

  for (let i = 0; i < validComments.length; i++) {
    totalRating += validComments[i].rating;
    totalLikes += validComments[i].likes;

    if (validComments[i].verified) {
      verifiedCount++;
    }

    if (validComments[i].likes > topComment.likes) {
      topComment = validComments[i];
    }
  }

  let avgRating = Math.round((totalRating / total) * 10) / 10;

  return {
    total,
    avgRating,
    totalLikes,
    verifiedCount,
    topComment
  };
}

// test
let validComments = filterValidComments(comments);
console.log(getCommentStats(validComments));

// Hàm 4
function formatComment(comment) {
  let stars = "⭐".repeat(comment.rating);
  let userName = comment.user ?? "Ẩn danh";
  let verifiedMark = comment.verified ? " ✓" : "";

  return `${stars} | ${userName}${verifiedMark} | ${comment.content} | 👍 ${comment.likes}`;
}

// test
console.log(formatComment(comments[0]));
console.log(formatComment(comments[2]));
console.log(formatComment(comments[6]));