import assert from "node:assert/strict";
import test from "node:test";
import { DIMENSION_ORDER_V2, QUESTION_BANK_V2 } from "../assessment.js";
import { createAssessmentSession } from "../v2-engine.js";
import {
  beginFrozenAnswerEdit,
  classifyLegacyState,
  parseStoredJson,
  restoreV2Session,
  validateV2Session,
} from "../v2-state.js";

const validIds = new Set(QUESTION_BANK_V2.map(({ id }) => id));

test("刷新后的 JSON 往返保持 seed、题组顺序与答案", () => {
  const state = createAssessmentSession(QUESTION_BANK_V2, DIMENSION_ORDER_V2, "refresh-stable");
  state.currentIndex = 4;
  state.answersById = Object.fromEntries(state.coreQuestionIds.slice(0, 4).map((id, index) => [id, index + 1]));
  const restored = restoreV2Session(JSON.stringify(state), validIds);
  assert.deepEqual(restored, state);
  assert.deepEqual(restored.coreQuestionIds, state.coreQuestionIds);
  assert.equal(restored.seed, "refresh-stable");
});

test("损坏或伪造的 v2 状态会被忽略而不执行迁移", () => {
  assert.equal(parseStoredJson("{bad-json"), null);
  const state = createAssessmentSession(QUESTION_BANK_V2, DIMENSION_ORDER_V2, "invalid");
  state.coreQuestionIds[0] = "removed-question";
  assert.equal(validateV2Session(state, validIds), false);
  assert.equal(restoreV2Session(JSON.stringify(state), validIds), null);
});

test("返回修改答案时保留已冻结题组且不动态增删校准题", () => {
  const completed = {
    ...createAssessmentSession(QUESTION_BANK_V2, DIMENSION_ORDER_V2, "edit-frozen"),
    phase: "complete",
    followUpQuestionIds: ["pride-self-02", "humility-self-02"],
    currentIndex: 30,
    scores: { scores: { pride: 50 } },
    completedAt: "2026-10-27T00:00:00.000Z",
  };
  const edited = beginFrozenAnswerEdit(completed);
  assert.equal(edited.phase, "calibration");
  assert.deepEqual(edited.coreQuestionIds, completed.coreQuestionIds);
  assert.deepEqual(edited.followUpQuestionIds, completed.followUpQuestionIds);
  assert.equal(edited.scores, null);
  assert.equal(edited.currentIndex, 0);
});

test("旧版完成结果、进行中进度与无效数据被分别识别", () => {
  assert.deepEqual(classifyLegacyState({ completed: true, scores: { pride: 80 } }), { type: "complete", answered: 35 });
  assert.deepEqual(classifyLegacyState({ completed: false, currentIndex: 3, answers: [4, 2, 5] }), { type: "progress", answered: 3 });
  assert.deepEqual(classifyLegacyState({ answers: [] }), { type: "none", answered: 0 });
  assert.deepEqual(classifyLegacyState("unexpected"), { type: "none", answered: 0 });
});
