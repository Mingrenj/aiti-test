import {
  DIMENSIONS_V2,
  DIMENSION_ORDER_V2,
  PAIRS,
  PAIR_ORDER,
  QUESTION_BANK_V2,
  VICE_ORDER,
  VIRTUE_ORDER,
} from "./assessment.js";
import {
  buildJointResult,
  createAssessmentSession,
  freezeCalibrationPhase,
} from "./v2-engine.js";
import {
  buildJointActions,
  getCombinationNarrative,
  getShareCopy,
} from "./v2-narrative.js";
import {
  V1_STORAGE_KEY,
  V2_STORAGE_KEY,
  beginFrozenAnswerEdit,
  classifyLegacyState,
  parseStoredJson,
  restoreV2Session,
} from "./v2-state.js";

const CORE_COUNT = 28;
const ENVOY_PATH = "./assets/envoys";
const $ = (id) => document.getElementById(id);
const questionById = new Map(QUESTION_BANK_V2.map((question) => [question.id, question]));
const categoryLabels = { self: "自述题", scenario: "情境题", regulation: "调节题" };
const screens = ["intro-screen", "quiz-screen", "calibration-screen", "result-screen"];

let session = readSession();
let currentResult = session?.phase === "complete" ? session.scores : null;
let radarFrame = 0;
let toastTimer = 0;

