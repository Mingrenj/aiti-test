import assert from "node:assert/strict";
import test from "node:test";
import {
  DIMENSION_ORDER,
  QUESTIONS,
  buildResult,
  calculateScores,
  getLevel,
} from "../assessment.js";

test("题库结构完整且每个维度恰好五题", () => {
  assert.equal(QUESTIONS.length, 35);
  assert.equal(new Set(QUESTIONS.map((question) => question.id)).size, 35);
  for (const key of DIMENSION_ORDER) {
    const items = QUESTIONS.filter((question) => question.dimension === key);
    assert.equal(items.length, 5, `${key} 应有 5 题`);
    assert.equal(items.filter((question) => question.reverse).length, 2, `${key} 应有 2 道反向题`);
  }
});

test("与倾向一致的极端答案计为 100", () => {
  const answers = QUESTIONS.map((question) => (question.reverse ? 1 : 5));
  const scores = calculateScores(answers);
  for (const score of Object.values(scores)) assert.equal(score, 100);
});

test("与倾向相反的极端答案计为 0", () => {
  const answers = QUESTIONS.map((question) => (question.reverse ? 5 : 1));
  const scores = calculateScores(answers);
  for (const score of Object.values(scores)) assert.equal(score, 0);
});

test("中性回答在所有维度都计为 50", () => {
  const scores = calculateScores(Array(35).fill(3));
  for (const score of Object.values(scores)) assert.equal(score, 50);
});

test("无效答案会被拒绝", () => {
  assert.throws(() => calculateScores(Array(35).fill(0)), /缺少有效答案/);
});

test("等级边界与双核心规则稳定", () => {
  assert.equal(getLevel(34).key, "low");
  assert.equal(getLevel(35).key, "mid");
  assert.equal(getLevel(64).key, "mid");
  assert.equal(getLevel(65).key, "high");

  const result = buildResult({
    pride: 80,
    greed: 72,
    lust: 50,
    envy: 45,
    gluttony: 40,
    wrath: 35,
    sloth: 30,
  });
  assert.equal(result.top.key, "pride");
  assert.equal(result.second.key, "greed");
  assert.equal(result.doubleCore, true);
  assert.equal(result.lowest.key, "sloth");
});


