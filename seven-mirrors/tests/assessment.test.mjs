import assert from "node:assert/strict";
import test from "node:test";
import {
  BANK_VERSION,
  DIMENSIONS_V2,
  DIMENSION_ORDER_V2,
  PAIRS,
  PAIR_ORDER,
  QUESTION_BANK_V2,
} from "../assessment.js";
import {
  COMBINATION_NARRATIVES,
  buildJointActions,
  getCombinationNarrative,
  validateNarrativeCatalogue,
} from "../v2-narrative.js";

test("v2 题库覆盖 14 维、98 个稳定 ID", () => {
  assert.equal(BANK_VERSION, 2);
  assert.equal(DIMENSION_ORDER_V2.length, 14);
  assert.equal(new Set(DIMENSION_ORDER_V2).size, 14);
  assert.equal(Object.keys(DIMENSIONS_V2).length, 14);
  assert.equal(QUESTION_BANK_V2.length, 98);
  assert.equal(new Set(QUESTION_BANK_V2.map(({ id }) => id)).size, 98);
});

test("每维 7 题，并含正反向与三种题型", () => {
  for (const dimension of DIMENSION_ORDER_V2) {
    const questions = QUESTION_BANK_V2.filter((item) => item.dimension === dimension);
    assert.equal(questions.length, 7, `${dimension} 应有 7 题`);
    assert.equal(questions.filter(({ direction }) => direction === 1).length, 4);
    assert.equal(questions.filter(({ direction }) => direction === -1).length, 3);
    assert.deepEqual(
      new Set(questions.map(({ category }) => category)),
      new Set(["self", "scenario", "regulation"]),
    );
  }
});

test("题目 schema、family 与配对关系保持一致", () => {
  const allowedCategories = new Set(["self", "scenario", "regulation"]);
  for (const question of QUESTION_BANK_V2) {
    const dimension = DIMENSIONS_V2[question.dimension];
    assert.ok(dimension, question.id);
    assert.equal(question.family, dimension.family, question.id);
    assert.equal(question.pairKey, dimension.pairKey, question.id);
    assert.ok(allowedCategories.has(question.category), question.id);
    assert.ok(question.direction === 1 || question.direction === -1, question.id);
    assert.equal(question.version, 2, question.id);
    assert.equal(question.active, true, question.id);
    assert.ok(question.text.length >= 12, question.id);
  }
});

test("七组宗罪与美德一一对应", () => {
  assert.equal(PAIR_ORDER.length, 7);
  for (const pairKey of PAIR_ORDER) {
    const pair = PAIRS[pairKey];
    assert.equal(DIMENSIONS_V2[pair.vice].family, "vice");
    assert.equal(DIMENSIONS_V2[pair.virtue].family, "virtue");
    assert.equal(DIMENSIONS_V2[pair.vice].pairKey, pairKey);
    assert.equal(DIMENSIONS_V2[pair.virtue].pairKey, pairKey);
  }
});

test("49 种双使者叙事完整且同轴规则正确", () => {
  assert.deepEqual(validateNarrativeCatalogue(), {
    combinations: 49,
    uniqueIds: 49,
    uniqueTitles: 49,
    sameAxis: 7,
    crossCore: 42,
  });
  assert.equal(COMBINATION_NARRATIVES.length, 49);
  assert.equal(getCombinationNarrative("pride", "humility").modeLabel, "同轴映照");
  assert.equal(getCombinationNarrative("pride", "diligence").modeLabel, "交叉双核");
});

test("联合建议固定输出三条且保持自我观察定位", () => {
  const actions = buildJointActions({
    scores: { pride: 75, humility: 68 },
    pairs: { pride: { pairKey: "pride", state: "双高张力", balance: -7, activation: 71.5 } },
    dominantVice: "pride",
    dominantVirtue: "humility",
  });
  assert.equal(actions.length, 3);
  assert.equal(new Set(actions.map(({ id }) => id)).size, 3);
  assert.ok(actions.every(({ title, text }) => title && text.length > 20));
});

