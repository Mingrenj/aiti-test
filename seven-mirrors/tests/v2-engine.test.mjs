import assert from "node:assert/strict";
import test from "node:test";
import {
  arrangeQuestions,
  buildCombinationNarrative,
  buildJointResult,
  classifyPair,
  createAssessmentSession,
  createSeededRandom,
  freezeCalibrationPhase,
  rankDimensionScores,
  scoreDimensions,
  selectCoreQuestions,
  selectFollowUpQuestions,
  sequenceMeetsConstraints,
  validateQuestionBank,
} from "../v2-engine.js";

const viceKeys = Array.from({ length: 7 }, (_, index) => `vice_${index}`);
const virtueKeys = Array.from({ length: 7 }, (_, index) => `virtue_${index}`);
const dimensionOrder = [...viceKeys, ...virtueKeys];
const categories = ["self", "scenario", "regulation"];

const bank = dimensionOrder.flatMap((dimension, dimensionIndex) =>
  Array.from({ length: 7 }, (_, questionIndex) => ({
    id: `${dimension}-${questionIndex}`,
    family: dimension.startsWith("vice") ? "vice" : "virtue",
    dimension,
    pairKey: `pair_${dimensionIndex % 7}`,
    category: categories[questionIndex % categories.length],
    direction: questionIndex % 2 === 0 ? 1 : -1,
    text: `${dimension} question ${questionIndex}`,
    version: 2,
    active: true,
  })),
);

const dimensions = Object.fromEntries(
  dimensionOrder.map((key) => [
    key,
    {
      name: key,
      archetype: `archetype_${key}`,
      family: key.startsWith("vice") ? "vice" : "virtue",
    },
  ]),
);

const pairs = Array.from({ length: 7 }, (_, index) => ({
  key: `pair_${index}`,
  vice: `vice_${index}`,
  virtue: `virtue_${index}`,
}));

function answerForCorrected(question, corrected) {
  return question.direction === -1 ? 6 - corrected : corrected;
}

test("题库验证要求稳定 ID、14 维覆盖及正反向题", () => {
  assert.equal(validateQuestionBank(bank, dimensionOrder), true);
  assert.throws(
    () => validateQuestionBank([...bank, { ...bank[0] }], dimensionOrder),
    /ID 重复/,
  );
});

test("相同 seed 生成相同核心题组，不同 seed 产生变化", () => {
  const first = selectCoreQuestions(bank, dimensionOrder, "mirror-a");
  const repeated = selectCoreQuestions(bank, dimensionOrder, "mirror-a");
  const different = selectCoreQuestions(bank, dimensionOrder, "mirror-b");
  assert.deepEqual(first, repeated);
  assert.notDeepEqual(first, different);
  assert.equal(first.length, 28);
  assert.equal(new Set(first).size, 28);
});

test("核心题组每维两题、方向相反、类别不同且满足混排约束", () => {
  const ids = selectCoreQuestions(bank, dimensionOrder, "layout-seed");
  const map = new Map(bank.map((question) => [question.id, question]));
  const questions = ids.map((id) => map.get(id));
  assert.equal(sequenceMeetsConstraints(questions), true);
  for (const dimension of dimensionOrder) {
    const selected = questions.filter((question) => question.dimension === dimension);
    assert.equal(selected.length, 2);
    assert.deepEqual(new Set(selected.map((question) => question.direction)), new Set([1, -1]));
    assert.equal(new Set(selected.map((question) => question.category)).size, 2);
  }
});

test("存在合法组合时不会因随机首题抽到同类别正反题", () => {
  const adversarialBank = bank.map((question) => {
    if (question.dimension !== "vice_0") return question;
    return {
      ...question,
      category:
        question.direction === -1 || question.id !== "vice_0-0" ? "scenario" : "self",
    };
  });
  const map = new Map(adversarialBank.map((question) => [question.id, question]));
  for (let index = 0; index < 50; index += 1) {
    const selected = selectCoreQuestions(adversarialBank, dimensionOrder, `adversarial-${index}`)
      .map((id) => map.get(id))
      .filter((question) => question.dimension === "vice_0");
    assert.equal(new Set(selected.map((question) => question.category)).size, 2);
    assert.deepEqual(new Set(selected.map((question) => question.direction)), new Set([1, -1]));
  }
});

