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

const quotes = [
  { text: "Fortune favors the bold.", author: "Virgil" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Simplicity is the ultimate sophistication.", author: "Da Vinci" }
];

let quoteIndex = 0;
let quoteInterval = 100;

/*************************************************
 * QUOTE SYSTEM (CLEAN + RELIABLE)
 *************************************************/
function initQuotes() {
  const container = document.getElementById("quote");
  if (!container) return;

  // render first quote immediately
  container.innerHTML = createQuoteHTML(quotes[0]);

  // prevent multiple intervals
  if (quoteInterval) clearInterval(quoteInterval);

  quoteInterval = setInterval(() => {
    rotateQuotes(container);
  }, 8000);
}

function createQuoteHTML(q) {
  return `
    <div class="quote-item quote-center">
      <div class="quote-text">“${q.text}”</div>
      <div class="quote-author">— ${q.author}</div>
    </div>
  `;
}

function rotateQuotes(container) {
  const nextIndex = (quoteIndex + 1) % quotes.length;

  const current = container.querySelector(".quote-item");

  const next = document.createElement("div");
  next.className = "quote-item quote-right";

  next.innerHTML = `
    <div class="quote-text">“${quotes[nextIndex].text}”</div>
    <div class="quote-author">— ${quotes[nextIndex].author}</div>
  `;

  container.appendChild(next);

  // force reflow to ensure animation starts
  next.getBoundingClientRect();

  // reset classes safely
  if (current) {
    current.className = "quote-item quote-left";
  }

  next.className = "quote-item quote-center";

  // cleanup after animation
  setTimeout(() => {
    if (current && current.parentNode) {
      current.remove();
    }
  }, 600);

  quoteIndex = nextIndex;
}

/*************************************************
 * INITIALIZATION (CRITICAL ORDER)
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
  initQuotes();
});
