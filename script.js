/*************************************************
 * LEADERBOARD + TASKS
 *************************************************/
async function loadLeaderboard() {
  try {
    const res = await fetch("https://docs.google.com/spreadsheets/d/1ZUhDZwYB5N0KDUlnwKMnSE8qvnLgFvQG16m-ci1SUGE/export?format=csv");
    const text = await res.text();

    const rows = text.trim().split(/\r?\n/).slice(1);

    const data = rows.map(row => {
      const cols = row.split(",");

      return {
        name: (cols[0] || "").trim(),
        score: Number((cols[1] || 0).trim()),
        pfp: (cols[2] || "").trim(),
        task: (cols[4] || "").trim(),
        info: (cols[6] || "").trim()
      };
    });

    renderLeaderboard(data);
    renderTasks(data);

  } catch (err) {
    console.error("Failed to load leaderboard:", err);
  }
}

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
        <strong>${entry.name}</strong> — ${entry.score}
      `;

      list.appendChild(li);
    });
}

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
    if (!entry.task) return;

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
 * TASK DETAIL VIEW
 *************************************************/
function showTaskInfo(entry) {
  const details = document.getElementById("taskDetails");
  if (!details) return;

  details.classList.add("hide");

  setTimeout(() => {
    details.innerHTML = `
      <h2>${entry.task}</h2>
      <p>${entry.info || "No additional information available."}</p>
    `;

    void details.offsetWidth;

    details.classList.remove("hide");
  }, 200);
}

/*************************************************
 * QUOTES ROTATOR
 *************************************************/
const quotes = [
  { text: "Fortune favors the bold.", author: "Virgil" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Simplicity is the ultimate sophistication.", author: "Da Vinci" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "F. D. Roosevelt" }
];

let quoteIndex = 0;
let animating = false;

document.addEventListener("DOMContentLoaded", initQuotes);

function initQuotes() {
  const container = document.getElementById("quote");
  if (!container) return;

  container.innerHTML = "";

  // initial quote
  container.appendChild(createQuote(quotes[quoteIndex], "quote-item quote-center"));

  setInterval(nextQuote, 8000);
}

function createQuote(q, className) {
  const el = document.createElement("div");
  el.className = className;

  el.innerHTML = `
    <div style="font-size:18px">“${q.text}”</div>
    <div style="font-size:14px; opacity:0.7">— ${q.author}</div>
  `;

  return el;
}

function nextQuote() {
  if (animating) return;
  animating = true;

  const container = document.getElementById("quote");
  const current = container.querySelector(".quote-item");

  quoteIndex = (quoteIndex + 1) % quotes.length;
  const next = createQuote(quotes[quoteIndex], "quote-item quote-right");

  container.appendChild(next);

  // force layout
  void next.offsetWidth;

  current.classList.remove("quote-center");
  current.classList.add("quote-left");

  next.classList.remove("quote-right");
  next.classList.add("quote-center");

  setTimeout(() => {
    if (current) current.remove();
    animating = false;
  }, 500);
}