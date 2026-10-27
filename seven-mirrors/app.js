import {
  DIMENSIONS,
  DIMENSION_ORDER,
  QUESTIONS,
  buildResult,
  calculateScores,
  getLevel,
} from "./assessment.js";

const STORAGE_KEY = "seven-mirrors-state-v1";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const screens = [...document.querySelectorAll("[data-screen]")];
const introScreen = document.querySelector("#intro-screen");
const quizScreen = document.querySelector("#quiz-screen");
const processingScreen = document.querySelector("#processing-screen");
const resultScreen = document.querySelector("#result-screen");
const startButton = document.querySelector("#start-button");
const restartHomeButton = document.querySelector("#restart-home-button");
const previousButton = document.querySelector("#previous-button");
const nextButton = document.querySelector("#next-button");
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");
const questionText = document.querySelector("#question-text");
const questionStatus = document.querySelector("#question-status");
const questionCard = document.querySelector("#question-card");
const answerOptions = [...document.querySelectorAll(".answer-option")];
const methodDialog = document.querySelector("#method-dialog");
const toast = document.querySelector("#toast");

let state = loadState();
let autoAdvanceTimer;
let toastTimer;
let currentResult = null;

function blankState() {
  return {
    currentIndex: 0,
    answers: Array(QUESTIONS.length).fill(null),
    completed: false,
    scores: null,
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      !parsed ||
      !Array.isArray(parsed.answers) ||
      parsed.answers.length !== QUESTIONS.length ||
      !parsed.answers.every((answer) => answer === null || (Number.isInteger(answer) && answer >= 1 && answer <= 5))
    ) {
      return blankState();
    }
    return {
      currentIndex: Math.min(Math.max(Number(parsed.currentIndex) || 0, 0), QUESTIONS.length - 1),
      answers: parsed.answers,
      completed: Boolean(parsed.completed),
      scores: parsed.scores || null,
    };
  } catch {
    return blankState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The assessment still works if the browser blocks local storage.
  }
  updateHomeState();
}

function updateHomeState() {
  const answeredCount = state.answers.filter(Boolean).length;
  const buttonLabel = startButton.querySelector("span:first-child");

  if (state.completed && state.scores) {
    buttonLabel.textContent = "查看上次结果";
    restartHomeButton.classList.remove("is-hidden");
  } else if (answeredCount > 0) {
    buttonLabel.textContent = `继续测试 · ${answeredCount}/35`;
    restartHomeButton.classList.remove("is-hidden");
  } else {
    buttonLabel.textContent = "开始照见自己";
    restartHomeButton.classList.add("is-hidden");
  }
}

function showScreen(name, { focus = true } = {}) {
  clearTimeout(autoAdvanceTimer);
  const target = screens.find((screen) => screen.dataset.screen === name);
  screens.forEach((screen) => {
    const active = screen === target;
    screen.hidden = !active;
    screen.classList.toggle("is-active", active);
  });
  history.replaceState(null, "", name === "intro" ? "#home" : `#${name}`);
  window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
  if (focus) {
    requestAnimationFrame(() => target?.focus?.({ preventScroll: true }));
  }
}

function startOrResume() {
  if (state.completed && state.scores) {
    renderResult(state.scores);
    showScreen("result");
    return;
  }

  const firstUnanswered = state.answers.findIndex((answer) => answer === null);
  if (firstUnanswered >= 0 && state.answers.filter(Boolean).length > 0) {
    state.currentIndex = firstUnanswered;
  }
  saveState();
  renderQuestion();
  showScreen("quiz");
}

