//// Questions and role mapping for the AITI personality test

// Each question has:
// - text: the statement presented to the user
// - role: which character the question contributes to
// - reverse: if true, lower selections map to higher scores (reverse scoring)
const QUESTIONS = [
  // 月半猫 - 深情胖胖型
  { text: '如果我喜欢一个人，我会像守着冰箱里最后一块小蛋糕一样，嘴上说随便，心里其实谁也不让碰。', role: '月半猫', reverse: false },
  { text: '我的人生可以胖着过、懒着过、吃着过，但喜欢一个人时 usually 是认真到能把外卖备注都写成情书。', role: '月半猫', reverse: false },
  { text: '对我来说，爱情更像火锅蘸料，有最好，没有也完全不影响我狠狠干饭。', role: '月半猫', reverse: true },
  // 奶龙 - 仰天大笑型
  { text: '场面越尴尬，我越想先仰天大笑，笑到楼下路人以为我中彩票了。', role: '奶龙', reverse: false },
  { text: '别人遇事先分析，我遇事先“哈哈哈哈哈哈”，先把气氛笑松再说。', role: '奶龙', reverse: false },
  { text: '真碰到麻烦时，我会立刻切换成董事会模式，严肃得像在审财报，不太会用笑声解决问题。', role: '奶龙', reverse: true },
  // 奶娃 - 宇宙宝宝型
  { text: '我很适合被人捏脸、哄着、夸“这是谁家的小宝贝”，而且我本人也觉得这很合理。', role: '奶娃', reverse: false },
  { text: '在熟人面前，我会自然而然进入宝宝模式，仿佛全世界都该给我让一口奶。', role: '奶娃', reverse: false },
  { text: '比起可爱和黏人，我更想当一个冷酷无情、眼神能冻住 Wi‑Fi 的人。', role: '奶娃', reverse: true },
  // 安迪 - 狂悟双修型
  { text: '我的状态经常是一半顿悟众生，一半随时拍桌，像把高僧和疯子装进了同一个身体。', role: '安迪', reverse: false },
  { text: '关键时刻我既能下狠手，也能讲两句大道理，把别人打服以后顺便说服。', role: '安迪', reverse: false },
  { text: '我的人格一向单线程运行，基本不会在“圣人”和“癫公”之间横跳。', role: '安迪', reverse: true },
  // 猪妞 - 土拨鼠冬眠型
  { text: '压力一大，我就想原地退化成一只会点外卖的土拨鼠，先吃、先睡、先失联。', role: '猪妞', reverse: false },
  { text: '我很擅长把“今天不想动”包装成“尊重生命节律，等待灵魂上线”。', role: '猪妞', reverse: false },
  { text: '再困再累我也不会允许自己停下来，哪怕像没充电的电钻也要继续转。', role: '猪妞', reverse: true },
  // 家豪 - 主角开屏型
  { text: '我经常脑补自己走路带风，背景音乐一响，路人自动慢放回头看我三秒。', role: '家豪', reverse: false },
  { text: '哪怕别人觉得我有点装，我也会想：你懂什么，这叫主角出场动画。', role: '家豪', reverse: false },
  { text: '我最大的梦想是低调做人，最好一整天都没人注意到我。', role: '家豪', reverse: true },
  // 刀盾 - 洗脑复读型
  { text: '我经常说出一些没什么深意、但能在别人脑子里循环播放三天三夜的话。', role: '刀盾', reverse: false },
  { text: '只要一句话够洗脑，我不介意它到底有没有逻辑，先上头再说。', role: '刀盾', reverse: false },
  { text: '我说话必须严谨、准确、逻辑闭环，不太接受这种“越听越怪越记得住”的表达方式。', role: '刀盾', reverse: true },
  // 十年孤竹 - 竹影老阴型
  { text: '我表面像一根清清白白的竹子，实际上心里住着一位很会下棋的老阴谋家。', role: '十年孤竹', reverse: false },
  { text: '如果要赢，我更喜欢让对方自己踩坑，而不是我冲上去大喊“看招”。', role: '十年孤竹', reverse: false },
  { text: '我这人特别直，直得像电线杆，基本不会藏招，也不喜欢拿捏别人。', role: '十年孤竹', reverse: true },
  // 胡吒 - 魔丸腹黑型
  { text: '我很享受“看起来像水果糖，实际咬一口里面包着朝天椒”的反差感。', role: '胡吒', reverse: false },
  { text: '我可以一边可爱，一边把主动权悄悄薅回来，像一只会卖萌的魔丸。', role: '胡吒', reverse: false },
  { text: '我给人的感觉通常就是单纯、老实、毫无坏心眼，完全不会在可爱里夹带私货。', role: '胡吒', reverse: true },
  // 高雅人士 - 雅痞低俗型
  { text: '我有本事把一件非常接地气、甚至有点不体面的事，说得像艺术展导览词。', role: '高雅人士', reverse: false },
  { text: '我喜欢那种戴着墨镜讲歪理、听完还觉得“该死，居然有点道理”的状态。', role: '高雅人士', reverse: false },
  { text: '我一向拒绝低俗玩笑，做人做事只走纯洁、高贵、端庄、正统四个大字。', role: '高雅人士', reverse: true },
  // 牢大 - 逆风守护型
  { text: '越是逆风局，我越容易露出一种“都别慌，我还在”的神秘微笑。', role: '牢大', reverse: false },
  { text: '就算我自己也只剩一格血，只要别人慌了，我还是会先站出来顶一下。', role: '牢大', reverse: false },
  { text: '一到困难时刻，我通常先保护自己，很少有心情去安稳别人。', role: '牢大', reverse: true },
  // 鹿先生 - 高速执行型
  { text: '我看到“截止今晚12点”这几个字，体内会自动启动火箭推进器。', role: '鹿先生', reverse: false },
  { text: '与其开三个小时会讨论，不如我先做一版出来，做错了再改，先跑起来最重要。', role: '鹿先生', reverse: false },
  { text: '我做事更看天意和心情，不太在乎守时、效率和产量这些人间 KPI。', role: '鹿先生', reverse: true },
  // 帝哥 - 正义拆台型
  { text: '遇到装腔作势的人，我的嘴会自动替天行道，根本不需要大脑同意。', role: '帝哥', reverse: false },
  { text: '哪怕只是一件小得像芝麻的不公平，我也容易忍不住站出来说两句。', role: '帝哥', reverse: false },
  { text: '只要事情没烧到我头上，我一般懒得拆穿、懒得纠正、懒得管。', role: '帝哥', reverse: true },
  // 鳄鱼 - 守拙老匠型
  { text: '我相信一招练到炉火纯青，比会一百招花里胡哨更能活到大结局。', role: '鳄鱼', reverse: false },
  { text: '别人说我老派，我会觉得那叫稳定；很多新花样看起来像烟花，响一下就没了。', role: '鳄鱼', reverse: false },
  { text: '我特别容易厌倦旧办法，恨不得今天推翻昨天，明天再推翻今天。', role: '鳄鱼', reverse: true },
  // 日记猫 - 开放撩系型
  { text: '我说话和行为经常有一种“你先别多想，但你要是真多想了我也不负责”的气质。', role: '日记猫', reverse: false },
  { text: '我有时会用玩笑、暧昧和看起来很 open 的外壳，藏住自己真正的别扭和压抑。', role: '日记猫', reverse: false },
  { text: '我在亲密表达上一直非常克制，基本不会制造任何让人误会的粉红气流。', role: '日记猫', reverse: true },
  // 南山校长 - 资本聚敛型
  { text: '我对钱、资源、机会的敏感度很高，看到“能省”“能攒”“能收”这几个字眼睛都会亮。', role: '南山校长', reverse: false },
  { text: '别人说我抠，我说这叫资源归拢；别人说我算，我说这叫力量集中。', role: '南山校长', reverse: false },
  { text: '我花东西一向主打一个今朝有酒今朝醉，基本不做任何长期打算。', role: '南山校长', reverse: true }
];

