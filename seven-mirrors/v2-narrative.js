/**
 * 七面心镜 v2 · 结果叙事
 *
 * 这是纯数据 / 纯函数模块，不读取 DOM、存储或网络。所谓“宗罪”与“美德”
 * 仅用作自我观察隐喻，不构成善恶评判、医学结论或人群排名。
 */

export const NARRATIVE_VICE_ORDER = [
  "pride",
  "greed",
  "lust",
  "envy",
  "gluttony",
  "wrath",
  "sloth",
];

export const NARRATIVE_VIRTUE_ORDER = [
  "humility",
  "generosity",
  "chastity",
  "kindness",
  "temperance",
  "patience",
  "diligence",
];

const VICE = Object.freeze({
  pride: {
    name: "傲慢",
    softName: "认可需求",
    title: "冠冕",
    impulse: "希望被看见、被尊重，也希望自己的判断有分量",
    gift: "清晰标准与承担感",
    watch: "先把不同意见听成信息，而不是否定",
    action: "遇到分歧时，先完整复述一次对方的观点，再表达自己的判断",
  },
  greed: {
    name: "贪婪",
    softName: "稀缺感",
    title: "金钥",
    impulse: "希望提前储备资源，让未来更可控、更安全",
    gift: "规划意识与资源敏感度",
    watch: "为“足够”画出边界，不让累积变成无尽任务",
    action: "今天为金钱、时间或成就写下一条具体的“已经足够”标准",
  },
  lust: {
    name: "欲望",
    softName: "刺激寻求",
    title: "焰纱",
    impulse: "容易被鲜活感、吸引力和新体验点亮",
    gift: "生命力、好奇与感染力",
    watch: "让即时兴奋与长期选择同时拥有发言权",
    action: "面对强烈冲动时延迟十分钟，再问一次“明天的我也会同意吗”",
  },
  envy: {
    name: "嫉妒",
    softName: "比较心",
    title: "翠镜",
    impulse: "会从他人的进展里迅速感知自己的位置与未满足愿望",
    gift: "发现差距与真实向往的敏锐度",
    watch: "把比较转译成方向，而不是自我否定",
    action: "写下一次最近的比较，并把“我不如”改写成“这提醒我在乎”",
  },
  gluttony: {
    name: "暴食",
    softName: "过度满足",
    title: "盛宴",
    impulse: "倾向用食物、娱乐、购物或其他享受快速松开压力",
    gift: "感受快乐与创造生活滋味的能力",
    watch: "分清当下需要的是享受、安慰，还是休息",
    action: "下一次想继续刷、吃或买时，先停一分钟辨认自己真正缺少什么",
  },
  wrath: {
    name: "愤怒",
    softName: "怒火反应",
    title: "雷门",
    impulse: "对冒犯、不公与边界被越过有很快的反应",
    gift: "保护边界与挺身而出的力量",
    watch: "让怒气传递信息，而不是替你做完决定",
    action: "情绪升温时先降低音量并离开片刻，把重要回应延迟十分钟",
  },
  sloth: {
    name: "懒惰",
    softName: "行动惰性",
    title: "月眠",
    impulse: "在过载、模糊或害怕失败时，更容易等待合适状态再启动",
    gift: "辨认无效消耗与放慢节奏的能力",
    watch: "别让休息与回避混在一起，也别等待完美能量",
    action: "选一件拖延中的事，只完成五分钟以内的第一步",
  },
});

const VIRTUE = Object.freeze({
  humility: {
    name: "谦逊",
    softName: "开放与自知",
    title: "俯星",
    resource: "在保有价值感的同时，也允许事实、局限与他人修正自己",
    gift: "开放学习而不必缩小自己",
    boundary: "接受赞美与表达专长，不把谦逊变成隐身",
    action: "今天主动说一次“这里我可能遗漏了什么”，也坦然接受一次肯定",
  },
  generosity: {
    name: "慷慨",
    softName: "分享与充足感",
    title: "托灯",
    resource: "相信资源可以流动，并愿意在清楚边界内给予",
    gift: "合作、互惠与为他人创造机会",
    boundary: "先确认自己真心愿意，避免用透支换取认可",
    action: "分享一次低成本但真实有用的资源，同时为时间或精力写明上限",
  },
  chastity: {
    name: "贞洁",
    softName: "边界与自持",
    title: "界线",
    resource: "能感受吸引与好奇，同时仍由自己选择行动",
    gift: "清晰同意、可靠承诺与自主边界",
    boundary: "边界不是否认欲望，也不必把正常感受视作错误",
    action: "把一条重要边界写成可执行规则，并为感受保留不评判的空间",
  },
  kindness: {
    name: "善意",
    softName: "欣赏与共情",
    title: "春枝",
    resource: "能看见他人的处境与亮点，而不必因此否定自己",
    gift: "欣赏、共情与修复关系的能力",
    boundary: "理解不等于一味迁就，善意也需要诚实的拒绝",
    action: "真诚说出一项对他人的欣赏，同时为自己的一项需要清楚发声",
  },
  temperance: {
    name: "节制",
    softName: "适度与觉察",
    title: "量杯",
    resource: "能觉察满足点，在享受与长期状态之间调节分量",
    gift: "有意识地享受，也有能力及时停止",
    boundary: "适度不是惩罚或剥夺，生活仍需要愉悦",
    action: "为一项容易过量的享受提前设定停止信号，并专心体验允许的部分",
  },
  patience: {
    name: "耐心",
    softName: "情绪容纳",
    title: "静潮",
    resource: "能容纳不适与延迟，不急着用最强烈的反应解决问题",
    gift: "稳定、复原与给关系留下空间",
    boundary: "耐心不等于忍受伤害，必要时仍要明确立界",
    action: "在一次不顺里先做三次缓慢呼吸，再用一句平静的话说明边界",
  },
  diligence: {
    name: "勤勉",
    softName: "稳定行动力",
    title: "晨轮",
    resource: "能用可持续的小步推进重要事情，不依赖短暂的高热情",
    gift: "稳定兑现与把愿望落到日常",
    boundary: "行动需要恢复配合，不用忙碌证明自己的价值",
    action: "为一个重要目标安排十五分钟最小行动，并同时预留明确的休息段",
  },
});

