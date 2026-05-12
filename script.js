async function loadLeaderboard() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/1ZUhDZwYB5N0KDUlnwKMnSE8qvnLgFvQG16m-ci1SUGE/export?format=csv");
  const text = await res.text();

  const rows = text.trim().split(/\r?\n/).slice(1);

  const data = rows.map(row => {
    const cols = row.split(",");

    return {
    name: (cols[0] || "").trim(),
    score: Number((cols[1] || 0).trim()),
    pfp: (cols[2] || "").trim(),
    task: (cols[4] || "").trim(),   // column E (5th)
    info: (cols[6] || "").trim()    // column G (7th)
    };
  });

  renderLeaderboard(data);
  renderTasks(data);
}

function renderLeaderboard(data) {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  data
    .sort((a, b) => b.score - a.score)
    .forEach(entry => {
      const li = document.createElement("li");

      li.innerHTML = `
        <img src="${entry.pfp}" width="40" height="40"
             style="border-radius:50%; margin-right:10px;">
        <strong>${entry.name}</strong> — ${entry.score}
      `;

      list.appendChild(li);
    });
}

function renderTasks(data) {
  const container = document.querySelector(".middle");
  const taskBox = document.getElementById("taskContainer");

  // create container if not in HTML yet
  if (!taskBox) {
    const div = document.createElement("div");
    div.id = "taskContainer";
    container.appendChild(div);
  }

  const taskContainer = document.getElementById("taskContainer");
  taskContainer.innerHTML = "";

  data.forEach((entry, index) => {
    if (!entry.task) return;

    const plaque = document.createElement("div");

    plaque.className = "task-plaque";
    plaque.onclick = () => selectTask(entry);

    plaque.innerHTML = `
      <div class="task-title">${entry.task}</div>
    `;

    taskContainer.appendChild(plaque);

    plaque.onclick = () => showTaskInfo(entry);


  });
}

loadLeaderboard();
document.querySelector(".right").classList.add("active");

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

function showTaskInfo(entry) {
  const details = document.getElementById("taskDetails");

  // STEP 1: fade out current content
  details.classList.add("hide");

  // STEP 2: wait for fade-out, then swap content
  setTimeout(() => {
    details.innerHTML = `
      <h2>${entry.task}</h2>
      <p>${entry.info || "No additional information available."}</p>
    `;

    // STEP 3: force reflow so animation restarts cleanly
    void details.offsetWidth;

    // STEP 4: fade back in
    details.classList.remove("hide");
  }, 200); // must match CSS transition timing roughly
}

const quotes = [
  {
    "text": "Lock in.",
    "author": "Mr. Dr. Esmond"
  },
  {
    "text": "Arrrgh.",
    "author": "Zane, Pirate of the Sophomore Class"
  },
];

let quoteIndex = 0;

function rotateQuotes() {
  const quoteEl = document.getElementById("quote");

  quoteEl.style.opacity = 0;

  setTimeout(() => {
    const q = quotes[quoteIndex];

    quoteEl.innerHTML = `
      <div class="quote-text">“${q.text}”</div>
      <div class="quote-author">— ${q.author}</div>
    `;

    quoteIndex = (quoteIndex + 1) % quotes.length;

    quoteEl.style.opacity = 1;
  }, 300);
}

setInterval(rotateQuotes, 4000);
rotateQuotes(); // initial load