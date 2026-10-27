export const DIMENSION_ORDER = [
  "pride",
  "greed",
  "lust",
  "envy",
  "gluttony",
  "wrath",
  "sloth",
];

export const DIMENSIONS = {
  pride: {
    name: "傲慢",
    softName: "自我优越感",
    icon: "✦",
    color: "#e3c565",
    archetype: "王冠的回声",
    need: "被尊重、被认可与确认自身价值",
    short: "你有多需要证明自己正确、优秀或值得特殊认可。",
    description:
      "它常来自对尊重、能力感和价值感的需要。适量会表现为自信与标准感，过强时可能让倾听和承认错误变得困难。",
    gift: "清晰的自我标准、决断力与承担责任的意愿。",
    risk: "容易把不同意见听成否定，在关系里陷入输赢。",
    advice: {
      low: "你较少执着于证明自己。别把谦逊变成自我压低；该表达专业意见时，仍可清楚发声。",
      mid: "被挑战或忽视时，你可能进入防御。试试先准确复述对方观点，再说明自己的判断。",
      high: "认可与正确感对你很重要。每天主动承认一个“不知道”，或点出一项他人的贡献，让自信不必依赖胜负。",
    },
  },
  greed: {
    name: "贪婪",
    softName: "占有欲",
    icon: "◇",
    color: "#d08a4b",
    archetype: "收藏家的手",
    need: "获得安全、资源与对生活的掌控感",
    short: "你对金钱、资源、机会、安全感与控制权的累积倾向。",
    description:
      "它往往与安全感、稀缺感和控制感有关。适量能带来储备意识，过强时“更多”会逐渐取代“足够”。",
    gift: "储备意识、目标感，以及为未来负责的能力。",
    risk: "不断抬高“足够”的门槛，让拥有变成持续紧绷。",
    advice: {
      low: "你对分享与得失较为放松。仍要保留合理边界：慷慨不等于忽略自己的需求。",
      mid: "资源不足或竞争出现时，你的占有欲会增强。为金钱、时间或成就提前写下一条“足够线”。",
      high: "积累可能在替你缓解不安全感。对非必要获取设置 24 小时等待期，并定期分享或清理闲置资源。",
    },
  },
  lust: {
    name: "欲望",
    softName: "刺激寻求",
    icon: "❋",
    color: "#a77ada",
    archetype: "火花追逐者",
    need: "感受生命力、吸引力、新鲜感与亲密连接",
    short: "你被吸引、关注、新鲜感和即时冲动推动的程度。",
    description:
      "它体现了对吸引力、关注、新鲜感和即时满足的敏感，也包含生命力与好奇心；关键在于是否尊重边界和长期价值。",
    gift: "好奇心、感染力，以及对生活鲜活感的敏锐。",
    risk: "短期兴奋盖过承诺、边界或长期真正想要的东西。",
    advice: {
      low: "你较少被即时刺激牵引。可以主动为生活加入安全、真诚的新鲜体验。",
      mid: "疲惫、孤独或兴奋时，你更容易跟随冲动。行动前问：“十分钟后和明天的我都会同意吗？”",
      high: "强烈吸引或被关注感可能暂时盖过承诺。减少高风险触发，设置明确边界，把重要决定延迟到情绪回落后。",
    },
  },
  envy: {
    name: "嫉妒",
    softName: "比较心",
    icon: "◉",
    color: "#69b982",
    archetype: "镜中的比较者",
    need: "确认自己的位置、价值与未被满足的向往",
    short: "他人的成功、拥有或被关注，会在多大程度上影响你的自我评价。",
    description:
      "比较心通常在提醒你重视某种能力、关系或生活状态。适量比较能提供方向，过强则会侵蚀自我价值。",
    gift: "对差距和愿望的敏感，能快速发现自己真正重视什么。",
    risk: "把别人的高光误读成自己的失败，让价值感被外界牵动。",
    advice: {
      low: "你较少被他人的进展动摇。偶尔借助良性参照，也能帮助自己发现新的可能。",
      mid: "特定对象或领域容易触发比较。把“我不如他”改写为“这件事显示我也在乎什么”。",
      high: "外部评价可能频繁左右你的心情。减少触发性信息流，每天记录一项自己的进展与一项已有的支持。",
    },
  },
  gluttony: {
    name: "暴食",
    softName: "过度满足",
    icon: "◒",
    color: "#d97d9d",
    archetype: "盛宴续杯者",
    need: "快速获得安慰、放松与可掌控的愉悦",
    short: "你通过食物、娱乐、购物或其他享受获得安慰并难以及时停止的倾向。",
    description:
      "这里不只指食物，也包括刷视频、购物、游戏及其他难以停止的享受。它常是快速舒缓压力的一种方式。",
    gift: "感受快乐、品味体验，也懂得为紧绷的生活寻找出口。",
    risk: "即时安慰替代真正的休息与需求，满足之后反而更空。",
    advice: {
      low: "你通常能感知满足与停止。也别把节制变成过度剥夺，允许自己有意识地享受。",
      mid: "压力或疲惫时，你可能更难停下。冲动出现时，先检查自己是否饿、怒、孤独或疲惫。",
      high: "享受可能承担了较多情绪调节任务。调整环境以减少触发，并准备散步、交流或洗澡等替代安抚方式。",
    },
  },
  wrath: {
    name: "愤怒",
    softName: "怒火反应",
    icon: "ϟ",
    color: "#e56b5d",
    archetype: "雷霆守门人",
    need: "保护边界、公平与不愿再次受伤的部分",
    short: "面对冒犯、阻碍与不公平时，你的情绪升温及反击倾向。",
    description:
      "愤怒常在保护边界、公平与尊严。它本身不是错误，但反应过快或持续过久，可能伤害关系与判断。",
    gift: "边界感、正义感，以及在关键时刻挺身而出的力量。",
    risk: "防御系统启动过快，让小事升级，或让怨气长期占据注意。",
    advice: {
      low: "你较少用怒气回应问题。注意不要一味压抑；平静而明确地表达边界同样重要。",
      mid: "明显的不公或冒犯会让你升温。识别身体信号，在回应前给自己一次短暂停顿。",
      high: "你的防御系统启动得很快。冲突中先离开现场、降低音量并延迟重要决定；若担心失控，主动寻求支持。",
    },
  },
  sloth: {
    name: "懒惰",
    softName: "行动惰性",
    icon: "☾",
    color: "#7487bc",
    archetype: "缓启动梦想家",
    need: "躲开过载、失败感，或恢复被透支的精力",
    short: "你在启动、坚持或完成重要但不愉快任务时的阻力。",
    description:
      "行动困难不一定来自“懒”，也可能与疲劳、压力、任务模糊或害怕失败有关。这里关注的是启动与坚持阻力。",
    gift: "知道何时放慢，也更容易看见不值得消耗的忙碌。",
    risk: "等待完美状态，让未完成的压力持续累积。",
    advice: {
      low: "你通常能稳定行动。记得把休息视为节奏的一部分，而不是必须赢得的奖励。",
      mid: "任务越模糊或不愉快，你越容易拖延。把第一步缩小到五分钟内能够完成。",
      high: "回避与等待可能让压力累积。固定每天的最小行动时段；若长期精力低落并影响生活，也可关注睡眠、健康与心理负荷。",
    },
  },
};