function readStorage(key) {
  try {
    return parseStoredJson(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function readSession() {
  try {
    return restoreV2Session(localStorage.getItem(V2_STORAGE_KEY), questionById.keys(), CORE_COUNT);
  } catch {
    return null;
  }
}

function saveSession() {
  if (!session) return;
  try {
    localStorage.setItem(V2_STORAGE_KEY, JSON.stringify(session));
  } catch {
    showToast("浏览器未能保存进度；本次测试仍可继续。", true);
  }
}

function setRoute(hash) {
  const next = `${location.pathname}${location.search}${hash}`;
  history.replaceState(null, "", next);
}

function setScreen(id, hash = null) {
  for (const screenId of screens) {
    const element = $(screenId);
    const active = screenId === id;
    element.hidden = !active;
    element.classList.toggle("is-active", active);
  }
  document.body.dataset.screen = id.replace("-screen", "");
  if (hash) setRoute(hash);
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function showToast(message, isError = false) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function getLegacySummary() {
  return classifyLegacyState(readStorage(V1_STORAGE_KEY));
}

function answeredCount() {
  return session ? Object.keys(session.answersById).length : 0;
}

function updateHome() {
  const start = $("start-button");
  const resume = $("continue-button");
  const restart = $("restart-home-button");
  const note = $("resume-note");
  const legacyLink = $("legacy-result-link");

  start.classList.remove("is-hidden");
  resume.classList.add("is-hidden");
  restart.classList.add("is-hidden");
  note.classList.add("is-hidden");

  if (session?.phase === "complete" && session.scores) {
    start.querySelector("span:first-child").textContent = "查看本次结果";
    restart.classList.remove("is-hidden");
    note.textContent = "本次镜面已经完成，你也可以生成一组全新的随机题。";
    note.classList.remove("is-hidden");
  } else if (session) {
    start.classList.add("is-hidden");
    resume.classList.remove("is-hidden");
    restart.classList.remove("is-hidden");
    const total = session.phase === "core" ? CORE_COUNT : CORE_COUNT + session.followUpQuestionIds.length;
    note.textContent = `已在本机保存 ${answeredCount()} / ${total} 道回答，题组和顺序不会因刷新改变。`;
    note.classList.remove("is-hidden");
  } else {
    start.querySelector("span:first-child").textContent = "开始照见自己";
  }

  const legacy = getLegacySummary();
  legacyLink.classList.toggle("is-hidden", legacy?.type !== "complete");
  if (legacy?.type === "progress" && !session) {
    note.textContent = "检测到未完成的旧版测试。旧题无法准确迁移到十四维模型，请从新版重新开始。";
    note.classList.remove("is-hidden");
  }
}

function showHome() {
  updateHome();
  setScreen("intro-screen", "#home");
}

function beginNewSession({ confirmReplace = false } = {}) {
  if (confirmReplace && session && !window.confirm("新题组会替换当前新版进度。旧版结果不会被删除，继续吗？")) return;
  session = createAssessmentSession(QUESTION_BANK_V2, DIMENSION_ORDER_V2);
  currentResult = null;
  saveSession();
  renderQuestion(0);
}

function resumeSession() {
  if (!session) return beginNewSession();
  if (session.phase === "complete" && session.scores) return renderResult();
  const sequence = getQuestionIds();
  renderQuestion(Math.min(session.currentIndex, Math.max(0, sequence.length - 1)));
}

function getQuestionIds() {
  if (!session) return [];
  return [...session.coreQuestionIds, ...session.followUpQuestionIds];
}

function renderQuestion(index = session?.currentIndex ?? 0) {
  if (!session) return showHome();
  const ids = getQuestionIds();
  const maxIndex = Math.max(0, ids.length - 1);
  session.currentIndex = Math.min(Math.max(index, 0), maxIndex);
  const question = questionById.get(ids[session.currentIndex]);
  if (!question) return showToast("题目载入失败，请生成新题组。", true);
  saveSession();
  setScreen("quiz-screen", "#quiz");

  const total = session.phase === "core" ? CORE_COUNT : ids.length;
  const number = session.currentIndex + 1;
  const inCore = session.currentIndex < CORE_COUNT;
  $("phase-label").textContent = inCore ? "第一阶段 · 认识轮廓" : "第二阶段 · 校准细节";
  $("progress-text").textContent = `${String(number).padStart(2, "0")} / ${total}`;
  $("progress-track").setAttribute("aria-valuemax", String(total));
  $("progress-track").setAttribute("aria-valuenow", String(number));
  $("progress-bar").style.width = `${(number / total) * 100}%`;
  $("question-family").textContent = question.family === "vice" ? "阴影拉力" : "美德资源";
  $("question-category").textContent = categoryLabels[question.category] ?? "自我观察";
  $("question-number").textContent = String(number).padStart(2, "0");
  $("question-text").textContent = question.text;
  $("question-status").textContent = inCore
    ? "请按近三个月的真实状态作答"
    : "这道题用于确认轮廓，不代表回答得好或不好";

  const selected = session.answersById[question.id] ?? null;
  for (const option of document.querySelectorAll(".answer-option")) {
    const active = Number(option.dataset.value) === selected;
    option.classList.toggle("is-selected", active);
    option.setAttribute("aria-checked", String(active));
  }
  $("previous-button").disabled = session.currentIndex === 0;
  $("next-button").disabled = selected === null;
  $("next-button").textContent = number === total
    ? (session.phase === "core" ? "进入校准 →" : "查看结果 →")
    : "下一题 →";
}

function answerCurrent(value) {
  if (!session) return;
  const id = getQuestionIds()[session.currentIndex];
  if (!id || value < 1 || value > 5) return;
  session.answersById[id] = value;
  saveSession();
  renderQuestion(session.currentIndex);
  $("next-button").focus({ preventScroll: true });
}

function previousQuestion() {
  if (session?.currentIndex > 0) renderQuestion(session.currentIndex - 1);
}

function nextQuestion() {
  if (!session) return;
  const ids = getQuestionIds();
  const currentId = ids[session.currentIndex];
  if (!session.answersById[currentId]) return showToast("请先选择一个最接近的答案。", true);
  if (session.currentIndex < ids.length - 1) return renderQuestion(session.currentIndex + 1);
  if (session.phase === "core") return runCalibration();
  finalizeAssessment();
}

function runCalibration() {
  setScreen("calibration-screen");
  $("calibration-count").textContent = "正在检查 14 个维度…";
  window.setTimeout(() => {
    session = freezeCalibrationPhase(session, QUESTION_BANK_V2, DIMENSION_ORDER_V2);
    saveSession();
    const count = session.followUpQuestionIds.length;
    $("calibration-count").textContent = count
      ? `需要再确认 ${count} 个维度 · 总题数 ${CORE_COUNT + count}`
      : "轮廓稳定 · 无需追加题";
    window.setTimeout(() => {
      if (count) renderQuestion(CORE_COUNT);
      else finalizeAssessment();
    }, 650);
  }, 650);
}

function finalizeAssessment() {
  if (!session) return;
  const questionIds = getQuestionIds();
  if (questionIds.some((id) => !session.answersById[id])) {
    const firstMissing = questionIds.findIndex((id) => !session.answersById[id]);
    showToast("还有题目没有回答。", true);
    return renderQuestion(firstMissing);
  }

  const result = buildJointResult({
    bank: QUESTION_BANK_V2,
    questionIds,
    answersById: session.answersById,
    dimensionOrder: DIMENSION_ORDER_V2,
    dimensions: DIMENSIONS_V2,
    pairs: PAIRS,
  });
  const narrative = getCombinationNarrative(result.topVice.key, result.topVirtue.key, {
    viceScore: result.topVice.score,
    virtueScore: result.topVirtue.score,
  });
  const actionPairs = result.pairResults.map((pair) => ({
    ...pair,
    pairKey: pair.pairKey,
    state: pair.label,
  }));
  const actions = buildJointActions({
    scores: result.scores,
    pairs: actionPairs,
    dominantVice: result.topVice.key,
    dominantVirtue: result.topVirtue.key,
  });
  currentResult = { ...result, narrative, actions };
  session = {
    ...session,
    phase: "complete",
    currentIndex: questionIds.length,
    scores: currentResult,
    completedAt: new Date().toISOString(),
  };
  saveSession();
  renderResult();
}

function renderResult() {
  if (!session?.scores) return resumeSession();
  currentResult = session.scores;
  const result = currentResult;
  const narrative = result.narrative ?? getCombinationNarrative(result.topVice.key, result.topVirtue.key, {
    viceScore: result.topVice.score,
    virtueScore: result.topVirtue.score,
  });
  result.narrative = narrative;
  if (!result.actions) {
    result.actions = buildJointActions({
      scores: result.scores,
      pairs: result.pairResults.map((pair) => ({ ...pair, pairKey: pair.pairKey, state: pair.label })),
      dominantVice: result.topVice.key,
      dominantVirtue: result.topVirtue.key,
    });
  }

  $("relation-badge").textContent = narrative.modeLabel;
  $("result-title").textContent = narrative.title;
  $("result-summary").textContent = narrative.summary;
  $("top-vice-name").textContent = `${result.topVice.name} · ${result.topVice.softName}`;
  $("top-vice-score").textContent = result.topVice.score;
  $("top-virtue-name").textContent = `${result.topVirtue.name} · ${result.topVirtue.softName}`;
  $("top-virtue-score").textContent = result.topVirtue.score;
  $("vice-envoy-title").textContent = result.topVice.archetype;
  $("virtue-envoy-title").textContent = result.topVirtue.archetype;
  setEnvoy("vice", result.topVice);
  setEnvoy("virtue", result.topVirtue);
  renderScoreLedger(result);
  renderTensions(result);
  renderDimensions(result);
  renderActions(result.actions);
  $("action-status").textContent = "";
  setScreen("result-screen", "#result");
  requestAnimationFrame(() => scheduleRadar());
}

function setEnvoy(family, dimension) {
  const card = $(`${family}-envoy`);
  const image = $(`${family}-envoy-image`);
  card.dataset.envoyKey = dimension.key;
  card.classList.remove("is-fallback", "is-loaded");
  image.alt = `${dimension.name} · ${dimension.archetype}光影线稿`;
  image.fetchPriority = "high";
  image.onload = () => card.classList.add("is-loaded");
  image.onerror = () => {
    card.classList.add("is-fallback");
    image.removeAttribute("src");
  };
  image.src = `${ENVOY_PATH}/${dimension.key}.webp`;
  if (image.complete && image.naturalWidth) card.classList.add("is-loaded");
}

function renderScoreLedger(result) {
  const ledger = $("score-ledger");
  ledger.replaceChildren();
  for (const pairKey of PAIR_ORDER) {
    const pair = PAIRS[pairKey];
    const vice = DIMENSIONS_V2[pair.vice];
    const virtue = DIMENSIONS_V2[pair.virtue];
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `<div><strong>${result.scores[pair.vice]}</strong><small>${vice.name} · ${vice.softName}</small></div><span class="pair-line" aria-hidden="true"></span><div><strong>${result.scores[pair.virtue]}</strong><small>${virtue.name} · ${virtue.softName}</small></div>`;
    ledger.append(row);
  }
}

function tensionDescription(pair) {
  const vice = DIMENSIONS_V2[pair.vice];
  const virtue = DIMENSIONS_V2[pair.virtue];
  const copy = {
    dual_high: `两端都很活跃：${vice.name}带来${vice.gift.replace(/。$/, "")}，${virtue.name}则提供校准。重点不是压低任一端，而是让它们按情境分工。`,
    low_activation: `这条轴此刻较安静，未必代表缺少能力。可以留意什么情境会唤起${vice.softName}，又何时需要${virtue.softName}。`,
    virtue_led: `${virtue.name}是这条轴上较容易调用的资源。保留它的同时，也别把${vice.name}背后的真实需要完全忽略。`,
    vice_led: `${vice.name}的拉力更鲜明。先理解它在保护什么，再用${virtue.name}提供一个不伤害长期目标的出口。`,
    balanced: `两端处于动态协商：你可能依情境在${vice.softName}与${virtue.softName}之间切换。观察触发条件比追求固定标签更有用。`,
  };
  return copy[pair.stateKey] ?? copy.balanced;
}

function renderTensions(result) {
  const grid = $("tension-grid");
  const template = $("tension-card-template");
  grid.replaceChildren();
  result.pairResults.forEach((item, index) => {
    const pair = PAIRS[item.key];
    const vice = DIMENSIONS_V2[pair.vice];
    const virtue = DIMENSIONS_V2[pair.virtue];
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".tension-card");
    card.dataset.state = item.stateKey;
    fragment.querySelector(".tension-index").textContent = `0${index + 1} / ${pair.name}`;
    fragment.querySelector(".tension-state").textContent = item.label;
    fragment.querySelector(".tension-names").textContent = `${vice.name} · ${vice.softName} ↔ ${virtue.name} · ${virtue.softName}`;
    fragment.querySelector(".vice-fill").style.opacity = String(Math.max(.18, item.viceScore / 100));
    fragment.querySelector(".virtue-fill").style.opacity = String(Math.max(.18, item.virtueScore / 100));
    fragment.querySelector(".tension-vice-score").textContent = item.viceScore;
    fragment.querySelector(".tension-balance").textContent = `${Number.isInteger(item.activation) ? item.activation : item.activation.toFixed(1)} · ${item.balance > 0 ? "+" : ""}${item.balance}`;
    fragment.querySelector(".tension-virtue-score").textContent = item.virtueScore;
    fragment.querySelector(".tension-copy").textContent = tensionDescription({ ...item, ...pair });
    grid.append(fragment);
  });
}

function scoreBand(score) {
  return score <= 34 ? "low" : score <= 64 ? "mid" : "high";
}

function renderDimensions(result) {
  renderFamilyDimensions("vice", VICE_ORDER, $("vice-dimensions"), result);
  renderFamilyDimensions("virtue", VIRTUE_ORDER, $("virtue-dimensions"), result);
}

function renderFamilyDimensions(family, order, container, result) {
  const template = $("dimension-card-template");
  container.replaceChildren();
  for (const key of order) {
    const meta = DIMENSIONS_V2[key];
    const score = result.scores[key];
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".dimension-card");
    card.dataset.dimension = key;
    card.dataset.family = family;
    const image = fragment.querySelector(".dimension-art img");
    image.src = `${ENVOY_PATH}/${key}.webp`;
    image.onerror = () => image.remove();
    fragment.querySelector(".dimension-sigil").textContent = meta.icon;
    fragment.querySelector(".dimension-family").textContent = family === "vice" ? "阴影拉力" : "美德资源";
    fragment.querySelector(".dimension-name").textContent = `${meta.name} · ${meta.softName}`;
    fragment.querySelector(".dimension-score").textContent = score;
    fragment.querySelector(".dimension-description").textContent = meta.description;
    fragment.querySelector(".dimension-gift").textContent = meta.gift;
    fragment.querySelector(".dimension-risk").textContent = meta.risk;
    fragment.querySelector(".dimension-advice").textContent = meta.advice[scoreBand(score)];
    container.append(fragment);
  }
}

function renderActions(actions) {
  const list = $("joint-actions");
  list.replaceChildren();
  for (const action of actions) {
    const item = document.createElement("li");
    const title = document.createElement("h3");
    const text = document.createElement("p");
    title.textContent = action.title;
    text.textContent = action.text;
    item.append(title, text);
    list.append(item);
  }
}

function radarPoint(index, value, center, radius) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / PAIR_ORDER.length;
  const distance = radius * (value / 100);
  return [center + Math.cos(angle) * distance, center + Math.sin(angle) * distance];
}

function scheduleRadar() {
  cancelAnimationFrame(radarFrame);
  radarFrame = requestAnimationFrame(drawRadar);
}

function drawRadar() {
  if (!currentResult || $("result-screen").hidden) return;
  const canvas = $("radar-canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    $("radar-fallback").hidden = false;
    return;
  }
  $("radar-fallback").hidden = true;
  const cssSize = Math.max(280, Math.min(canvas.parentElement.clientWidth, 760));
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssSize * ratio);
  canvas.height = Math.round(cssSize * ratio);
  canvas.style.width = `${cssSize}px`;
  canvas.style.height = `${cssSize}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, cssSize, cssSize);
  const center = cssSize / 2;
  const radius = cssSize * .335;

  context.lineWidth = 1;
  for (let ring = 1; ring <= 5; ring += 1) {
    context.beginPath();
    PAIR_ORDER.forEach((_, index) => {
      const [x, y] = radarPoint(index, ring * 20, center, radius);
      if (!index) context.moveTo(x, y); else context.lineTo(x, y);
    });
    context.closePath();
    context.strokeStyle = ring === 5 ? "rgba(243,238,229,.22)" : "rgba(243,238,229,.09)";
    context.stroke();
  }

  PAIR_ORDER.forEach((pairKey, index) => {
    const [x, y] = radarPoint(index, 100, center, radius);
    context.beginPath();
    context.moveTo(center, center);
    context.lineTo(x, y);
    context.strokeStyle = "rgba(243,238,229,.1)";
    context.stroke();
    const [labelX, labelY] = radarPoint(index, 119, center, radius);
    const pair = PAIRS[pairKey];
    context.fillStyle = "rgba(243,238,229,.72)";
    context.font = `${Math.max(9, cssSize * .015)}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    context.textAlign = Math.abs(labelX - center) < 8 ? "center" : labelX < center ? "right" : "left";
    context.textBaseline = "middle";
    context.fillText(`${DIMENSIONS_V2[pair.vice].name} · ${DIMENSIONS_V2[pair.virtue].name}`, labelX, labelY);
  });

  if ($("toggle-vice").checked) {
    drawRadarTrace(context, currentResult.pairResults.map((pair) => pair.viceScore), center, radius, "#df9a55", "rgba(207,87,72,.12)");
  }
  if ($("toggle-virtue").checked) {
    drawRadarTrace(context, currentResult.pairResults.map((pair) => pair.virtueScore), center, radius, "#a9e5e4", "rgba(115,199,213,.1)");
  }
}