// Role metadata: tagline (short sentence), description (can be edited later), and placeholder image path.
// TODO: Replace `description` and `image` values with your own content and images when polishing.
const ROLE_INFO = {
  '月半猫': {
    tagline: '你根本不懂得不懂得爱我',
    description: '在此填写月半猫的角色简介，可以描述他的性格特点、优势、弱点等。',
    image: ''
  },
  '奶龙': {
    tagline: '别问我问题，我会先给你一个仰天大笑',
    description: '在此填写奶龙的角色简介。',
    image: ''
  },
  '奶娃': {
    tagline: '萌萌哒，世界上最可爱的宝宝是谁',
    description: '在此填写奶娃的角色简介。',
    image: ''
  },
  '安迪': {
    tagline: '强者不留一兵一卒，悟者不伤一草一木',
    description: '在此填写安迪的角色简介。',
    image: ''
  },
  '猪妞': {
    tagline: '我就是装作抑郁症，为了给自己一个吃了睡睡醒了吃的理由',
    description: '在此填写猪妞的角色简介。',
    image: ''
  },
  '家豪': {
    tagline: '别人都以为我是个装货，但我在我自己的世界里是主角',
    description: '在此填写家豪的角色简介。',
    image: ''
  },
  '刀盾': {
    tagline: '没有特殊含义，但是特别洗脑',
    description: '在此填写刀盾的角色简介。',
    image: ''
  },
  '十年孤竹': {
    tagline: '扮竹子坚韧的品质，屹立不倒',
    description: '在此填写十年孤竹的角色简介。',
    image: ''
  },
  '胡吒': {
    tagline: '可爱的魔丸，灵珠也好，魔丸也罢，能有我阴吗',
    description: '在此填写胡吒的角色简介。',
    image: ''
  },
  '高雅人士': {
    tagline: '经常借高雅之名做一些低俗的事情',
    description: '在此填写高雅人士的角色简介。',
    image: ''
  },
  '牢大': {
    tagline: '永远的逆风局，但微微一笑就有无限能量',
    description: '在此填写牢大的角色简介。',
    image: ''
  },
  '鹿先生': {
    tagline: '守时，快速，大量',
    description: '在此填写鹿先生的角色简介。',
    image: ''
  },
  '帝哥': {
    tagline: '经常打抱不平，往往拥有实力但是却喜欢管小事情',
    description: '在此填写帝哥的角色简介。',
    image: ''
  },
  '鳄鱼': {
    tagline: '一招鲜吃遍天，墨守陈规但是却巧避锋芒',
    description: '在此填写鳄鱼的角色简介。',
    image: ''
  },
  '日记猫': {
    tagline: '行为和语言都十分的 open',
    description: '在此填写日记猫的角色简介。',
    image: ''
  },
  '南山校长': {
    tagline: '资本家的顶级代表，一毛不拔的铁公鸡',
    description: '在此填写南山校长的角色简介。',
    image: ''
  }
};

