function isPrime(n) {
  if (n < 2) return false;

  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }

  return true;
}

function isDivisibleBy15(n) {
  return n % 15 === 0;
}

function printTriangle(n) {
  for (let i = 1; i <= n; i++) {
    let row = "";

    for (let j = 1; j <= i; j++) {
      let value;

      if (isDivisibleBy15(j)) {
        value = "#";
      } else if (isPrime(j)) {
        value = "*";
      } else {
        value = j;
      }

      row += value + " ";
    }

    console.log(row.trim());

    if (i % 2 === 0) {
      console.log("-".repeat(i));
    }
  }
}

printTriangle(15);