function drawRadarTrace(context, values, center, radius, stroke, fill) {
  context.save();
  context.beginPath();
  values.forEach((value, index) => {
    const [x, y] = radarPoint(index, value, center, radius);
    if (!index) context.moveTo(x, y); else context.lineTo(x, y);
  });
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = 2;
  context.shadowColor = stroke;
  context.shadowBlur = 10;
  context.stroke();
  context.shadowBlur = 0;
  values.forEach((value, index) => {
    const [x, y] = radarPoint(index, value, center, radius);
    context.beginPath();
    context.arc(x, y, 3, 0, Math.PI * 2);
    context.fillStyle = stroke;
    context.fill();
  });
  context.restore();
}

function loadEnvoy(key) {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = async () => {
      try { await image.decode(); } catch { /* The loaded pixels are still usable. */ }
      resolve(image);
    };
    image.onerror = () => resolve(null);
    image.src = `${ENVOY_PATH}/${key}.webp`;
  });
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const characters = [...text];
  const lines = [];
  let line = "";
  for (const character of characters) {
    if (context.measureText(line + character).width > maxWidth && line) {
      lines.push(line);
      line = character;
      if (lines.length === maxLines - 1) break;
    } else line += character;
  }
  const consumed = lines.join("").length;
  if (consumed < characters.length) line = `${line.slice(0, Math.max(0, line.length - 1))}…`;
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
  return lines.length * lineHeight;
}

