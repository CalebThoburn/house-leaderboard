async function loadLeaderboard() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/1ZUhDZwYB5N0KDUlnwKMnSE8qvnLgFvQG16m-ci1SUGE/export?format=csv");
  const text = await res.text();

  const rows = text.trim().split(/\r?\n/).slice(1);

  const data = rows.map(row => {
    const cols = row.split(",");

    return {
      name: cols[0]?.trim(),
      score: Number(cols[1]),
      pfp: cols[2]?.trim()
    };
  });

  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data
    .sort((a, b) => b.score - a.score)
    .forEach(entry => {
      const li = document.createElement("li");

      li.innerHTML = `
        <img src="${entry.pfp}" alt="${entry.name}" width="40" height="40" style="border-radius:50%; vertical-align:middle; margin-right:10px;">
        <strong>${entry.name}</strong> — ${entry.score}
      `;

      list.appendChild(li);
    });
}

loadLeaderboard();

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