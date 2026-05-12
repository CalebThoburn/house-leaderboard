async function loadLeaderboard() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/1ZUhDZwYB5N0KDUlnwKMnSE8qvnLgFvQG16m-ci1SUGE/export?format=csv");
  const text = await res.text();
  console.log(text);
  const rows = text.trim().split(/\r?\n/).slice(1);

  const data = rows.map(row => {
    const cols = row.split(",");

    return {
      name: (cols[0] || "").trim(),
      score: Number((cols[1] || "").trim()),
      pfp: (cols[2] || "").trim()
    };
  });

  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data
    .sort((a, b) => b.score - a.score)
    .forEach(entry => {
      const li = document.createElement("li");

      li.innerHTML = `
        <img src="${entry.pfp}" alt="${entry.name}"
             width="40" height="40"
             style="border-radius:50%; vertical-align:middle; margin-right:10px;">
        <strong>${entry.name}</strong> — ${entry.score}
      `;

      list.appendChild(li);
    });
}

loadLeaderboard();

function selectTask(taskId) {
  const details = document.getElementById("taskDetails");

  const taskData = {
    task1: {
      title: "Task 1",
      desc: "This is the first task. Do something interesting here."
    },
    task2: {
      title: "Task 2",
      desc: "This task involves collecting points."
    },
    task3: {
      title: "Task 3",
      desc: "Final challenge task."
    }
  };

  const task = taskData[taskId];

  details.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.desc}</p>
  `;
}