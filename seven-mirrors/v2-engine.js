export const V2_BANK_VERSION = 2;

export function seedToUint32(seed) {
  const value = String(seed ?? "");
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  hash += hash << 13;
  hash ^= hash >>> 7;
  hash += hash << 3;
  hash ^= hash >>> 17;
  hash += hash << 5;
  return hash >>> 0;
}

export function createSeededRandom(seed) {
  let state = seedToUint32(seed) || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSessionSeed(now = Date.now(), random = Math.random) {
  const randomPart = Math.floor(random() * 0xffffffff)
    .toString(36)
    .padStart(7, "0");
  return `${Number(now).toString(36)}-${randomPart}`;
}

export function shuffleSeeded(items, random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function getQuestionMap(bank) {
  return new Map(bank.map((question) => [question.id, question]));
}

function validateQuestion(question) {
  if (!question || typeof question.id !== "string" || !question.id) {
    throw new Error("题库中的每道题都需要稳定的字符串 ID");
  }
  if (!question.dimension || !question.family || !question.category) {
    throw new Error(`题目 ${question.id} 缺少 dimension、family 或 category`);
  }
  if (question.family !== "vice" && question.family !== "virtue") {
    throw new Error(`题目 ${question.id} 的 family 必须是 vice 或 virtue`);
  }
  if (question.direction !== 1 && question.direction !== -1) {
    throw new Error(`题目 ${question.id} 的 direction 必须是 1 或 -1`);
  }
}

export function validateQuestionBank(bank, dimensionOrder) {
  if (!Array.isArray(bank) || !bank.length) throw new Error("题库不能为空");
  if (!Array.isArray(dimensionOrder) || !dimensionOrder.length) {
    throw new Error("维度顺序不能为空");
  }
  if (new Set(dimensionOrder).size !== dimensionOrder.length) {
    throw new Error("维度顺序不能包含重复项");
  }
  const ids = new Set();
  const knownDimensions = new Set(dimensionOrder);
  for (const question of bank) {
    validateQuestion(question);
    if (ids.has(question.id)) throw new Error(`题目 ID 重复：${question.id}`);
    ids.add(question.id);
    if (!knownDimensions.has(question.dimension)) {
      throw new Error(`题目 ${question.id} 使用了未知维度 ${question.dimension}`);
    }
  }

  for (const dimension of dimensionOrder) {
    const pool = bank.filter((question) => question.dimension === dimension && question.active !== false);
    if (pool.length < 3) throw new Error(`维度 ${dimension} 至少需要 3 道启用题`);
    if (new Set(pool.map((question) => question.family)).size !== 1) {
      throw new Error(`维度 ${dimension} 不能同时属于宗罪与美德 family`);
    }
    if (!pool.some((question) => question.direction === 1) || !pool.some((question) => question.direction === -1)) {
      throw new Error(`维度 ${dimension} 必须同时包含正向题与反向题`);
    }
    const hasDifferentCategoryPair = pool.some(
      (first) =>
        first.direction === 1 &&
        pool.some(
          (second) => second.direction === -1 && second.category !== first.category,
        ),
    );
    if (!hasDifferentCategoryPair) {
      throw new Error(`维度 ${dimension} 无法抽出类别不同的一正一反两道核心题`);
    }
  }
  return true;
}

export function sequenceMeetsConstraints(questions, previousQuestions = []) {
  const combined = [...previousQuestions.slice(-2), ...questions];
  for (let index = previousQuestions.slice(-2).length; index < combined.length; index += 1) {
    const current = combined[index];
    const previous = combined[index - 1];
    if (previous && current.dimension === previous.dimension) return false;
    const twoBack = combined[index - 2];
    if (previous && twoBack && current.family === previous.family && current.family === twoBack.family) return false;
  }
  return true;
}

function familyTailState(previousQuestions) {
  const tail = previousQuestions.slice(-2);
  const lastFamily = tail.at(-1)?.family ?? null;
  if (!lastFamily) return { lastFamily: null, runLength: 0 };
  const runLength = tail.length === 2 && tail[0].family === lastFamily ? 2 : 1;
  return { lastFamily, runLength };
}

function createFamilySequence(questions, random, previousQuestions) {
  const families = ["vice", "virtue"];
  const initialCounts = families.map(
    (family) => questions.filter((question) => question.family === family).length,
  );
  const initialTail = familyTailState(previousQuestions);
  const failed = new Set();

  function visit(counts, lastFamily, runLength) {
    if (counts.every((count) => count === 0)) return [];
    const key = `${counts.join(",")}|${lastFamily ?? "-"}|${runLength}`;
    if (failed.has(key)) return null;

    const candidates = families
      .map((family, index) => ({ family, index, count: counts[index], tie: random() }))
      .filter(
        ({ family, count }) => count > 0 && !(family === lastFamily && runLength >= 2),
      )
      .sort((a, b) => b.count - a.count || a.tie - b.tie);

    for (const candidate of candidates) {
      const nextCounts = [...counts];
      nextCounts[candidate.index] -= 1;
      const nextRunLength = candidate.family === lastFamily ? runLength + 1 : 1;
      const suffix = visit(nextCounts, candidate.family, nextRunLength);
      if (suffix) return [candidate.family, ...suffix];
    }

    failed.add(key);
    return null;
  }

  return visit(initialCounts, initialTail.lastFamily, initialTail.runLength);
}

function assignQuestionsToFamilySequence(questions, familySequence, random, previousQuestions) {
  const groupKeys = [];
  const queues = new Map();
  for (const question of shuffleSeeded(questions, random)) {
    const key = `${question.family}:${question.dimension}`;
    if (!queues.has(key)) {
      queues.set(key, []);
      groupKeys.push(key);
    }
    queues.get(key).push(question);
  }

  const groups = groupKeys.map((key) => {
    const [family, ...dimensionParts] = key.split(":");
    return {
      key,
      family,
      dimension: dimensionParts.join(":"),
      count: queues.get(key).length,
      tie: random(),
    };
  });
  const failed = new Set();
  const initialLastDimension = previousQuestions.at(-1)?.dimension ?? null;

  function visit(position, counts, lastDimension) {
    if (position === familySequence.length) return [];
    const stateKey = `${position}|${lastDimension ?? "-"}|${counts.join(",")}`;
    if (failed.has(stateKey)) return null;

    const requiredFamily = familySequence[position];
    const candidates = groups
      .map((group, index) => ({ ...group, index, count: counts[index] }))
      .filter(
        (group) =>
          group.count > 0 &&
          group.family === requiredFamily &&
          group.dimension !== lastDimension,
      )
      .sort((a, b) => b.count - a.count || a.tie - b.tie);

    for (const candidate of candidates) {
      const nextCounts = [...counts];
      nextCounts[candidate.index] -= 1;
      const suffix = visit(position + 1, nextCounts, candidate.dimension);
      if (suffix) return [candidate.key, ...suffix];
    }

    failed.add(stateKey);
    return null;
  }

  const groupSequence = visit(
    0,
    groups.map((group) => group.count),
    initialLastDimension,
  );
  if (!groupSequence) return null;
  return groupSequence.map((key) => queues.get(key).pop());
}

export function arrangeQuestions(questions, random, previousQuestions = []) {
  if (!questions.length) return [];

  const familySequence = createFamilySequence(questions, random, previousQuestions);
  if (familySequence) {
    const arranged = assignQuestionsToFamilySequence(
      questions,
      familySequence,
      random,
      previousQuestions,
    );
    if (arranged && sequenceMeetsConstraints(arranged, previousQuestions)) return arranged;
  }

  // A highly one-sided calibration set can make the family rule mathematically
  // impossible. Keep dimension adjacency safe and minimise family runs instead.
  const remaining = shuffleSeeded(questions, random);
  const arranged = [];
  while (remaining.length) {
    const context = [...previousQuestions.slice(-2), ...arranged];
    const previous = context.at(-1);
    const twoBack = context.at(-2);
    let candidates = remaining.filter(
      (question) =>
        question.dimension !== previous?.dimension &&
        !(question.family === previous?.family && question.family === twoBack?.family),
    );
    if (!candidates.length) {
      candidates = remaining.filter((question) => question.dimension !== previous?.dimension);
    }
    if (!candidates.length) candidates = remaining;
    const selected = candidates[Math.floor(random() * candidates.length)];
    arranged.push(selected);
    remaining.splice(remaining.indexOf(selected), 1);
  }
  return arranged;
}

function chooseCoreForDimension(pool, random) {
  const direct = pool.filter((question) => question.direction === 1);
  const reverse = pool.filter((question) => question.direction === -1);
  if (!direct.length || !reverse.length) throw new Error(`维度 ${pool[0]?.dimension ?? "unknown"} 缺少正向或反向题`);

  const validPairs = direct.flatMap((directQuestion) =>
    reverse
      .filter((reverseQuestion) => reverseQuestion.category !== directQuestion.category)
      .map((reverseQuestion) => [directQuestion, reverseQuestion]),
  );
  if (!validPairs.length) {
    throw new Error(`维度 ${pool[0]?.dimension ?? "unknown"} 无法抽出类别不同的一正一反两道核心题`);
  }
  const pair = validPairs[Math.floor(random() * validPairs.length)];
  return random() < 0.5 ? pair : [...pair].reverse();
}

export function selectCoreQuestions(bank, dimensionOrder, seed) {
  validateQuestionBank(bank, dimensionOrder);
  const random = createSeededRandom(`${seed}:core`);
  const selected = [];
  for (const dimension of dimensionOrder) {
    const pool = bank.filter(
      (question) => question.active !== false && question.dimension === dimension,
    );
    selected.push(...chooseCoreForDimension(pool, random));
  }
  return arrangeQuestions(selected, random).map((question) => question.id);
}

export function createAssessmentSession(bank, dimensionOrder, seed = createSessionSeed()) {
  return {
    bankVersion: V2_BANK_VERSION,
    seed,
    phase: "core",
    coreQuestionIds: selectCoreQuestions(bank, dimensionOrder, seed),
    followUpQuestionIds: [],
    currentIndex: 0,
    answersById: {},
    scores: null,
    completedAt: null,
  };
}

export function correctedAnswer(question, answer) {
  const numeric = Number(answer);
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 5) {
    throw new Error(`题目 ${question.id} 缺少 1–5 的有效答案`);
  }
  return question.direction === -1 ? 6 - numeric : numeric;
}

export function averageToScore(average) {
  return Math.round(((average - 1) / 4) * 100);
}

function needsFollowUp(values) {
  const spread = Math.max(...values) - Math.min(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const score = averageToScore(average);
  const nearBoundary = Math.abs(score - 35) <= 10 || Math.abs(score - 65) <= 10;
  return spread >= 2 || nearBoundary;
}

function chooseFollowUpQuestion(pool, usedQuestions, random) {
  const usedIds = new Set(usedQuestions.map((question) => question.id));
  const usedCategories = new Set(usedQuestions.map((question) => question.category));
  const directionCounts = usedQuestions.reduce(
    (counts, question) => ({ ...counts, [question.direction]: (counts[question.direction] ?? 0) + 1 }),
    { 1: 0, [-1]: 0 },
  );
  const unused = pool.filter((question) => !usedIds.has(question.id));
  if (!unused.length) return null;

  const scored = unused.map((question) => {
    const categoryBonus = usedCategories.has(question.category) ? 0 : 4;
    const directionBonus = directionCounts[question.direction] < directionCounts[-question.direction] ? 2 : 0;
    return { question, weight: categoryBonus + directionBonus + random() };
  });
  scored.sort((a, b) => b.weight - a.weight);
  return scored[0].question;
}

export function selectFollowUpQuestions(
  bank,
  coreQuestionIds,
  answersById,
  dimensionOrder,
  seed,
) {
  const questionMap = getQuestionMap(bank);
  const coreQuestions = coreQuestionIds.map((id) => questionMap.get(id));
  if (coreQuestions.some((question) => !question)) throw new Error("核心题组包含当前题库中不存在的 ID");
  const random = createSeededRandom(`${seed}:calibration`);
  const selected = [];

  for (const dimension of dimensionOrder) {
    const used = coreQuestions.filter((question) => question.dimension === dimension);
    if (used.length !== 2) throw new Error(`维度 ${dimension} 的核心题数量必须为 2`);
    const values = used.map((question) => correctedAnswer(question, answersById[question.id]));
    if (!needsFollowUp(values)) continue;
    const pool = bank.filter(
      (question) => question.active !== false && question.dimension === dimension,
    );
    const followUp = chooseFollowUpQuestion(pool, used, random);
    if (!followUp) throw new Error(`维度 ${dimension} 没有可用的校准题`);
    selected.push(followUp);
  }

  const tail = coreQuestions.slice(-2);
  return arrangeQuestions(selected, random, tail).map((question) => question.id);
}

export function freezeCalibrationPhase(state, bank, dimensionOrder) {
  if (state.phase !== "core") return state;
  const followUpQuestionIds = selectFollowUpQuestions(
    bank,
    state.coreQuestionIds,
    state.answersById,
    dimensionOrder,
    state.seed,
  );
  return {
    ...state,
    phase: followUpQuestionIds.length ? "calibration" : "complete",
    followUpQuestionIds,
    currentIndex: state.coreQuestionIds.length,
  };
}

export function scoreDimensions(bank, questionIds, answersById, dimensionOrder) {
  const questionMap = getQuestionMap(bank);
  const buckets = Object.fromEntries(dimensionOrder.map((dimension) => [dimension, []]));

  for (const id of questionIds) {
    const question = questionMap.get(id);
    if (!question) throw new Error(`题库中找不到题目 ${id}`);
    buckets[question.dimension].push(correctedAnswer(question, answersById[id]));
  }

  return Object.fromEntries(
    dimensionOrder.map((dimension) => {
      const values = buckets[dimension];
      if (!values.length) throw new Error(`维度 ${dimension} 没有可计分答案`);
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      const range = Math.max(...values) - Math.min(...values);
      return [
        dimension,
        {
          score: averageToScore(average),
          average,
          count: values.length,
          consistency: Math.round(100 - (range / 4) * 100),
          values,
        },
      ];
    }),
  );
}

export function classifyPair(viceScore, virtueScore) {
  const balance = virtueScore - viceScore;
  const activation = (virtueScore + viceScore) / 2;
  let key = "balanced";
  let label = "动态平衡";
  if (viceScore >= 65 && virtueScore >= 65) {
    key = "dual_high";
    label = "双高张力";
  } else if (viceScore <= 34 && virtueScore <= 34) {
    key = "low_activation";
    label = "暂低激活";
  } else if (balance >= 20) {
    key = "virtue_led";
    label = "美德资源鲜明";
  } else if (balance <= -20) {
    key = "vice_led";
    label = "阴影拉力鲜明";
  }
  return { key, label, balance, activation };
}

export function rankDimensionScores(scoreDetails, dimensions, family, dimensionOrder) {
  return dimensionOrder
    .filter((key) => dimensions[key]?.family === family)
    .map((key) => ({ key, ...dimensions[key], ...scoreDetails[key] }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.count - a.count ||
        b.consistency - a.consistency ||
        dimensionOrder.indexOf(a.key) - dimensionOrder.indexOf(b.key),
    );
}

export function buildCombinationNarrative(topVice, topVirtue, relation) {
  const viceName = topVice.name ?? topVice.key;
  const virtueName = topVirtue.name ?? topVirtue.key;
  const viceArchetype = topVice.archetype ?? viceName;
  const virtueArchetype = topVirtue.archetype ?? virtueName;
  const relationLabel = relation === "same_axis" ? "同轴映照" : "交叉双核";
  const title = `${viceArchetype} × ${virtueArchetype}`;
  const explanation =
    relation === "same_axis"
      ? `${viceName}的阴影拉力与${virtueName}的内在资源来自同一条张力轴；它们既会彼此拉扯，也能互相校准。`
      : `${viceName}是此刻较强的阴影拉力，${virtueName}则是你更常调用的内在资源；两股力量会在不同情境里交替主导。`;
  const shareText = `我的七面心镜人格是「${title}」｜${relationLabel}：${viceName} ${topVice.score}，${virtueName} ${topVirtue.score}。`;
  return {
    combinationKey: `${topVice.key}:${topVirtue.key}`,
    title,
    relationLabel,
    explanation,
    shareText,
  };
}

export function buildJointResult({
  bank,
  questionIds,
  answersById,
  dimensionOrder,
  dimensions,
  pairs,
}) {
  const pairList = Array.isArray(pairs)
    ? pairs
    : Object.entries(pairs).map(([key, pair]) => ({ key, ...pair }));
  const scoreDetails = scoreDimensions(bank, questionIds, answersById, dimensionOrder);
  const viceRanking = rankDimensionScores(scoreDetails, dimensions, "vice", dimensionOrder);
  const virtueRanking = rankDimensionScores(scoreDetails, dimensions, "virtue", dimensionOrder);
  if (!viceRanking.length || !virtueRanking.length) throw new Error("结果需要同时包含宗罪与美德维度");

  const pairResults = pairList.map((pair) => {
    const vice = scoreDetails[pair.vice];
    const virtue = scoreDetails[pair.virtue];
    if (!vice || !virtue) throw new Error(`配对 ${pair.key} 引用了未知维度`);
    const tension = classifyPair(vice.score, virtue.score);
    return {
      ...pair,
      pairKey: pair.key,
      viceScore: vice.score,
      virtueScore: virtue.score,
      ...tension,
      stateKey: tension.key,
      key: pair.key,
    };
  });

  const topVice = viceRanking[0];
  const topVirtue = virtueRanking[0];
  const vicePair = pairList.find((pair) => pair.vice === topVice.key);
  const virtuePair = pairList.find((pair) => pair.virtue === topVirtue.key);
  const relation = vicePair?.key === virtuePair?.key ? "same_axis" : "cross_core";
  const narrative = buildCombinationNarrative(topVice, topVirtue, relation);

  return {
    scoreDetails,
    scores: Object.fromEntries(
      Object.entries(scoreDetails).map(([key, detail]) => [key, detail.score]),
    ),
    pairResults,
    viceRanking,
    virtueRanking,
    topVice,
    topVirtue,
    relation,
    ...narrative,
  };
}