function drawImageContain(context, image, x, y, width, height) {
  if (!image) return false;
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  return true;
}

function drawFallbackSigil(context, x, y, width, height, color, seed) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  context.save();
  context.translate(centerX, centerY);
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.shadowColor = color;
  context.shadowBlur = 16;
  for (let index = 0; index < 7; index += 1) {
    const angle = (index * Math.PI) / 7 + seed.length * .03;
    context.rotate(angle);
    context.strokeRect(-width * .19, -height * .22, width * .38, height * .44);
  }
  context.restore();
}

async function createShareBlob() {
  if (!currentResult) throw new Error("没有可分享的结果");
  // Export begins only after both protagonist resources have loaded or explicitly failed.
  const [viceImage, virtueImage] = await Promise.all([
    loadEnvoy(currentResult.topVice.key),
    loadEnvoy(currentResult.topVirtue.key),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  const background = context.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, "#08080c");
  background.addColorStop(.55, "#140f16");
  background.addColorStop(1, "#071014");
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1350);
  context.strokeStyle = "rgba(243,238,229,.12)";
  context.strokeRect(42, 42, 996, 1266);
  context.beginPath();
  context.moveTo(540, 280);
  context.lineTo(540, 1040);
  context.stroke();

  context.fillStyle = "#dfb66b";
  context.font = "20px Arial, sans-serif";
  context.letterSpacing = "4px";
  context.fillText("SEVEN MIRRORS · LIGHT / SHADOW", 72, 96);
  context.fillStyle = "rgba(243,238,229,.55)";
  context.font = "18px Arial, sans-serif";
  context.fillText(currentResult.narrative.modeLabel, 72, 142);
  context.fillStyle = "#f3eee5";
  context.font = "54px 'Songti SC', 'SimSun', serif";
  wrapCanvasText(context, currentResult.narrative.title, 72, 214, 930, 68, 2);

  const leftPanel = { x: 54, y: 310, width: 472, height: 650 };
  const rightPanel = { x: 554, y: 310, width: 472, height: 650 };
  context.fillStyle = "rgba(223,154,85,.045)";
  context.fillRect(leftPanel.x, leftPanel.y, leftPanel.width, leftPanel.height);
  context.fillStyle = "rgba(115,199,213,.045)";
  context.fillRect(rightPanel.x, rightPanel.y, rightPanel.width, rightPanel.height);
  context.strokeStyle = "rgba(243,238,229,.11)";
  context.strokeRect(leftPanel.x, leftPanel.y, leftPanel.width, leftPanel.height);
  context.strokeRect(rightPanel.x, rightPanel.y, rightPanel.width, rightPanel.height);

  if (!drawImageContain(context, viceImage, 72, 330, 436, 478)) drawFallbackSigil(context, 72, 330, 436, 478, "#df9a55", currentResult.topVice.key);
  if (!drawImageContain(context, virtueImage, 572, 330, 436, 478)) drawFallbackSigil(context, 572, 330, 436, 478, "#9adfe1", currentResult.topVirtue.key);
  context.fillStyle = "rgba(243,238,229,.55)";
  context.font = "16px Arial, sans-serif";
  context.fillText("SHADOW ENVOY", 84, 846);
  context.fillText("VIRTUE ENVOY", 584, 846);
  context.fillStyle = "#f3eee5";
  context.font = "31px 'Songti SC', 'SimSun', serif";
  context.fillText(`${currentResult.topVice.name} · ${currentResult.topVice.archetype}`, 84, 892);
  context.fillText(`${currentResult.topVirtue.name} · ${currentResult.topVirtue.archetype}`, 584, 892);
  context.fillStyle = "#df9a55";
  context.font = "56px 'Songti SC', 'SimSun', serif";
  context.fillText(String(currentResult.topVice.score), 84, 944);
  context.fillStyle = "#9adfe1";
  context.fillText(String(currentResult.topVirtue.score), 584, 944);

  context.fillStyle = "rgba(243,238,229,.7)";
  context.font = "22px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  wrapCanvasText(context, currentResult.narrative.summary, 72, 1042, 936, 38, 4);
  context.strokeStyle = "rgba(243,238,229,.12)";
  context.beginPath();
  context.moveTo(72, 1222);
  context.lineTo(1008, 1222);
  context.stroke();
  context.fillStyle = "rgba(243,238,229,.45)";
  context.font = "17px Arial, sans-serif";
  context.fillText("14 个独立维度 · 本地测评 · 非善恶或医学结论", 72, 1265);
  context.textAlign = "right";
  context.fillText("七面心镜", 1008, 1265);

  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG 导出失败")), "image/png"));
}