export const CORRESPONDING_VIRTUE = Object.freeze({
  pride: "humility",
  greed: "generosity",
  lust: "chastity",
  envy: "kindness",
  gluttony: "temperance",
  wrath: "patience",
  sloth: "diligence",
});

const clampScore = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, Math.round(number))) : null;
};

const assertKey = (catalogue, key, family) => {
  if (!Object.hasOwn(catalogue, key)) {
    throw new RangeError(`未知${family}维度：${String(key)}`);
  }
};

const scoreFragment = (viceScore, virtueScore) => {
  const vice = clampScore(viceScore);
  const virtue = clampScore(virtueScore);
  if (vice === null || virtue === null) return "";
  return `（影面 ${vice} · 光面 ${virtue}）`;
};

/**
 * 返回任意主宗罪 × 主美德组合的完整叙事。相同输入始终得到相同文本。
 */
export function getCombinationNarrative(
  viceKey,
  virtueKey,
  { viceScore = null, virtueScore = null } = {},
) {
  assertKey(VICE, viceKey, "宗罪");
  assertKey(VIRTUE, virtueKey, "美德");

  const vice = VICE[viceKey];
  const virtue = VIRTUE[virtueKey];
  const isSameAxis = CORRESPONDING_VIRTUE[viceKey] === virtueKey;
  const mode = isSameAxis ? "same-axis" : "cross-core";
  const modeLabel = isSameAxis ? "同轴映照" : "交叉双核";
  const title = isSameAxis
    ? `${vice.title}与${virtue.title}的同轴之镜`
    : `${vice.title}牵引，${virtue.title}定向`;

  const summary = isSameAxis
    ? `你的${vice.softName}与${virtue.softName}落在同一条轴上：一边${vice.impulse}；另一边${virtue.resource}。这不是互相抵消，而是一组会随情境切换的力量。`
    : `你的影面核心是${vice.name}·${vice.softName}：${vice.impulse}；光面核心是${virtue.name}·${virtue.softName}：${virtue.resource}。两股力量来自不同轴线，前者指出压力入口，后者提供可调用的应对资源。`;

  const scores = scoreFragment(viceScore, virtueScore);
  const shareText = `我的七面心镜是「${title}」｜${modeLabel}${scores}。${vice.name}提醒我留意${vice.watch}；${virtue.name}让我练习${virtue.gift}。这是一次自我观察，不是善恶或医学结论。`;

  return Object.freeze({
    id: `${viceKey}--${virtueKey}`,
    viceKey,
    virtueKey,
    viceName: vice.name,
    virtueName: virtue.name,
    mode,
    modeLabel,
    title,
    summary,
    shareText,
  });
}

/** 预先展开的 49 种组合，便于测试、静态导出或生成分享卡。 */
export const COMBINATION_NARRATIVES = Object.freeze(
  NARRATIVE_VICE_ORDER.flatMap((viceKey) =>
    NARRATIVE_VIRTUE_ORDER.map((virtueKey) =>
      getCombinationNarrative(viceKey, virtueKey),
    ),
  ),
);

export function getShareCopy(viceKey, virtueKey, scores = {}) {
  return getCombinationNarrative(viceKey, virtueKey, {
    viceScore: scores[viceKey],
    virtueScore: scores[virtueKey],
  }).shareText;
}

const readPair = (pairs, pairKey) => {
  if (Array.isArray(pairs)) return pairs.find((pair) => pair?.pairKey === pairKey);
  return pairs?.[pairKey];
};