function renderQuestion() {
  const index = state.currentIndex;
  const question = QUESTIONS[index];
  const answer = state.answers[index];
  const position = index + 1;

  progressText.textContent = `${String(position).padStart(2, "0")} / ${QUESTIONS.length}`;
  progressBar.style.width = `${(position / QUESTIONS.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(position));
  questionText.textContent = question.text;
  questionStatus.textContent = `第 ${position} 题，共 ${QUESTIONS.length} 题`;

  answerOptions.forEach((option) => {
    const selected = Number(option.dataset.value) === answer;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-checked", String(selected));
  });

  previousButton.disabled = index === 0;
  nextButton.disabled = !answer;
  nextButton.textContent = index === QUESTIONS.length - 1 ? "查看结果 →" : "下一题 →";

  questionCard.classList.remove("is-changing");
  void questionCard.offsetWidth;
  questionCard.classList.add("is-changing");
}

function selectAnswer(value, autoAdvance = true) {
  state.answers[state.currentIndex] = value;
  state.completed = false;
  state.scores = null;
  saveState();
  renderQuestion();

  if (!autoAdvance) return;
  clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = setTimeout(() => {
    if (state.currentIndex === QUESTIONS.length - 1) {
      finishAssessment();
    } else {
      state.currentIndex += 1;
      saveState();
      renderQuestion();
    }
  }, reduceMotion.matches ? 20 : 260);
}

function goPrevious() {
  clearTimeout(autoAdvanceTimer);
  if (state.currentIndex === 0) return;
  state.currentIndex -= 1;
  saveState();
  renderQuestion();
}

function goNext() {
  clearTimeout(autoAdvanceTimer);
  if (!state.answers[state.currentIndex]) return;
  if (state.currentIndex === QUESTIONS.length - 1) {
    finishAssessment();
    return;
  }
  state.currentIndex += 1;
  saveState();
  renderQuestion();
}

function finishAssessment() {
  if (state.answers.some((answer) => answer === null)) {
    state.currentIndex = state.answers.findIndex((answer) => answer === null);
    renderQuestion();
    showToast("还有题目没有作答");
    return;
  }

  const scores = calculateScores(state.answers);
  state.scores = scores;
  state.completed = true;
  saveState();
  showScreen("processing", { focus: false });

  window.setTimeout(() => {
    renderResult(scores);
    showScreen("result", { focus: false });
  }, reduceMotion.matches ? 80 : 900);
}

function resetAssessment({ start = false } = {}) {
  clearTimeout(autoAdvanceTimer);
  state = blankState();
  currentResult = null;
  saveState();
  if (start) {
    renderQuestion();
    showScreen("quiz");
  } else {
    showScreen("intro");
  }
}

function renderResult(scores) {
  currentResult = buildResult(scores);
  const { top, second, lowest, doubleCore, shapeText, climateText } = currentResult;
  const topLevel = getLevel(top.score);

  document.querySelector("#result-overline").textContent = doubleCore ? "你的双核心倾向" : "你的主倾向";
  document.querySelector("#result-title").textContent = doubleCore
    ? `${top.archetype} × ${second.archetype}`
    : top.archetype;

  const secondSentence = doubleCore
    ? `与此同时，「${second.name}」也构成了明显的次要拉力。`
    : `相对而言，「${lowest.name}」目前更为舒缓，可作为观察其他倾向时的参照。`;
  document.querySelector("#result-summary").textContent =
    `你的「${top.name}」倾向值为 ${top.score}，处于“${topLevel.label}”。这不是道德标签；它更像在压力或诱惑出现时，你通过“${top.need}”保护自己的方式。${secondSentence}`;

  renderRadar(scores);
  renderTopFacets([top, second]);
  document.querySelector("#shape-text").textContent = shapeText;
  document.querySelector("#climate-text").textContent = climateText;
  renderAdvice(currentResult);
  renderDimensionList(scores);
}

function polarPoint(index, radius, center = 260) {
  const angle = (-90 + index * (360 / DIMENSION_ORDER.length)) * (Math.PI / 180);
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

function pointsString(points) {
  return points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

function renderRadar(scores) {
  const radius = 158;
  const center = 260;
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];
  const dataPoints = DIMENSION_ORDER.map((key, index) => polarPoint(index, radius * (scores[key] / 100), center));
  const accessibleSummary = DIMENSION_ORDER.map((key) => `${DIMENSIONS[key].name} ${scores[key]} 分`).join("，");

  const grid = gridLevels
    .map((level, index) => {
      const points = DIMENSION_ORDER.map((_, axisIndex) => polarPoint(axisIndex, radius * level, center));
      return `<polygon class="radar-grid ${index === gridLevels.length - 1 ? "radar-grid-outer" : ""}" points="${pointsString(points)}"></polygon>`;
    })
    .join("");

  const axes = DIMENSION_ORDER.map((_, index) => {
    const point = polarPoint(index, radius, center);
    return `<line class="radar-axis" x1="${center}" y1="${center}" x2="${point.x}" y2="${point.y}"></line>`;
  }).join("");

  const labels = DIMENSION_ORDER.map((key, index) => {
    const point = polarPoint(index, radius + 45, center);
    let anchor = "middle";
    if (point.x > center + 30) anchor = "start";
    if (point.x < center - 30) anchor = "end";
    const baseline = point.y < center - 120 ? "auto" : point.y > center + 120 ? "hanging" : "middle";
    return `<g>
      <text class="radar-label" x="${point.x}" y="${point.y}" text-anchor="${anchor}" dominant-baseline="${baseline}">${DIMENSIONS[key].name}</text>
      <text class="radar-score-label" x="${point.x}" y="${point.y + 17}" text-anchor="${anchor}" dominant-baseline="${baseline}">${scores[key]}</text>
    </g>`;
  }).join("");

  const dots = DIMENSION_ORDER.map((key, index) => {
    const point = dataPoints[index];
    return `<circle class="radar-point" cx="${point.x}" cy="${point.y}" r="6" fill="${DIMENSIONS[key].color}">
      <title>${DIMENSIONS[key].name}：${scores[key]}，${getLevel(scores[key]).label}</title>
    </circle>`;
  }).join("");

  document.querySelector("#radar-container").innerHTML = `
    <svg class="radar-svg" viewBox="0 0 520 520" role="img" aria-labelledby="radar-title radar-desc">
      <title id="radar-title">你的七宗罪倾向雷达图</title>
      <desc id="radar-desc">${accessibleSummary}</desc>
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e3c565" stop-opacity=".42"></stop>
          <stop offset="52%" stop-color="#a77ada" stop-opacity=".26"></stop>
          <stop offset="100%" stop-color="#69b982" stop-opacity=".28"></stop>
        </linearGradient>
      </defs>
      ${grid}${axes}
      <polygon class="radar-area" points="${pointsString(dataPoints)}"></polygon>
      ${dots}${labels}
    </svg>`;
}

function renderTopFacets(facets) {
  document.querySelector("#top-facets").innerHTML = facets
    .map((facet, index) => {
      const level = getLevel(facet.score);
      return `<article class="facet-card" style="--facet-color: ${facet.color}">
        <div class="facet-head">
          <span class="facet-rank">0${index + 1}</span>
          <span class="facet-score">${facet.score}<small> / 100</small></span>
        </div>
        <h3>${facet.name}</h3>
        <p class="facet-soft">${facet.softName} · ${level.label}</p>
        <p class="facet-insight">${facet.description}</p>
        <div class="facet-tags"><span>潜在力量：${facet.gift}</span><span>失衡提醒：${facet.risk}</span></div>
      </article>`;
    })
    .join("");
}

function renderAdvice(result) {
  const { top, second, lowest, doubleCore } = result;
  const items = [top.advice[getLevel(top.score).key]];

  if (doubleCore) {
    items.push(second.advice[getLevel(second.score).key]);
    items.push(`把相对舒缓的「${lowest.name}」当作调节参照，但不必把它理解成固定优点：${lowest.advice[getLevel(lowest.score).key]}`);
  } else {
    items.push(`你的相对调节资源是「${lowest.name}」：${lowest.advice[getLevel(lowest.score).key]}`);
    items.push("连续一周记下“触发情境—身体感受—实际行动”三件事。先找到模式，再决定要改变什么。");
  }

  document.querySelector("#advice-list").innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderDimensionList(scores) {
  document.querySelector("#dimension-list").innerHTML = DIMENSION_ORDER.map((key, index) => {
    const dimension = DIMENSIONS[key];
    const score = scores[key];
    const level = getLevel(score);
    return `<details class="dimension-item" style="--dimension-color: ${dimension.color}" ${index === 0 ? "open" : ""}>
      <summary>
        <span class="dimension-icon" aria-hidden="true">${dimension.icon}</span>
        <span class="dimension-name"><strong>${dimension.name}</strong><span>${dimension.softName} · ${level.label}</span></span>
        <span class="dimension-meter" aria-hidden="true"><span style="width: ${score}%"></span></span>
        <span class="dimension-score">${score}</span>
        <span class="dimension-toggle" aria-hidden="true">＋</span>
      </summary>
      <div class="dimension-detail">
        <p><strong>这一面意味着什么</strong>${dimension.description}</p>
        <p><strong>此刻可以怎么做</strong>${dimension.advice[level.key]}</p>
      </div>
    </details>`;
  }).join("");
}

function shareText() {
  if (!currentResult) return "";
  const { top, second, doubleCore } = currentResult;
  const facets = doubleCore ? `${top.name} · ${second.name}` : `${top.name}（${top.score}）`;
  return `我照了一次「七面心镜」，最鲜明的是 ${facets}。原来有些被叫作“弱点”的东西，也藏着我的动力。\n\n七种倾向不是判决，只是认识自己的另一种方式。`;
}

async function copyResult() {
  const text = shareText();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  showToast("结果文案已复制");
}

async function shareResult() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "我的七面心镜",
        text: shareText(),
        url: window.location.href.split("#")[0],
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  await copyResult();
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const characters = [...text];
  const lines = [];
  let line = "";
  for (const character of characters) {
    const next = line + character;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = character;
      if (lines.length === maxLines) break;
    } else {
      line = next;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  lines.forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function drawShareRadar(context, scores, centerX, centerY, radius) {
  const canvasPoint = (index, factor) => {
    const angle = (-90 + index * (360 / 7)) * (Math.PI / 180);
    return { x: centerX + Math.cos(angle) * radius * factor, y: centerY + Math.sin(angle) * radius * factor };
  };

  context.save();
  for (const factor of [0.25, 0.5, 0.75, 1]) {
    context.beginPath();
    DIMENSION_ORDER.forEach((_, index) => {
      const point = canvasPoint(index, factor);
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.closePath();
    context.strokeStyle = factor === 1 ? "rgba(245,241,232,.28)" : "rgba(245,241,232,.11)";
    context.lineWidth = 2;
    context.stroke();
  }

  DIMENSION_ORDER.forEach((_, index) => {
    const point = canvasPoint(index, 1);
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(point.x, point.y);
    context.strokeStyle = "rgba(245,241,232,.09)";
    context.stroke();
  });

  const gradient = context.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
  gradient.addColorStop(0, "rgba(227,197,101,.48)");
  gradient.addColorStop(0.55, "rgba(167,122,218,.3)");
  gradient.addColorStop(1, "rgba(105,185,130,.34)");
  context.beginPath();
  DIMENSION_ORDER.forEach((key, index) => {
    const point = canvasPoint(index, scores[key] / 100);
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.closePath();
  context.fillStyle = gradient;
  context.fill();
  context.strokeStyle = "#ead190";
  context.lineWidth = 4;
  context.stroke();

  DIMENSION_ORDER.forEach((key, index) => {
    const dataPoint = canvasPoint(index, scores[key] / 100);
    context.beginPath();
    context.arc(dataPoint.x, dataPoint.y, 8, 0, Math.PI * 2);
    context.fillStyle = DIMENSIONS[key].color;
    context.fill();

    const labelPoint = canvasPoint(index, 1.22);
    context.fillStyle = "#b9b2a8";
    context.font = '500 25px "Microsoft YaHei", sans-serif';
    context.textAlign = labelPoint.x < centerX - 30 ? "right" : labelPoint.x > centerX + 30 ? "left" : "center";
    context.textBaseline = "middle";
    context.fillText(`${DIMENSIONS[key].name} ${scores[key]}`, labelPoint.x, labelPoint.y);
  });
  context.restore();
}

async function downloadResultCard() {
  if (!currentResult || !state.scores) return;
  const canvas = document.querySelector("#share-canvas");
  const context = canvas.getContext("2d");
  const { top, second, doubleCore } = currentResult;

  context.clearRect(0, 0, canvas.width, canvas.height);
  const background = context.createRadialGradient(850, 100, 30, 540, 550, 1000);
  background.addColorStop(0, "#2a2032");
  background.addColorStop(0.45, "#18151d");
  background.addColorStop(1, "#0f0e12");
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(245,241,232,.12)";
  context.lineWidth = 2;
  context.strokeRect(54, 54, 972, 1242);

  context.fillStyle = "#d5b56d";
  context.font = '600 22px "Microsoft YaHei", sans-serif';
  context.textAlign = "left";
  context.fillText("七 面 心 镜  ·  MY SEVEN FACETS", 90, 116);

  context.fillStyle = "#f5f1e8";
  context.font = '500 75px "Songti SC", serif';
  const title = doubleCore ? `${top.archetype} × ${second.archetype}` : top.archetype;
  const titleBottom = wrapCanvasText(context, title, 90, 215, 900, 96, 2);

  context.fillStyle = "#b9b2a8";
  context.font = '400 27px "Microsoft YaHei", sans-serif';
  context.fillText(
    doubleCore ? `最鲜明的两面：${top.name} · ${second.name}` : `主倾向：${top.name} · ${top.score}`,
    90,
    titleBottom + 18,
  );

  drawShareRadar(context, state.scores, 540, 725, 270);

  context.fillStyle = "rgba(245,241,232,.12)";
  context.fillRect(90, 1115, 900, 2);
  context.fillStyle = "#f5f1e8";
  context.font = '500 31px "Songti SC", serif';
  context.textAlign = "center";
  context.fillText("认识阴影，不是为了责备自己，而是为了更自由地选择。", 540, 1190);
  context.fillStyle = "#827b75";
  context.font = '400 20px "Microsoft YaHei", sans-serif';
  context.fillText("倾向值不是善恶判断 · 仅供娱乐与自我反思", 540, 1243);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    showToast("结果图生成失败，请稍后再试");
    return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `七面心镜-${top.name}-${new Date().toISOString().slice(0, 10)}.png`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("结果图已保存");
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function openMethod() {
  if (typeof methodDialog.showModal === "function") methodDialog.showModal();
  else methodDialog.setAttribute("open", "");
}

function closeMethod() {
  if (typeof methodDialog.close === "function") methodDialog.close();
  else methodDialog.removeAttribute("open");
}

answerOptions.forEach((option) => {
  option.addEventListener("click", () => selectAnswer(Number(option.dataset.value)));
});

startButton.addEventListener("click", startOrResume);
restartHomeButton.addEventListener("click", () => resetAssessment({ start: true }));
previousButton.addEventListener("click", goPrevious);
nextButton.addEventListener("click", goNext);
document.querySelector("#quiz-exit").addEventListener("click", () => showScreen("intro"));
document.querySelector("#retake-button").addEventListener("click", () => resetAssessment({ start: true }));
document.querySelector("#download-button").addEventListener("click", downloadResultCard);
document.querySelector("#share-button").addEventListener("click", shareResult);
document.querySelector("#copy-button").addEventListener("click", copyResult);
document.querySelector("#open-method").addEventListener("click", openMethod);
document.querySelector("#close-method").addEventListener("click", closeMethod);
document.querySelector("#dialog-start").addEventListener("click", () => {
  closeMethod();
  startOrResume();
});
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  closeMethod();
  showScreen("intro");
});

methodDialog.addEventListener("click", (event) => {
  if (event.target === methodDialog) closeMethod();
});

document.addEventListener("keydown", (event) => {
  if (quizScreen.hidden || methodDialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
  if (/^[1-5]$/.test(event.key)) {
    event.preventDefault();
    selectAnswer(Number(event.key));
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    goPrevious();
  } else if (event.key === "ArrowRight" && state.answers[state.currentIndex]) {
    event.preventDefault();
    goNext();
  }
});

window.addEventListener("pageshow", updateHomeState);

updateHomeState();
if (window.location.hash === "#result" && state.completed && state.scores) {
  renderResult(state.scores);
  showScreen("result", { focus: false });
} else if (window.location.hash === "#quiz" && !state.completed) {
  renderQuestion();
  showScreen("quiz", { focus: false });
} else {
  showScreen("intro", { focus: false });
}