async function downloadResult() {
  $("download-button").disabled = true;
  $("action-status").textContent = "正在等待双使者资源并生成 1080 × 1350 图片…";
  try {
    const blob = await createShareBlob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `七面心镜-${currentResult.topVice.key}-${currentResult.topVirtue.key}.png`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    $("action-status").textContent = "结果图已生成。";
  } catch (error) {
    $("action-status").textContent = "图片生成失败，请稍后再试。";
    console.error(error);
  } finally {
    $("download-button").disabled = false;
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function shareCopy() {
  return `${getShareCopy(currentResult.topVice.key, currentResult.topVirtue.key, currentResult.scores)}\n${location.href.split("#")[0]}`;
}

async function copyResult() {
  try {
    await copyText(shareCopy());
    $("action-status").textContent = "结果文案已复制。";
  } catch {
    $("action-status").textContent = "复制失败，请手动选择结果文字。";
  }
}

async function shareResult() {
  if (!navigator.share) return copyResult();
  $("share-button").disabled = true;
  try {
    const blob = await createShareBlob();
    const file = new File([blob], "seven-mirrors.png", { type: "image/png" });
    const data = { title: "七面心镜", text: shareCopy(), url: location.href.split("#")[0] };
    if (navigator.canShare?.({ files: [file] })) data.files = [file];
    await navigator.share(data);
    $("action-status").textContent = "分享面板已打开。";
  } catch (error) {
    if (error?.name !== "AbortError") await copyResult();
  } finally {
    $("share-button").disabled = false;
  }
}

function editAnswers() {
  if (!session?.scores) return;
  session = beginFrozenAnswerEdit(session);
  currentResult = null;
  saveSession();
  renderQuestion(0);
}

function openDialog(id) {
  const dialog = $(id);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function bindEvents() {
  $("start-button").addEventListener("click", () => session?.phase === "complete" ? renderResult() : beginNewSession());
  $("continue-button").addEventListener("click", resumeSession);
  $("restart-home-button").addEventListener("click", () => beginNewSession({ confirmReplace: true }));
  $("restart-result-button").addEventListener("click", () => beginNewSession());
  $("quiz-exit").addEventListener("click", showHome);
  $("previous-button").addEventListener("click", previousQuestion);
  $("next-button").addEventListener("click", nextQuestion);
  $("answer-scale").addEventListener("click", (event) => {
    const option = event.target.closest(".answer-option");
    if (option) answerCurrent(Number(option.dataset.value));
  });
  $("toggle-vice").addEventListener("change", scheduleRadar);
  $("toggle-virtue").addEventListener("change", scheduleRadar);
  $("download-button").addEventListener("click", downloadResult);
  $("copy-button").addEventListener("click", copyResult);
  $("share-button").addEventListener("click", shareResult);
  $("edit-answers-button").addEventListener("click", editAnswers);
  $("open-method").addEventListener("click", () => openDialog("method-dialog"));
  $("open-tradition").addEventListener("click", () => openDialog("tradition-dialog"));
  $("back-home-link").addEventListener("click", (event) => { event.preventDefault(); showHome(); });
  document.querySelector(".brand").addEventListener("click", (event) => { event.preventDefault(); showHome(); });

  window.addEventListener("resize", scheduleRadar, { passive: true });
  window.addEventListener("hashchange", () => {
    if (location.hash === "#home" || !location.hash) showHome();
    else if (location.hash === "#result" && session?.scores) renderResult();
    else if (location.hash === "#quiz" && session && session.phase !== "complete") resumeSession();
  });
  document.addEventListener("keydown", (event) => {
    if ($("quiz-screen").hidden || event.altKey || event.ctrlKey || event.metaKey) return;
    if (/^[1-5]$/.test(event.key)) {
      event.preventDefault();
      answerCurrent(Number(event.key));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousQuestion();
    } else if (event.key === "ArrowRight" && !$("next-button").disabled) {
      event.preventDefault();
      nextQuestion();
    }
  });
}

bindEvents();
if (location.hash === "#result" && session?.scores) renderResult();
else if (location.hash === "#quiz" && session && session.phase !== "complete") resumeSession();
else showHome();
