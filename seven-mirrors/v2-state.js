export const V2_STORAGE_KEY = "seven-mirrors-state-v2";
export const V1_STORAGE_KEY = "seven-mirrors-state-v1";

export function parseStoredJson(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function validateV2Session(value, validQuestionIds, coreCount = 28) {
  if (!value || value.bankVersion !== 2 || typeof value.seed !== "string") return false;
  if (!["core", "calibration", "complete"].includes(value.phase)) return false;
  if (!Array.isArray(value.coreQuestionIds) || value.coreQuestionIds.length !== coreCount) return false;
  if (!Array.isArray(value.followUpQuestionIds) || value.followUpQuestionIds.length > 14) return false;
  const allowedIds = validQuestionIds instanceof Set ? validQuestionIds : new Set(validQuestionIds);
  const ids = [...value.coreQuestionIds, ...value.followUpQuestionIds];
  if (new Set(ids).size !== ids.length || ids.some((id) => !allowedIds.has(id))) return false;
  if (!value.answersById || typeof value.answersById !== "object" || Array.isArray(value.answersById)) return false;
  if (Object.entries(value.answersById).some(([id, answer]) => !ids.includes(id) || !Number.isInteger(answer) || answer < 1 || answer > 5)) return false;
  return Number.isInteger(value.currentIndex) && value.currentIndex >= 0 && value.currentIndex <= ids.length;
}

export function restoreV2Session(raw, validQuestionIds, coreCount = 28) {
  const value = parseStoredJson(raw);
  return validateV2Session(value, validQuestionIds, coreCount) ? value : null;
}

export function classifyLegacyState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { type: "none", answered: 0 };
  if (value.completed && value.scores && typeof value.scores === "object") return { type: "complete", answered: 35 };
  const answered = Array.isArray(value.answers)
    ? value.answers.filter((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5).length
    : 0;
  if (answered || Number(value.currentIndex) > 0) return { type: "progress", answered };
  return { type: "none", answered: 0 };
}

export function beginFrozenAnswerEdit(completedState) {
  if (!completedState || completedState.phase !== "complete") return completedState;
  return {
    ...completedState,
    phase: "calibration",
    currentIndex: 0,
    scores: null,
    completedAt: null,
  };
}