const findSecondaryPair = (pairs, dominantPairKey) => {
  const values = Array.isArray(pairs) ? pairs : Object.values(pairs || {});
  return values
    .filter((pair) => pair && pair.pairKey !== dominantPairKey)
    .sort((a, b) => {
      const activationDelta = (Number(b.activation) || 0) - (Number(a.activation) || 0);
      if (activationDelta) return activationDelta;
      const balanceDelta = Math.abs(Number(b.balance) || 0) - Math.abs(Number(a.balance) || 0);
      if (balanceDelta) return balanceDelta;
      return NARRATIVE_VICE_ORDER.indexOf(a.pairKey) - NARRATIVE_VICE_ORDER.indexOf(b.pairKey);
    })[0];
};

/**
 * 从完整结果生成三条联合行动建议。
 * 输入：{ scores, pairs, dominantVice, dominantVirtue }
 * - scores: 14 维分数字典（此函数只用于措辞，不做诊断）
 * - pairs: pairKey -> { pairKey, balance, activation, state }，或同结构数组
 */
export function buildJointActions({
  scores = {},
  pairs = {},
  dominantVice,
  dominantVirtue,
} = {}) {
  assertKey(VICE, dominantVice, "宗罪");
  assertKey(VIRTUE, dominantVirtue, "美德");

  const vice = VICE[dominantVice];
  const virtue = VIRTUE[dominantVirtue];
  const sameAxis = CORRESPONDING_VIRTUE[dominantVice] === dominantVirtue;
  const dominantPair = readPair(pairs, dominantVice);
  const secondaryPair = findSecondaryPair(pairs, dominantVice);
  const viceScore = clampScore(scores[dominantVice]);
  const virtueScore = clampScore(scores[dominantVirtue]);

  const notice = {
    title: `先看见：${vice.name}出现的那一刻`,
    text: `${vice.action}。${viceScore === null ? "" : `你在这一维的当前分数是 ${viceScore}，`}目标不是压掉这股力量，而是让它多一个选择。`,
  };

  const resource = {
    title: `再调用：${virtue.name}的可用资源`,
    text: `${virtue.action}。${virtueScore === null ? "" : `你在这一维的当前分数是 ${virtueScore}，`}同时记得：${virtue.boundary}。`,
  };

  let integrateText;
  if (sameAxis) {
    const state = dominantPair?.state ? `当前呈现“${dominantPair.state}”` : "这两面位于同一轴线";
    integrateText = `${state}。下一次${vice.softName}升起时，试着用${virtue.softName}回应它：保留${vice.gift}，同时练习${virtue.gift}。`;
  } else {
    const secondary = secondaryPair?.pairKey && VICE[secondaryPair.pairKey];
    const secondSentence = secondary
      ? `另外留意${secondary.name}·${secondary.softName}这条高激活轴：只选一个小场景观察，不必一次改变全部。`
      : "一周只选一个真实场景记录触发、选择与结果，不必一次改变全部。";
    integrateText = `当${vice.softName}启动时，把${virtue.softName}当作已有工具：先照顾“${vice.impulse}”背后的需要，再用“${virtue.gift}”决定行动。${secondSentence}`;
  }

  return Object.freeze([
    Object.freeze({ id: "notice", ...notice }),
    Object.freeze({ id: "resource", ...resource }),
    Object.freeze({ title: sameAxis ? "最后整合：让同轴两面协作" : "最后整合：让交叉双核协作", id: "integrate", text: integrateText }),
  ]);
}

/** 供测试与开发期诊断；成功时返回摘要，失败则抛错。 */
export function validateNarrativeCatalogue() {
  if (COMBINATION_NARRATIVES.length !== 49) {
    throw new Error(`组合数量应为 49，实际为 ${COMBINATION_NARRATIVES.length}`);
  }

  const ids = new Set();
  const titles = new Set();
  for (const item of COMBINATION_NARRATIVES) {
    if (!item.id || !item.title || !item.summary || !item.shareText) {
      throw new Error(`组合 ${item.id || "(unknown)"} 文本不完整`);
    }
    if (ids.has(item.id)) throw new Error(`组合 ID 重复：${item.id}`);
    if (titles.has(item.title)) throw new Error(`组合标题重复：${item.title}`);
    ids.add(item.id);
    titles.add(item.title);

    const expectedSameAxis = CORRESPONDING_VIRTUE[item.viceKey] === item.virtueKey;
    if ((item.mode === "same-axis") !== expectedSameAxis) {
      throw new Error(`组合模式不匹配：${item.id}`);
    }
  }

  return Object.freeze({
    combinations: COMBINATION_NARRATIVES.length,
    uniqueIds: ids.size,
    uniqueTitles: titles.size,
    sameAxis: COMBINATION_NARRATIVES.filter((item) => item.mode === "same-axis").length,
    crossCore: COMBINATION_NARRATIVES.filter((item) => item.mode === "cross-core").length,
  });
}

export { VICE as VICE_NARRATIVE_COPY, VIRTUE as VIRTUE_NARRATIVE_COPY };
