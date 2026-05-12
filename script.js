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
let isAnimating = false;

function initQuotes() {
    const container = document.getElementById("quote");
    if (!container) return;

    const current = createQuoteElement(quotes[quoteIndex], "quote-item quote-center");
    container.appendChild(current);

    setInterval(nextQuote, 8000);
}

function createQuoteElement(quote, className) {
    console.log("Creating quote element:", quote);
    const div = document.createElement("div");
    div.className = className;
    console.log(quote);
    div.innerHTML = `
        <header class="quote-header">
            <div class="quote-text">
                “${quote.text}”
            </div>

            <div class="quote-author">
                — ${quote.author}
            </div>
        </header>
    `;

  return div;
}

function nextQuote() {
  if (isAnimating) return;
  isAnimating = true;

  const container = document.getElementById("quote");
  const current = container.querySelector(".quote-item");

  quoteIndex = (quoteIndex + 1) % quotes.length;
  const next = createQuoteElement(quotes[quoteIndex], "quote-item quote-right");

  container.appendChild(next);

  // force reflow so animation triggers reliably
  void next.offsetWidth;

  // animate transition
  current.classList.remove("quote-center");
  current.classList.add("quote-left");

  next.classList.remove("quote-right");
  next.classList.add("quote-center");

  // cleanup old quote
  setTimeout(() => {
    current.remove();
    isAnimating = false;
  }, 500);
}

// call on load
document.addEventListener("DOMContentLoaded", initQuotes);

loadLeaderboard();