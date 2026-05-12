/*************************************************
 * LEADERBOARD + TASKS
 *************************************************/
async function loadLeaderboard() {

  try {
    const res = await fetch("https://docs.google.com/spreadsheets/d/1ZUhDZwYB5N0KDUlnwKMnSE8qvnLgFvQG16m-ci1SUGE/export?format=csv");
    const text = await res.text();
    const parsed = Papa.parse(text, {
      skipEmptyLines: true
    });
    

    const newRows = parsed.data;
    const rowsWOHeader = newRows.slice(1);
    const data = rowsWOHeader.map(row => {
      const cols = row

      return {
        name: (cols[0] || "").trim(),
        score: Number((cols[1] || 0).trim()),
        pfp: (cols[2] || "").trim(),
        descrip: (cols[3] || "").trim(),
        ytChannel: (cols[4] || "").trim(),
        task: (cols[13] || "").trim(),
        leadLogicIndex: Number((cols[14] || 0).trim()),
        info: (cols[15] || "").trim()
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

      li.style.cursor = "pointer";

      li.onclick = () => showLeaderboardInfo(entry);
      list.appendChild(li);
    });
}

function showLeaderboardInfo(entry) {
  console.log("Showing info for", entry.name);
  const details = document.getElementById("taskDetails");
  if (!details) return;

  details.classList.add("hide");

  setTimeout(() => {
    details.innerHTML = `
      <div style="text-align:center;">
        <img src="${entry.pfp || ''}" 
             width="80" height="80"
             style="border-radius:50%; margin-bottom:10px;">
        
        <h2>${entry.name}</h2>
      </div>

      <p style="margin-top:10px;">
        ${entry.descrip || "No description available."}
      </p>
    `;

    void details.offsetWidth;
    details.classList.remove("hide");
  }, 200);
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
    { text: "Lock in.", author: "Mr. Dr. Esmond" },
    { text: "Your left hand is looking a little sussybaka there.", author: "Mr. Dr. Esmond" },
    { text: "Being a little out of tune is like being a little bit pregnant.", author: "Mr. Dr. Esmond" },
    { text: "Never trust a woman, am I right?", author: "Mr. Dr. Esmond" },
    { text: "*Aura farms*", author: "Mr. Dr. Esmond" },
    { text: "That better not be a white Monster.", author: "Mr. Dr. Esmond" },
    { text: "You're a laaaarge woman.", author: "Mr. Dr. Esmond" },
    { text: "Brahms was a simp.", author: "Mr. Dr. Esmond" },
    { text: "Count your carrots. Chew them one by one.", author: "Sambo"},
    { text: "Was your mom an Eskimo or something?", author: "Sambo" },
    { text: "You didn't convince me. The peanut butter cookies convinced me.", author: "Sambo" },
    { text: "If a hairy gerbil who lives in a mountain tells me to do something, I'm gonna do it.", author: "Sambo" },
    { text: "Are y'all from one of them head coverin' churches?", author: "Sambo" },
    { text: "Sam Allen is a black jazz pianist.", author: "Sambo" },
    { text: "Let me be part of your chocolate milk covenant.", author: "Sambo" },
    { text: "Sometimes you gotta wung it for the nugget.", author: "Sambo" },
    { text: "The only real Latina is Shaquille O'Neil.", author: "Pirate of the Sophomore Class" },
    { text: "Fly high Krusiewicz.", author: "Pirate of the Sophomore Class" },
    { text: "Zane needs to learn to log out of his Populi profile.", author: "Pirate of the Sophomore Class" },
    { text: "I would be gay.", author: "Pirate of the Sophomore Class" },
    { text: "I am descended from the great Dingus line.", author: "Pirate of the Sophomore Class" },
    { text: "Aye, she be. Me Landy boy! To hide me treasure I now go! Argh.", author: "Pirate of the Sophomore Class" },
    { text: "I am the youngest person ever.", author: "Pirate of the Sophomore Class" },
    { text: "Argh! I am the pirate of the Freshmen class.", author: "Pirate of the Sophomore Class" },
    { text: "Argh! I am the pirate of the Sophomore class.", author: "Pirate of the Sophomore Class" },
    { text: "Why though.", author: "Pirate of the Sophomore Class" },
    { text: "🗣️🗣️🗣️", author: "Andrew Serroels" },
    { text: "I have neither won nor lost. I am schrodinger's player.", author: "Andrew Serroels" },
    { text: "*Recommended Headphone Adapter with Charging Port*", author: "Andrew Serroels" },
    { text: "Every day I wake up and go, 'I hope I have leukemia today!!'", author: "Andrew Serroels" },
    { text: "Just how if I punched you right now Turner that'd be inappropriate, but if we were boxing it'd be okay?", author: "Andrew Serroels" },
    { text: "You must pray before every speech, even if you're dumb.", author: "Micah Willett" },
    { text: "It’s all fun and games until the fruit snacks run out.", author: "Landon Cole" },
    { text: "That's what Solomon was doing with the baby. 'Is it cake??'", author: "Landon Cole" },
    { text: "Every time I see a Pretzel now that ominous humming is going to play in my head.", author: "Landon Cole" },
    { text: "When Solomon asked for wisdom, God gave him a Twitch chat.", author: "Jacob Fisher" },
    { text: "I did illegal things in the WinCo parking lot.", author: "Jacob Fisher" },
    { text: "Mario doesn't know the things imma bout to do to him.", author: "Jacob Fisher" },
    { text: "If the fountain of youth is real, it's got Lipton peach tea in it.", author: "Jacob Fisher" },
    { text: "I have evolved.", author: "Ezra Youngren" },
    { text: "Ladies and gentlemen, ever since I was a boy, I've yearned for the mines.", author: "Ezra Youngren" },
    { text: "I am dumb.", author: "Ezra Youngren" },
    { text: "Gavin himself is just my spirit animal.", author: "Ezra Youngren" },
    { text: "Every day is Halloween. Every morning, we put on who we want to be.", author: "Ezra Youngren" },
    { text: "I'm going to go stare at myself in a mirror for the next fifteen minutes... not in a weird way.", author: "Ezra Youngren" },
    { text: "I am not a sophomore... or am I?", author: "Ezra Youngren" },
    { text: "#wannaberignitesunite", author: "Ezra Youngren" },
    { text: "Every village needs an idiot, and I figured I'd try to be populi's. Doesn't look like it worked though, y'all are taking me so seriously.", author: "Ezra Youngren" },
    { text: "MPLA", author: "Ezra Youngren" },
    { text: "Imagine being an incoming freshman, couldn't be me.", author: "Ezra Youngren" },
    { text: "Why is he a Mii?", author: "Zeke Dernlan" },
    { text: "Gavin’s trench coat is my spirit animal.", author: "Claire Blander" },
    { text: "I think I need just a little bit of cocaine.", author: "Gavin Boeger" },
    { text: "I’m gonna do a little bit of reverse Trinitarian analogy here.", author: "Emmett Torrey" },
    { text: "I love coke.", author: "Emmett Torrey" },
    { text: "Your soul is ... orange.", author: "Emmett Torrey" },
    { text: "Consider, for a moment, gay people.", author: "Emmett Torrey" },
    { text: "You can only go to heaven if you're in ashdown.", author: "Emmett Torrey" },
    
];

let quoteIndex = 0;
let isAnimating = false;

function initQuotes() {
   const container = document.getElementById("quote-container");

    if (!container) {
        console.error("Quote container missing");
        return;
    }

    const current = createQuoteElement(quotes[quoteIndex], "quote-item quote-center");
    container.appendChild(current);

    setInterval(nextQuote, 12000);
}

function createQuoteElement(quote, className) {
    const div = document.createElement("div");
    div.className = className;

    div.innerHTML = `
        <div class="quote-text">“${quote.text}”</div>
        <div class="quote-author">— ${quote.author}</div>
    `;

    return div;
}

function nextQuote() {
    if (isAnimating) return;
        isAnimating = true;

    const container = document.getElementById("quote-container");
    const current = container.querySelector(".quote-item.quote-center");
    quoteIndex = Math.floor(Math.random() * quotes.length);
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

async function getSubs(user) {
  console.log("Fetching subscriber count...");

  const apiKey = "AIzaSyDB9tcTpzRXO3Iyv0U31Hdo6Vyjj0lGNJc";

  const channelId = await getChannelId(user);

  if (!channelId) {
    console.error("No channel found for:", user);
    return;
  }

  const url =
    "https://www.googleapis.com/youtube/v3/channels" +
    "?part=statistics" +
    "&id=" + channelId +
    `&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const subs = data.items?.[0]?.statistics?.subscriberCount;

  console.log(user, "subs:", subs);
}

async function getChannelId(user) {
  const apiKey = "AIzaSyDB9tcTpzRXO3Iyv0U31Hdo6Vyjj0lGNJc";

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet" +
    "&q=" + encodeURIComponent(user) +
    "&type=channel" +
    `&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.items?.[0]?.id?.channelId;
}

getSubs("wazzotv");