export const QUESTIONS = [
  { id: 1, dimension: "pride", reverse: false, text: "当别人质疑我的判断时，我常会立刻为自己辩护。" },
  { id: 2, dimension: "greed", reverse: false, text: "即使已经拥有足够的资源，我仍常觉得还需要更多。" },
  { id: 3, dimension: "lust", reverse: false, text: "新鲜、迷人或令人兴奋的人和事，很容易吸引我的全部注意。" },
  { id: 4, dimension: "envy", reverse: false, text: "看到同龄人取得成绩时，我会不自觉地重新衡量自己的价值。" },
  { id: 5, dimension: "gluttony", reverse: false, text: "一旦开始做令人愉快的事，我往往很难在适当的时候停下。" },
  { id: 6, dimension: "wrath", reverse: false, text: "被冒犯或误解时，我的情绪通常会迅速变得强烈。" },
  { id: 7, dimension: "sloth", reverse: false, text: "即使知道某件事很重要，我也常拖到压力迫近才开始。" },
  { id: 8, dimension: "pride", reverse: true, text: "发现自己错了时，我愿意坦然承认并公开修正。" },
  { id: 9, dimension: "greed", reverse: true, text: "当别人确实需要时，我通常愿意分享自己的时间或资源。" },
  { id: 10, dimension: "lust", reverse: true, text: "即使受到强烈诱惑，我也能暂停一下并考虑后果。" },
  { id: 11, dimension: "envy", reverse: true, text: "我能真心为别人的成功高兴，而不因此贬低自己。" },
  { id: 12, dimension: "gluttony", reverse: true, text: "享受一件事时，我通常能在已经满足的时候停下来。" },
  { id: 13, dimension: "wrath", reverse: true, text: "生气时，我通常能先让自己冷静，再决定如何回应。" },
  { id: 14, dimension: "sloth", reverse: true, text: "即使没有动力，我也能先完成一个很小的起步动作。" },
  { id: 15, dimension: "pride", reverse: false, text: "如果自己的贡献没有得到认可，我会明显感到不舒服。" },
  { id: 16, dimension: "greed", reverse: false, text: "想到可能失去已经拥有的优势，我会格外焦虑或防备。" },
  { id: 17, dimension: "lust", reverse: false, text: "短期的兴奋感有时会压过我原本的承诺或长期计划。" },
  { id: 18, dimension: "envy", reverse: false, text: "别人得到更多关注或机会时，我有时会觉得不太公平。" },
  { id: 19, dimension: "gluttony", reverse: false, text: "压力大时，我容易靠吃东西、刷内容、购物或娱乐来过度安慰自己。" },
  { id: 20, dimension: "wrath", reverse: false, text: "受到伤害后，我会反复回想，并期待对方付出代价。" },
  { id: 21, dimension: "sloth", reverse: false, text: "我常有不少计划，却一直等待所谓的最佳状态。" },
  { id: 22, dimension: "pride", reverse: false, text: "在争论中，我有时更在意证明自己正确，而不是理解对方。" },
  { id: 23, dimension: "greed", reverse: false, text: "拥有更多金钱、资源或控制权，会让我觉得自己更安全。" },
  { id: 24, dimension: "lust", reverse: false, text: "被欣赏或被关注会让我很满足，并想继续追求这种感觉。" },
  { id: 25, dimension: "envy", reverse: false, text: "我很容易注意到别人拥有而自己缺少的东西。" },
  { id: 26, dimension: "gluttony", reverse: false, text: "我有时会以“奖励自己”为理由，获得远超实际需要的享受。" },
  { id: 27, dimension: "wrath", reverse: false, text: "小小的阻碍或失误，有时也会让我产生过强的烦躁。" },
  { id: 28, dimension: "sloth", reverse: false, text: "面对枯燥或困难的工作，我容易先逃避，直到不能再拖。" },
  { id: 29, dimension: "pride", reverse: true, text: "我能接受别人比我更擅长某件事，而不需要贬低对方。" },
  { id: 30, dimension: "greed", reverse: true, text: "达到原本设定的“足够”后，我通常能停止继续累积。" },
  { id: 31, dimension: "lust", reverse: true, text: "即使欲望很强烈，我仍能守住自己与他人的边界。" },
  { id: 32, dimension: "envy", reverse: true, text: "我能把别人的成功当作信息或启发，而不是对自我价值的判决。" },
  { id: 33, dimension: "gluttony", reverse: true, text: "我通常能分辨真实需要与情绪性渴望。" },
  { id: 34, dimension: "wrath", reverse: true, text: "事情过去后，我通常能逐渐放下怨气，而不是不断重演它。" },
  { id: 35, dimension: "sloth", reverse: true, text: "我有相对稳定的节奏，能够把开始的事情推进到完成。" },
];