test("中性且一致的核心回答无需追加题", () => {
  const core = selectCoreQuestions(bank, dimensionOrder, "no-follow-up");
  const answers = Object.fromEntries(core.map((id) => [id, 3]));
  const followUps = selectFollowUpQuestions(bank, core, answers, dimensionOrder, "no-follow-up");
  assert.deepEqual(followUps, []);
});

test("靠近35分档边界时即使答案一致也会追加题", () => {
  const seed = "boundary-follow-up";
  const core = selectCoreQuestions(bank, dimensionOrder, seed);
  const map = new Map(bank.map((question) => [question.id, question]));
  const answers = Object.fromEntries(
    core.map((id) => [id, answerForCorrected(map.get(id), 2)]),
  );
  const followUps = selectFollowUpQuestions(bank, core, answers, dimensionOrder, seed);
  assert.equal(followUps.length, 14);
});

test("每维冲突回答会追加一题，总题数上限为42", () => {
  const seed = "all-follow-up";
  const core = selectCoreQuestions(bank, dimensionOrder, seed);
  const map = new Map(bank.map((question) => [question.id, question]));
  const answers = {};
  for (const dimension of dimensionOrder) {
    const selected = core.map((id) => map.get(id)).filter((question) => question.dimension === dimension);
    answers[selected[0].id] = answerForCorrected(selected[0], 1);
    answers[selected[1].id] = answerForCorrected(selected[1], 5);
  }
  const followUps = selectFollowUpQuestions(bank, core, answers, dimensionOrder, seed);
  assert.equal(followUps.length, 14);
  assert.equal(new Set(followUps).size, 14);
  assert.equal(new Set([...core, ...followUps]).size, 42);
  for (const dimension of dimensionOrder) {
    assert.equal(followUps.filter((id) => map.get(id).dimension === dimension).length, 1);
  }
});

test("校准题组一经生成便冻结", () => {
  const state = createAssessmentSession(bank, dimensionOrder, "frozen");
  const map = new Map(bank.map((question) => [question.id, question]));
  state.answersById = Object.fromEntries(
    state.coreQuestionIds.map((id, index) => [id, answerForCorrected(map.get(id), index % 2 ? 5 : 1)]),
  );
  const frozen = freezeCalibrationPhase(state, bank, dimensionOrder);
  const changedAnswers = {
    ...frozen,
    answersById: Object.fromEntries(frozen.coreQuestionIds.map((id) => [id, 3])),
  };
  const repeated = freezeCalibrationPhase(changedAnswers, bank, dimensionOrder);
  assert.equal(frozen.phase, "calibration");
  assert.deepEqual(repeated.followUpQuestionIds, frozen.followUpQuestionIds);
});

test("14维极端答案分别换算为100与0", () => {
  const core = selectCoreQuestions(bank, dimensionOrder, "score");
  const map = new Map(bank.map((question) => [question.id, question]));
  const highAnswers = Object.fromEntries(
    core.map((id) => [id, answerForCorrected(map.get(id), 5)]),
  );
  const lowAnswers = Object.fromEntries(
    core.map((id) => [id, answerForCorrected(map.get(id), 1)]),
  );
  const high = scoreDimensions(bank, core, highAnswers, dimensionOrder);
  const low = scoreDimensions(bank, core, lowAnswers, dimensionOrder);
  for (const key of dimensionOrder) {
    assert.equal(high[key].score, 100);
    assert.equal(low[key].score, 0);
  }
});

