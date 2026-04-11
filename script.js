// Questions and role mapping for the AITI personality test

// Each question has:
// - text: the statement presented to the user
// - role: which character the question contributes to
// - reverse: if true, lower selections map to higher scores (reverse scoring)
// - effects: optional extra role weights for question-specific cross influence
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

// Use exact relative image paths so each role can point to its own artwork file.
const ROLE_INFO = {
  '月半猫': {
    englishName: 'Half Moon Cat',
    tagline: '你根本不懂得不懂得爱我',
    description: '你看起来松弛、圆钝、爱吃爱睡，像个对世界没什么攻击性的小肉球，但真正靠近后才会发现，你其实是情感浓度很高的人。你不太擅长把爱说得花里胡哨，却很会用陪伴、偏爱和笨拙真诚去认真喜欢一个人。外表软乎乎，内心却是个稳定又长情的深情怪。你属于慢热但很容易认真上头的类型，嘴上爱装随便，心里却把偏爱和保护欲存得很满。一旦认定了人或关系，细节里的照顾和黏度都会明显拉高。',
    traits: ['慢热上头', '嘴硬心软', '护短型偏爱'],
    image: '月半猫.jpg'
  },
  '奶龙': {
    englishName: 'NAI Loong',
    tagline: ' 我是奶龙，我才是奶龙，哈哈哈哈，我是奶虫',
    description: '你的人生逻辑不是先解释，而是先笑。越离谱的事你越想哈哈两声，越尴尬的场面你越能靠情绪把气氛带活。你不一定是真的没心没肺，只是特别擅长把沉重变轻、把紧张变松，让身边的人觉得天塌下来也可以先笑一会儿再说。',
    traits: ['气氛救火员', '笑点驱动', '临场反应快'],
    image: '奶龙.jpg'
  },
  '奶娃': {
    englishName: 'NAI Baby',
    tagline: '我的真的特别爱你，为什么你会落泪',
    description: '你天生带着一种“我就是最可爱的宝宝”的气场，讨喜、黏人、会撒娇，也很懂得把自己的可爱变成社交通行证。你并不是真的单纯，而是非常清楚自己的魅力在哪里，知道柔软和被偏爱本身就是一种力量。你的人设是宝宝，但你的可爱从来不是白给的。',
    traits: ['软萌亲近', '熟人加倍', '天生有保护欲'],
    image: '奶娃.jpg'
  },
  '安迪': {
    englishName: 'Hou la gangbadei Andy',
    tagline: '强者不留一兵一卒，悟者不伤一草一木',
    description: '你像是把战神和高僧装进了同一个身体里，平时通透清醒，关键时刻锋利果断，偶尔情绪一上头又会突然发癫。你不是矛盾，而是层次很多，知道什么时候该狠、什么时候该慈悲、什么时候该出手、什么时候该旁观。你危险，但也异常清醒。',
    traits: ['反差极强', '能打能讲', '临界感很重'],
    image: '安迪.jpg'
  },
  '猪妞': {
    englishName: 'Pig Niu',
    tagline: '仙女下凡',
    description: '你的人生态度很简单：困了就睡，饿了就吃，累了就先缓一缓。别人以为你在摆烂，你却觉得自己只是顺应生命本能，把压力化成休眠，把焦虑化成放空，把现实化成“先活着再说”。你不装高能，也不硬撑积极，但你会让人明白，慢一点也没关系',
    traits: ['续命优先', '节律自保', '懒感很诚实'],
    image: '猪妞.jpg'
  },
  '家豪': {
    englishName: 'rich family',
    tagline: '十年前的仇难道不报了吗',
    description: '你天生自带主角滤镜，表演欲和存在感都很强，习惯把生活过成舞台，把行动做成名场面。别人觉得你在装，你却觉得自己只是正常闪耀，因为你真心相信自己就是故事里的主角。你需要被看见、被记住，也需要这个世界承认你确实很有戏。',
    traits: ['主角滤镜', '镜头感强', '表现欲在线'],
    image: '嘉豪.jpg'
  },
  '刀盾': {
    englishName: 'what dog doing',
    tagline: 'what dog doing',
    description: '你不靠深刻取胜，而是靠节奏、记忆点和传播力取胜。你总能说出一些乍听没意义、细想没逻辑、但偏偏会在别人脑子里循环播放很久的话。你的人格像一句神秘口号，莫名其妙却极难忘记，最大的杀伤力就是让人不知不觉被你带进频道。',
    traits: ['复读感强', '记忆点高', '表达压过逻辑'],
    image: '刀盾.jpg'
  },
  '十年孤竹': {
    englishName: 'Ten years Bamboo',
    tagline: '十年孤竹的话语，是撑杆跳',
    description: '你表面像竹子一样挺拔、稳定、温和无害，甚至带着点前辈气质，但真正到了博弈场上，你却是那种很会藏招、很懂拿捏分寸的人。你不喜欢高调地赢，更偏爱不动声色地赢，用柔中带锋的方式把局面掌握在自己手里。你不是爱使坏，只是太会优雅地取胜。',
    traits: ['外淡内深', '擅长布局', '赢得很安静'],
    image: '十年孤竹.jpg'
  },
  '胡吒': {
    englishName: 'Hu Cha',
    tagline: '怎么一半哪吒，一般胡巴啊',
    description: '你看起来可爱、灵动、像个有点任性的小魔丸，但真正相处下来，别人很快就会发现你脑子活、反应快、心眼也不少。你很懂反差感的魅力，擅长在卖萌和腹黑之间来回切换，让人一边觉得你好可爱，一边又隐隐觉得你不好惹。越可爱，越不能低估你。',
    traits: ['甜里藏刀', '反差吸引', '悄悄掌控'],
    image: '胡吒.jpg'
  },
  '高雅人士': {
    englishName: 'Gentleman',
    tagline: '高雅人士 品鉴中，男人再富也要...',
    description: '你最大的本事，就是把离谱包装得很高级。你可以一边戴着墨镜、一边说着像模像样的文艺歪理，转头又做出很贱、很俗、很接地气的事，但偏偏让人越想越觉得合理。你不是单纯不正经，而是把不正经经营成了一种风格，嫌弃归嫌弃，却很难真的讨厌你。',
    traits: ['包装能力强', '气质先行', '歪理也顺耳'],
    image: '高雅人士.jpg'
  },
  '牢大': {
    englishName: 'Lao big',
    tagline: 'WHAT CAN I SAY',
    description: '你像那种永远活在逆风局里的人，但奇怪的是，局面越难你反而越稳。你不一定没有情绪，只是特别会把压力消化成支撑别人的力量，只要身边的人慌了，你就会本能地说一句“别怕，有我在”。你未必顺风顺水，但总能在风里站住，也让别人跟着站住。',
    traits: ['逆风不垮', '先稳别人', '扛事型人格'],
    image: '牢大.jpg'
  },
  '鹿先生': {
    englishName: 'Señor Deer',
    tagline: '到时间了',
    description: '你不喜欢拖拉，不喜欢空转，不喜欢把时间浪费在无止境的犹豫里。你讲守时、讲速度、讲产出，别人还在讨论的时候，你可能已经做完了一轮并开始改第二版。你相信很多问题不是难，而是慢，所以你的魅力从来不只是会想，而是能立刻推进、迅速闭环。',
    traits: ['执行力爆表', '先跑起来', '抗拖延强'],
    image: '鹿先生.jpg'
  },
  '帝哥': {
    englishName: 'GOD',
    tagline: '天道降临',
    description: '你看不惯的事就想管，遇到不合理的人和事总是忍不住插手，尤其受不了装腔作势、虚张声势和低级错误。你有判断、有实力，也有一点脾气，既会替人打抱不平，也会毫不留情地指出问题。你像个随时在线的民间纪委，正义感和压迫感同时拉满。。',
    traits: ['正义感高', '嘴比脑快', '拆台很准'],
    image: '帝哥.jpg'
  },
  '鳄鱼': {
    englishName: 'Hungry fish',
    tagline: '你鳄鱼叔叔我几亿年前就这样了，削弱我就美美隐身',
    description: '你不是花样很多的人，你更相信熟练、重复、经验和长期积累的力量。别人觉得你保守，你却知道自己是在规矩里藏智慧、在稳定中保实力。你不迷信新奇，也不急着出风头，因为你明白真正能让人活到最后的，往往不是最惊艳的那套，而是最耐用的那套。',
    traits: ['守拙耐久', '偏爱老办法', '稳过花活'],
    image: '鳄鱼.jpg'
  },
  '日记猫': {
    englishName: 'Diary CAT WMR',
    tagline: '这是开发者形象',
    description: '你说话和行为都很 open，很会制造暧昧，也很容易让人觉得你风流、会撩、边界很松。但再往里走一点，就会发现你并没有表面那么放得开，很多外放和轻佻其实是在掩饰内心的压抑、拧巴和犹豫。你表面像个浪子，内心却像一团没解开的线。',
    traits: ['氛围感强', '开放外壳', '边界藏得深'],
    image: '日记猫.jpg'
  },
  '南山校长': {
    englishName: 'South mountains headmaster',
    tagline: '夏天到了，记得开空调',
    description: '你是天生的资源经营者，务实、精明、对钱、机会和筹码都异常敏感。别人花钱像消费，你花钱像投资；别人囤快乐，你囤实力。你不喜欢浪费，也不喜欢无效扩张，更习惯把力量集中到最有价值的地方。你的人生信条很明确：能攒下来的，最后都会变成底气。',
    traits: ['资源敏感', '长期盘算', '收束力强'],
    image: '南山校长.jpg'
  }
};