export function getLevel(score) {
  if (score <= 34) return { key: "low", label: "相对舒缓" };
  if (score <= 64) return { key: "mid", label: "情境触发" };
  return { key: "high", label: "较为鲜明" };
}

export function calculateScores(answers) {
  const buckets = Object.fromEntries(DIMENSION_ORDER.map((key) => [key, []]));

  QUESTIONS.forEach((question, index) => {
    const answer = Number(answers[index]);
    if (!Number.isInteger(answer) || answer < 1 || answer > 5) {
      throw new Error(`第 ${index + 1} 题缺少有效答案`);
    }
    buckets[question.dimension].push(question.reverse ? 6 - answer : answer);
  });

  return Object.fromEntries(
    DIMENSION_ORDER.map((key) => {
      const values = buckets[key];
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return [key, Math.round(((average - 1) / 4) * 100)];
    }),
  );
}

export function buildResult(scores) {
  const ranked = DIMENSION_ORDER.map((key) => ({
    key,
    score: scores[key],
    ...DIMENSIONS[key],
  })).sort((a, b) => b.score - a.score || DIMENSION_ORDER.indexOf(a.key) - DIMENSION_ORDER.indexOf(b.key));

  const top = ranked[0];
  const second = ranked[1];
  const lowest = ranked.at(-1);
  const average = Math.round(ranked.reduce((sum, item) => sum + item.score, 0) / ranked.length);
  const spread = top.score - lowest.score;
  const doubleCore = top.score - second.score <= 10;

  let shapeText = "你的七种倾向有起伏，也保留了调整空间。情境往往比固定标签更重要。";
  if (spread <= 15) {
    shapeText = "七个维度较为均衡；此刻的环境与压力，可能比固定性格更影响你的表现。";
  } else if (spread >= 40) {
    shapeText = "雷达呈现鲜明峰值；这股拉力可能在某些压力、诱惑或关系场景中格外突出。";
  }

  let climateText = "你拥有常见且可调节的人性拉力，关键在于看见它们出现前的触发场景。";
  if (average < 35) {
    climateText = "整体倾向较温和；这也可能与近期状态或偏克制的作答方式有关。";
  } else if (average > 64) {
    climateText = "近期多种冲动或压力反应都较活跃。比起责备自己，更适合先降低负荷，找回小范围的控制感。";
  }

  return { ranked, top, second, lowest, average, spread, doubleCore, shapeText, climateText };
}

