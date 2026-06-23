function round2(num) {
  return Math.round(num * 100) / 100;
}

function analyzeClass(scores) {
  let excellent = 0;
  let good = 0;
  let fair = 0;
  let average = 0;
  let weak = 0;

  let invalidCount = 0;
  let validCount = 0;

  let highest = null;
  let lowest = null;
  let sum = 0;

  for (let i = 0; i < scores.length; i++) {
    let score = scores[i];

    // Bỏ qua điểm không hợp lệ
    if (score < 0 || score > 10) {
      invalidCount++;
      continue;
    }

    validCount++;
    sum += score;

    if (highest === null || score > highest) {
      highest = score;
    }

    if (lowest === null || score < lowest) {
      lowest = score;
    }

    // Xếp loại
    if (score >= 9) {
      excellent++;
    } else if (score >= 8) {
      good++;
    } else if (score >= 6.5) {
      fair++;
    } else if (score >= 5) {
      average++;
    } else {
      weak++;
    }
  }

  let avgScore = 0;
  let comment = "";

  if (validCount === 0) {
    avgScore = 0;
    comment = "Không có dữ liệu hợp lệ";
  } else {
    avgScore = round2(sum / validCount);

    let fairOrAbove = excellent + good + fair;

    if (fairOrAbove > validCount / 2) {
      comment = "Lớp học tốt";
    } else if (weak > validCount / 2) {
      comment = "Cần cải thiện";
    } else {
      comment = "Lớp học ở mức ổn";
    }
  }

  return {
    excellent: excellent,
    good: good,
    fair: fair,
    average: average,
    weak: weak,

    validCount: validCount,
    invalidCount: invalidCount,

    highest: highest,
    lowest: lowest,
    averageScore: avgScore,

    comment: comment
  };
}
console.log(analyzeClass([9, 7, -2, 5.5, 10, 4, 11, 6.5, 8]));