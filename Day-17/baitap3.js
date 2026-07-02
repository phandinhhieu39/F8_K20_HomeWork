// Hàm 1
const players = [
  { id: 1, name: "DragonSlayer", scores: [120, 85, 200, 95], level: 8, badge: "gold" },
  { id: 2, name: "NightWolf",    scores: [60, 75, 50],        level: 5, badge: null },
  { id: 3, name: "StarQueen",    scores: [300, 250, 180, 90, 120], level: 12, badge: "diamond" },
  { id: 4, name: "IronFist",     scores: [40, 30],             level: 2, badge: null },
  { id: 5, name: "ShadowBlade",  scores: [150, 200, 175],      level: 9, badge: "silver" },
];

function getTotalScore(player) {
  let total = 0;

  for (let i = 0; i < player.scores.length; i++) {
    total += player.scores[i];
  }

  return total;
}

// test
console.log(getTotalScore(players[0])); // 500
console.log(getTotalScore(players[1])); // 185
console.log(getTotalScore(players[2])); // 940

// Hàm 2
function getRanking(players) {
  let ranking = [];

  // tạo mảng mới
  for (let i = 0; i < players.length; i++) {
    ranking.push({
      name: players[i].name,
      totalScore: getTotalScore(players[i]),
      badge: players[i].badge ?? "none"
    });
  }

  // sắp xếp giảm dần
  ranking.sort((a, b) => b.totalScore - a.totalScore);

  // thêm thứ hạng
  for (let i = 0; i < ranking.length; i++) {
    ranking[i].rank = i + 1;
  }

  return ranking;
}
console.log(getRanking(players));

// Hàm 3 
function getTopPlayers(players, n) {
  let ranking = getRanking(players);
  let topPlayers = [];

  for (let i = 0; i < n && i < ranking.length; i++) {
    topPlayers.push(ranking[i].name);
  }

  return topPlayers;
}

// test
console.log(getTopPlayers(players, 3));
// ["StarQueen", "ShadowBlade", "DragonSlayer"]

console.log(getTopPlayers(players, 1));
// ["StarQueen"]

// Hàm 4
function getTopPlayers(players, n) {
  let ranking = getRanking(players);
  let topPlayers = [];

  for (let i = 0; i < n && i < ranking.length; i++) {
    topPlayers.push(ranking[i].name);
  }

  return topPlayers;
}

// test
console.log(getTopPlayers(players, 3));
// ["StarQueen", "ShadowBlade", "DragonSlayer"]

console.log(getTopPlayers(players, 1));
// ["StarQueen"]