const SCALE_LABELS = [
  '非常不同意',
  '不同意',
  '略微不同意',
  '中立 / 不确定',
  '略微同意',
  '同意',
  '非常同意'
];

const PLACEHOLDER_PALETTES = [
  ['#dff4ff', '#7fc8ff', '#2f78ff'],
  ['#f2ebff', '#c6a7ff', '#6d45f5'],
  ['#fff0d8', '#ffc982', '#ff9856'],
  ['#def7ec', '#79d8a8', '#258a5a'],
  ['#ffe4e7', '#ff9eb0', '#e55d7a'],
  ['#e8f4ff', '#8ec2ff', '#3478c2']
];

const ROLE_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

// Primary role questions always dominate; cross-role influence only refines the edges.
const PRIMARY_ROLE_WEIGHT = 6;

// Derived from the role descriptions: each role can lightly push or suppress nearby roles.
const ROLE_CROSS_WEIGHTS = {
  '月半猫': { '奶娃': 0.8, '牢大': 0.7, '日记猫': -1.3, '胡吒': -0.6 },
  '奶龙': { '家豪': 0.5, '高雅人士': 0.6, '十年孤竹': -0.5, '鳄鱼': -0.8 },
  '奶娃': { '月半猫': 0.7, '胡吒': 0.4, '安迪': -0.9, '帝哥': -0.6 },
  '安迪': { '帝哥': 0.6, '牢大': 0.5, '奶娃': -0.9, '猪妞': -0.7 },
  '猪妞': { '月半猫': 0.3, '鳄鱼': 0.4, '鹿先生': -1.4, '家豪': -0.7 },
  '家豪': { '奶龙': 0.4, '高雅人士': 0.7, '鳄鱼': -0.9, '猪妞': -0.6 },
  '刀盾': { '奶龙': 0.6, '家豪': 0.5, '鳄鱼': -0.8, '十年孤竹': -0.6 },
  '十年孤竹': { '南山校长': 0.6, '胡吒': 0.5, '帝哥': -0.9, '奶龙': -0.6 },
  '胡吒': { '日记猫': 0.8, '十年孤竹': 0.5, '月半猫': -0.9, '奶娃': -0.4 },
  '高雅人士': { '家豪': 0.7, '刀盾': 0.5, '鳄鱼': -0.8, '帝哥': -0.5 },
  '牢大': { '月半猫': 0.6, '帝哥': 0.6, '猪妞': -0.8, '日记猫': -0.7 },
  '鹿先生': { '帝哥': 0.4, '南山校长': 0.5, '猪妞': -1.4, '鳄鱼': -0.7 },
  '帝哥': { '牢大': 0.7, '安迪': 0.5, '胡吒': -0.8, '十年孤竹': -0.9 },
  '鳄鱼': { '南山校长': 0.4, '猪妞': 0.3, '家豪': -0.8, '鹿先生': -0.6 },
  '日记猫': { '胡吒': 0.8, '高雅人士': 0.4, '月半猫': -1.3, '牢大': -0.6 },
  '南山校长': { '十年孤竹': 0.6, '鳄鱼': 0.4, '奶娃': -0.7, '月半猫': -0.5 }
};