// Global state
let shuffledQuestions = [];
let currentIndex = 0;
let answers = [];

// DOM elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionNumberEl = document.getElementById('question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const resultTitleEl = document.getElementById('result-title');
const resultTaglineEl = document.getElementById('result-tagline');
const resultDescriptionEl = document.getElementById('result-description');
const resultImageEl = document.getElementById('result-image');

// Event listeners
startBtn.addEventListener('click', startTest);
nextBtn.addEventListener('click', () => {
  if (currentIndex < shuffledQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    // Ensure last question answered before showing result
    if (answers[currentIndex] === null) {
      alert('请先选择一个选项！');
      return;
    }
    showResult();
  }
});
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});
restartBtn.addEventListener('click', () => {
  // restart the test from the beginning
  resultScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTest() {
  // Initialize state
  shuffledQuestions = shuffle(QUESTIONS);
  currentIndex = 0;
  answers = new Array(shuffledQuestions.length).fill(null);
  totalQuestionsEl.textContent = shuffledQuestions.length;
  // Hide start screen, show quiz screen
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  // Render the first question
  renderQuestion();
}

function renderQuestion() {
  const q = shuffledQuestions[currentIndex];
  questionNumberEl.textContent = currentIndex + 1;
  questionTextEl.textContent = q.text;
  // Render options
  optionsContainer.innerHTML = '';
  const labels = [
    '非常不同意',
    '不同意',
    '略微不同意',
    '中立 / 不确定',
    '略微同意',
    '同意',
    '非常同意'
  ];
  for (let i = 1; i <= 7; i++) {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option');
    // If this option is currently selected, mark it
    if (answers[currentIndex] === i) {
      optionDiv.classList.add('selected');
    }
    optionDiv.textContent = labels[i - 1];
    optionDiv.addEventListener('click', () => {
      // Save answer and mark selection
      answers[currentIndex] = i;
      // Clear other selected states
      const allOptions = optionsContainer.querySelectorAll('.option');
      allOptions.forEach(opt => opt.classList.remove('selected'));
      optionDiv.classList.add('selected');
    });
    optionsContainer.appendChild(optionDiv);
  }
  // Update button visibility
  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex < shuffledQuestions.length - 1 ? '下一题' : '查看结果';
}

function calculateScores() {
  const scores = {};
  // Initialize all roles to 0
  Object.keys(ROLE_INFO).forEach(role => (scores[role] = 0));
  for (let i = 0; i < shuffledQuestions.length; i++) {
    const question = shuffledQuestions[i];
    const ans = answers[i];
    if (ans === null) continue;
    let score = question.reverse ? (8 - ans) : ans;
    scores[question.role] += score;
  }
  return scores;
}

function showResult() {
  const scores = calculateScores();
  // Determine primary and secondary roles
  const sortedRoles = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const primaryRole = sortedRoles[0];
  // For demonstration, second role is not used, but can be retrieved via sortedRoles[1]
  // Populate result card
  const roleInfo = ROLE_INFO[primaryRole];
  resultTitleEl.textContent = `${primaryRole}`;
  resultTaglineEl.textContent = roleInfo.tagline;
  resultDescriptionEl.textContent = roleInfo.description;
  if (roleInfo.image) {
    resultImageEl.src = roleInfo.image;
    resultImageEl.alt = primaryRole;
    resultImageEl.style.display = 'block';
  } else {
    resultImageEl.style.display = 'none';
  }
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
}
