/*************************************************
 * LEADERBOARD + TASKS (FIXED)
 *************************************************/

async function loadLeaderboard() {
  try {
    const res = await fetch(
      "https://docs.google.com/spreadsheets/d/1ZUhDZwYB5N0KDUlnwKMnSE8qvnLgFvQG16m-ci1SUGE/export?format=csv"
    );

    const text = await res.text();

    const parsed = Papa.parse(text, {
      skipEmptyLines: true
    });

    const rows = parsed.data.slice(1); // remove header row

    const data = rows.map(cols => ({
      name: (cols[0] || "").trim(),
      score: parseFloat(cols[1]) || 0,
      pfp: (cols[2] || "").trim(),
      task: (cols[4] || "").trim(),
      info: (cols[6] || "").trim()
    }));

    renderLeaderboard(data);
    renderTasks(data);

  } catch (err) {
    console.error("Failed to load leaderboard:", err);
  }
}

/*************************************************
 * LEADERBOARD RENDER
 *************************************************/

function renderLeaderboard(data) {
  const list = document.getElementById("leaderboard");

  if (!list) {
    console.error("Leaderboard element missing");
    return;
  }

  list.innerHTML = "";

  data
    .sort((a, b) => b.score - a.score)
    .forEach(entry => {
      const li = document.createElement("li");

      li.innerHTML = `
        <img src="${entry.pfp || ''}" width="40" height="40"
             style="border-radius:50%; margin-right:10px;">
        <strong>${entry.name || "Unknown"}</strong> — ${entry.score}
      `;

      list.appendChild(li);
    });
}

/*************************************************
 * TASK RENDER
 *************************************************/

function renderTasks(data) {
  const container = document.querySelector(".middle");

  if (!container) {
    console.error("Middle panel missing");
    return;
  }

  let taskContainer = document.getElementById("taskContainer");

  if (!taskContainer) {
    taskContainer = document.createElement("div");
    taskContainer.id = "taskContainer";
    container.appendChild(taskContainer);
  }

  taskContainer.innerHTML = "";

  data.forEach(entry => {
    if (!entry.task?.trim()) return;

    const plaque = document.createElement("div");
    plaque.className = "task-plaque";

    plaque.innerHTML = `
      <div class="task-title">${entry.task}</div>
    `;

    plaque.onclick = () => showTaskInfo(entry);

    taskContainer.appendChild(plaque);
  });
}

/*************************************************
 * TASK DETAILS
 *************************************************/

function showTaskInfo(entry) {
  const details = document.getElementById("taskDetails");
  if (!details) return;

  details.classList.add("hide");

  setTimeout(() => {
    details.innerHTML = `
      <h2>${entry.task || "Untitled Task"}</h2>
      <p>${entry.info?.trim() || "No additional information available."}</p>
    `;

    void details.offsetWidth;

    details.classList.remove("hide");
  }, 200);
}