const RESULT_EASTER_EGG = {
  match: '匹配度 91%',
  score: '倾向得分 78/91'
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
const resultNameEnEl = document.getElementById('result-name-en');
const resultDetailTitleEl = document.getElementById('result-detail-title');
const resultTaglineEl = document.getElementById('result-tagline');
const resultDescriptionEl = document.getElementById('result-description');
const resultTraitsEl = document.getElementById('result-traits');
const resultMatchEl = document.getElementById('result-match');
const resultScoreEl = document.getElementById('result-score');
const resultCompletionEl = document.getElementById('result-completion');
const resultImageEl = document.getElementById('result-image');

// Event listeners
startBtn.addEventListener('click', startTest);
nextBtn.addEventListener('click', () => {
  if (answers[currentIndex] === null) {
    alert('请先选择一个选项！');
    return;
  }

  if (currentIndex < shuffledQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
    return;
  }

  showResult();
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

restartBtn.addEventListener('click', () => {
  resultScreen.classList.add('hidden');
  quizScreen.classList.add('hidden');
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
  shuffledQuestions = shuffle(QUESTIONS);
  currentIndex = 0;
  answers = new Array(shuffledQuestions.length).fill(null);
  totalQuestionsEl.textContent = shuffledQuestions.length;
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  const question = shuffledQuestions[currentIndex];
  questionNumberEl.textContent = currentIndex + 1;
  questionTextEl.textContent = question.text;
  optionsContainer.innerHTML = '';

  for (let i = 1; i <= SCALE_LABELS.length; i++) {
    const optionButton = document.createElement('button');
    optionButton.type = 'button';
    optionButton.classList.add('option');
    optionButton.textContent = SCALE_LABELS[i - 1];

    const isSelected = answers[currentIndex] === i;
    optionButton.classList.toggle('selected', isSelected);
    optionButton.setAttribute('aria-pressed', String(isSelected));

    optionButton.addEventListener('click', () => {
      answers[currentIndex] = i;
      updateSelectedOption(i);
      updateNavigationState();
    });

    optionsContainer.appendChild(optionButton);
  }

  updateNavigationState();
}

function updateSelectedOption(selectedValue) {
  const allOptions = optionsContainer.querySelectorAll('.option');
  allOptions.forEach((option, index) => {
    const isSelected = index + 1 === selectedValue;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', String(isSelected));
  });
}

function updateNavigationState() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = answers[currentIndex] === null;
  nextBtn.textContent = currentIndex < shuffledQuestions.length - 1 ? '下一题' : '查看结果';
}

function hasUnansweredQuestions() {
  return answers.some(answer => answer === null);
}

function getAnsweredCount() {
  return answers.filter(answer => answer !== null).length;
}

function getQuestionCrossWeights(question) {
  return {
    ...(ROLE_CROSS_WEIGHTS[question.role] || {}),
    ...(question.effects || {})
  };
}

function calculateRoleMetrics() {
  const metrics = {};

  Object.keys(ROLE_INFO).forEach(role => {
    metrics[role] = {
      score: 0,
      rawScore: 0,
      primaryScore: 0,
      secondaryScore: 0,
      intensity: 0,
      anchorHits: 0,
      answeredCount: 0,
      questionCount: 0
    };
  });

  for (let i = 0; i < shuffledQuestions.length; i++) {
    const question = shuffledQuestions[i];
    const answer = answers[i];
    const roleMetric = metrics[question.role];

    roleMetric.questionCount++;

    if (answer === null) {
      continue;
    }

    const normalizedScore = question.reverse ? 8 - answer : answer;
    const scoreSignal = normalizedScore - 4;
    const primaryImpact = scoreSignal * PRIMARY_ROLE_WEIGHT;

    roleMetric.rawScore += normalizedScore;
    roleMetric.primaryScore += primaryImpact;
    roleMetric.score += primaryImpact;
    roleMetric.intensity += Math.abs(primaryImpact);
    roleMetric.answeredCount++;

    if (normalizedScore >= 6) {
      roleMetric.anchorHits++;
    }

    const crossWeights = getQuestionCrossWeights(question);
    Object.entries(crossWeights).forEach(([targetRole, weight]) => {
      if (!metrics[targetRole] || targetRole === question.role) {
        return;
      }

      const secondaryImpact = scoreSignal * weight;
      metrics[targetRole].secondaryScore += secondaryImpact;
      metrics[targetRole].score += secondaryImpact;
      metrics[targetRole].intensity += Math.abs(secondaryImpact);
    });
  }

  return metrics;
}

function sortRolesByMetrics(metrics) {
  return Object.keys(metrics).sort((roleA, roleB) => {
    const primaryDelta = metrics[roleB].primaryScore - metrics[roleA].primaryScore;
    if (primaryDelta !== 0) {
      return primaryDelta;
    }

    const anchorHitDelta = metrics[roleB].anchorHits - metrics[roleA].anchorHits;
    if (anchorHitDelta !== 0) {
      return anchorHitDelta;
    }

    const totalDelta = metrics[roleB].score - metrics[roleA].score;
    if (totalDelta !== 0) {
      return totalDelta;
    }

    const rawDelta = metrics[roleB].rawScore - metrics[roleA].rawScore;
    if (rawDelta !== 0) {
      return rawDelta;
    }

    const intensityDelta = metrics[roleB].intensity - metrics[roleA].intensity;
    if (intensityDelta !== 0) {
      return intensityDelta;
    }

    return roleA.localeCompare(roleB, 'zh-CN');
  });
}

function getMatchPercentage(metric) {
  const minimumScore = metric.questionCount;
  const maximumScore = metric.questionCount * 7;

  if (maximumScore === minimumScore) {
    return 0;
  }

  const normalized = (metric.rawScore - minimumScore) / (maximumScore - minimumScore);
  return Math.round(normalized * 100);
}

function normalizePreviewToken(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_\-()（）]+/g, '');
}

function resolvePreviewRole(previewValue) {
  const token = normalizePreviewToken(previewValue);

  if (!token) {
    return null;
  }

  return Object.entries(ROLE_INFO).find(([role, info]) => {
    return (
      normalizePreviewToken(role) === token ||
      normalizePreviewToken(info.englishName) === token
    );
  })?.[0] ?? null;
}

function getTiedTopRoles(sortedRoles, metrics) {
  const primaryRole = sortedRoles[0];
  const primaryMetric = metrics[primaryRole];

  return sortedRoles.filter(role => {
    return (
      metrics[role].primaryScore === primaryMetric.primaryScore &&
      metrics[role].anchorHits === primaryMetric.anchorHits &&
      metrics[role].score === primaryMetric.score &&
      metrics[role].rawScore === primaryMetric.rawScore &&
      metrics[role].intensity === primaryMetric.intensity
    );
  });
}

function getPlaceholderPalette(role) {
  const roleIndex = Object.keys(ROLE_INFO).indexOf(role);
  return PLACEHOLDER_PALETTES[roleIndex % PLACEHOLDER_PALETTES.length];
}

function createPlaceholderImage(role, englishName) {
  const [lightColor, midColor, darkColor] = getPlaceholderPalette(role);
  const initials = englishName
    .split(/[\s-]+/)
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360">
      <defs>
        <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${lightColor}" />
          <stop offset="100%" stop-color="${midColor}" />
        </linearGradient>
      </defs>
      <rect width="360" height="360" rx="44" fill="url(#card)" />
      <circle cx="180" cy="148" r="74" fill="rgba(255,255,255,0.62)" />
      <circle cx="120" cy="96" r="20" fill="rgba(255,255,255,0.42)" />
      <circle cx="248" cy="104" r="16" fill="rgba(255,255,255,0.35)" />
      <rect x="92" y="218" width="176" height="78" rx="26" fill="rgba(255,255,255,0.74)" />
      <text x="180" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="62" font-weight="800" fill="${darkColor}">${initials}</text>
      <text x="180" y="252" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#173b27">${role}</text>
      <text x="180" y="282" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="#305746">${englishName}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildRoleImageCandidates(imagePath) {
  if (!imagePath) {
    return [];
  }

  if (/\.[a-z0-9]+(?:[?#].*)?$/i.test(imagePath)) {
    return [imagePath];
  }

  return ROLE_IMAGE_EXTENSIONS.map(extension => `${imagePath}${extension}`);
}

function toAssetUrl(assetPath) {
  return new URL(assetPath, window.location.href).href;
}

function setResultImage(role, roleInfo) {
  const fallbackSrc = createPlaceholderImage(role, roleInfo.englishName);
  const candidates = buildRoleImageCandidates(roleInfo.image);

  if (!candidates.length) {
    resultImageEl.onerror = null;
    resultImageEl.src = fallbackSrc;
    return;
  }

  const tryCandidate = index => {
    if (index >= candidates.length) {
      resultImageEl.onerror = null;
      resultImageEl.src = fallbackSrc;
      return;
    }

    resultImageEl.onerror = () => tryCandidate(index + 1);
    resultImageEl.src = toAssetUrl(candidates[index]);
  };

  tryCandidate(0);
}

function renderTraits(traits) {
  resultTraitsEl.innerHTML = '';

  traits.forEach(trait => {
    const tag = document.createElement('span');
    tag.classList.add('trait-pill');
    tag.textContent = trait;
    resultTraitsEl.appendChild(tag);
  });
}

function renderResult(primaryRole, completionText) {
  const primaryInfo = ROLE_INFO[primaryRole];

  resultTitleEl.textContent = primaryRole;
  resultNameEnEl.textContent = primaryInfo.englishName;
  resultDetailTitleEl.textContent = `${primaryInfo.englishName}（${primaryRole}）`;
  resultTaglineEl.textContent = primaryInfo.tagline;
  resultDescriptionEl.textContent = primaryInfo.description;
  resultMatchEl.textContent = RESULT_EASTER_EGG.match;
  resultScoreEl.textContent = RESULT_EASTER_EGG.score;
  resultCompletionEl.textContent = completionText;
  setResultImage(primaryRole, primaryInfo);
  resultImageEl.alt = `${primaryRole} 角色图`;
  renderTraits(primaryInfo.traits);
  startScreen.classList.add('hidden');
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
}

function showPreviewRole(role) {
  const completionText = `预览模式 · 当前展示 ${role} 的结果页`;

  renderResult(role, completionText);
}

function showResult() {
  if (hasUnansweredQuestions()) {
    const unansweredCount = answers.filter(answer => answer === null).length;
    alert(`还有 ${unansweredCount} 道题没有完成，请先答完再看结果。`);
    return;
  }

  const roleMetrics = calculateRoleMetrics();
  const sortedRoles = sortRolesByMetrics(roleMetrics);
  const primaryRole = sortedRoles[0];
  const totalAnswered = getAnsweredCount();
  const tiedTopRoles = getTiedTopRoles(sortedRoles, roleMetrics);
  let completionText = `已完成 ${totalAnswered} / ${shuffledQuestions.length} 题`;

  if (tiedTopRoles.length === 2) {
    const alternativeRole = tiedTopRoles.find(role => role !== primaryRole);
    completionText += ` · 与 ${alternativeRole} 同样接近`;
  } else if (tiedTopRoles.length > 2) {
    completionText += ` · 当前结果与 ${tiedTopRoles.length} 个类型并列接近`;
  }

  renderResult(primaryRole, completionText);
}

function initializePreviewMode() {
  const params = new URLSearchParams(window.location.search);
  const previewRole = resolvePreviewRole(params.get('preview'));

  if (previewRole) {
    showPreviewRole(previewRole);
  }
}

initializePreviewMode();
