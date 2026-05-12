async function loadLeaderboard() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/1ZUhDZwYB5N0KDUlnwKMnSE8qvnLgFvQG16m-ci1SUGE/export?format=csv");
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1); // skip header

  const data = rows.map(row => {
    const [name, score] = row.split(",");
    return { name, score: Number(score) };
  });

  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} — ${p.score}`;
    list.appendChild(li);
  });
}

loadLeaderboard();

async function loadLeaderboard() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/1ZUhDZwYB5N0KDUlnwKMnSE8qvnLgFvQG16m-ci1SUGE/export?format=csv");
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1); // skip headers

  const data = rows.map(row => {
    const [name, score] = row.split(",");
    return { name, score: Number(score) };
  });

  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data
    .sort((a, b) => b.score - a.score)
    .forEach(player => {
      const li = document.createElement("li");
      li.textContent = `${player.name} — ${player.score}`;
      list.appendChild(li);
    });
}

loadLeaderboard();