test("五种张力状态与派生值符合PRD", () => {
  assert.equal(classifyPair(80, 75).key, "dual_high");
  assert.equal(classifyPair(20, 30).key, "low_activation");
  assert.equal(classifyPair(40, 70).key, "virtue_led");
  assert.equal(classifyPair(75, 40).key, "vice_led");
  assert.equal(classifyPair(55, 60).key, "balanced");
  assert.deepEqual(
    { balance: classifyPair(40, 70).balance, activation: classifyPair(40, 70).activation },
    { balance: 30, activation: 55 },
  );
  assert.equal(classifyPair(25, 50).activation, 37.5);
});

test("并列排名依次按答题数、一致度和固定维度顺序决胜", () => {
  const order = ["a", "b", "c", "d"];
  const scoreDetails = {
    a: { score: 75, count: 2, consistency: 100 },
    b: { score: 75, count: 3, consistency: 50 },
    c: { score: 75, count: 3, consistency: 100 },
    d: { score: 75, count: 3, consistency: 100 },
  };
  const metadata = Object.fromEntries(order.map((key) => [key, { family: "vice" }]));
  assert.deepEqual(
    rankDimensionScores(scoreDetails, metadata, "vice", order).map(({ key }) => key),
    ["c", "d", "b", "a"],
  );
});

test("联合结果包含双榜、七组张力及同轴/交叉关系", () => {
  const core = selectCoreQuestions(bank, dimensionOrder, "joint");
  const map = new Map(bank.map((question) => [question.id, question]));
  const answers = Object.fromEntries(
    core.map((id) => {
      const question = map.get(id);
      const index = dimensionOrder.indexOf(question.dimension);
      const corrected = index === 0 || index === 7 ? 5 : 3;
      return [id, answerForCorrected(question, corrected)];
    }),
  );
  const result = buildJointResult({
    bank,
    questionIds: core,
    answersById: answers,
    dimensionOrder,
    dimensions,
    pairs,
  });
  assert.equal(result.pairResults.length, 7);
  assert.deepEqual(result.pairResults.map(({ pairKey }) => pairKey), pairs.map(({ key }) => key));
  assert.ok(result.pairResults.every(({ key, pairKey, stateKey }) => key === pairKey && stateKey));
  assert.equal(result.viceRanking.length, 7);
  assert.equal(result.virtueRanking.length, 7);
  assert.equal(result.topVice.key, "vice_0");
  assert.equal(result.topVirtue.key, "virtue_0");
  assert.equal(result.relation, "same_axis");
  assert.match(result.title, /archetype_vice_0 × archetype_virtue_0/);
  assert.equal(result.combinationKey, "vice_0:virtue_0");
  assert.match(result.shareText, /同轴映照/);
});

test("49种主罪与美德组合都有稳定称号和分享文案", () => {
  const seenKeys = new Set();
  const seenTitles = new Set();
  for (const viceKey of viceKeys) {
    for (const virtueKey of virtueKeys) {
      const topVice = { key: viceKey, ...dimensions[viceKey], score: 75 };
      const topVirtue = { key: virtueKey, ...dimensions[virtueKey], score: 75 };
      const relation = viceKey.slice(-1) === virtueKey.slice(-1) ? "same_axis" : "cross_core";
      const narrative = buildCombinationNarrative(topVice, topVirtue, relation);
      seenKeys.add(narrative.combinationKey);
      seenTitles.add(narrative.title);
      assert.match(narrative.shareText, new RegExp(narrative.relationLabel));
      assert.ok(narrative.explanation.length > 20);
    }
  }
  assert.equal(seenKeys.size, 49);
  assert.equal(seenTitles.size, 49);
});

test("带上下文的排列在可行时不产生连续三道同family", () => {
  const random = createSeededRandom("tail");
  const items = ["vice_0", "virtue_0", "vice_1", "virtue_1"].flatMap((dimension) =>
    bank.filter((question) => question.dimension === dimension).slice(0, 2),
  );
  const previous = [bank.find((question) => question.dimension === "vice_5"), bank.find((question) => question.dimension === "vice_6")];
  const arranged = arrangeQuestions(items, random, previous);
  assert.equal(sequenceMeetsConstraints(arranged, previous), true);
});

