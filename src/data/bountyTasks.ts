// 模拟企业悬赏令数据
export interface BountyTask {
  id: string;
  company: string;
  companyLogo: string;
  title: string;
  description: string;
  field: string;
  deadline: string;
  reward: string;
  difficulty: '简单' | '中等' | '困难';
  participants: number;
  mvp: string | null;
}

export const bountyTasks: BountyTask[] = [
  {
    id: 'b1',
    company: '字节跳动',
    companyLogo: '🏢',
    title: '校园产品体验优化方案',
    description: '针对大学生群体，提出抖音校园版的功能优化建议。需要分析现有功能的问题，并给出具体的改进方案。',
    field: '产品',
    deadline: '2026-07-15',
    reward: '面试直通卡 + ¥2000奖品',
    difficulty: '中等',
    participants: 47,
    mvp: null,
  },
  {
    id: 'b2',
    company: '阿里巴巴',
    companyLogo: '🏪',
    title: '小程序界面重构',
    description: '为阿里旗下某校园服务小程序重新设计首页界面，要求符合Material Design规范，兼顾美观与可用性。',
    field: '设计',
    deadline: '2026-07-20',
    reward: '实习面试机会 + 设计书籍套装',
    difficulty: '困难',
    participants: 23,
    mvp: null,
  },
  {
    id: 'b3',
    company: '腾讯',
    companyLogo: '🐧',
    title: '用户留存数据分析',
    description: '提供一份脱敏的用户行为数据集，分析用户留存的关键影响因素，并给出提升留存率的建议。',
    field: '数据',
    deadline: '2026-07-10',
    reward: '校招面试直通 + ¥3000奖金',
    difficulty: '困难',
    participants: 31,
    mvp: '张同学（大三·数据分析方向）',
  },
  {
    id: 'b4',
    company: '美团',
    companyLogo: '🛵',
    title: '校园外卖配送优化建议',
    description: '针对校园外卖场景，提出配送效率提升的创新方案。可以涉及路线规划、时间窗口、配送方式等方面。',
    field: '产品',
    deadline: '2026-08-01',
    reward: '面试机会 + ¥1000美团卡',
    difficulty: '中等',
    participants: 56,
    mvp: null,
  },
  {
    id: 'b5',
    company: '小红书',
    companyLogo: '📕',
    title: '校园内容生态创意方案',
    description: '设计一套吸引大学生在小红书创作校园内容的运营方案，包含活动策划、激励机制、内容方向。',
    field: '运营',
    deadline: '2026-07-25',
    reward: '实习offer + ¥2000奖品',
    difficulty: '中等',
    participants: 38,
    mvp: null,
  },
  {
    id: 'b6',
    company: '网易',
    companyLogo: '🎮',
    title: '教育类APP前端页面开发',
    description: '使用React实现一个课程列表页面，包含搜索、筛选、分页功能，要求代码规范、性能优化。',
    field: '开发',
    deadline: '2026-07-18',
    reward: '技术面试直通 + 机械键盘',
    difficulty: '中等',
    participants: 19,
    mvp: '李同学（大二·前端方向）',
  },
];
