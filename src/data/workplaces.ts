// 模拟职场数据
export interface WorkplaceRoom {
  id: string;
  name: string;
  company: string;
  icon: string;
  description: string;
  role: string;
  tasks: WorkplaceTask[];
  colleagues: WorkplaceColleague[];
  level: '入门' | '进阶' | '高级';
  participants: number;
}

export interface WorkplaceTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
}

export interface WorkplaceColleague {
  id: string;
  name: string;
  role: string;
  avatar: string;
  level: number;
  evaluation: string;
}

export const workplaces: WorkplaceRoom[] = [
  {
    id: 'w1',
    name: '产品新兵营',
    company: '模拟·产品团队',
    icon: '📋',
    description: '体验产品经理的日常工作，从需求评审到产品上线全程参与。适合对产品感兴趣的同学。',
    role: '产品助理',
    level: '入门',
    participants: 128,
    tasks: [
      {
        id: 'wt1',
        title: '撰写本周需求文档',
        description: '根据用户反馈，为新功能「笔记分享」撰写需求文档，包含功能描述、验收标准和优先级。',
        deadline: '本周五 18:00',
        completed: false,
      },
      {
        id: 'wt2',
        title: '参与需求评审会议',
        description: '与团队一起评审「课程提醒」功能的需求文档，提出至少2条改进意见。',
        deadline: '本周三 14:00',
        completed: true,
      },
      {
        id: 'wt3',
        title: '数据分析周报',
        description: '收集上周产品数据，输出一份数据周报，包含核心指标变化和你的分析。',
        deadline: '下周一 10:00',
        completed: false,
      },
    ],
    colleagues: [
      {
        id: 'c1',
        name: '陈学姐',
        role: '高级产品经理',
        avatar: '👩‍💼',
        level: 5,
        evaluation: '思路清晰，文档写得很好！继续加油！',
      },
      {
        id: 'c2',
        name: '王同学',
        role: '产品实习生',
        avatar: '🧑‍💻',
        level: 2,
        evaluation: '一起进步！你的数据分析能力很强。',
      },
      {
        id: 'c3',
        name: '李导师',
        role: '产品总监',
        avatar: '👨‍💼',
        level: 6,
        evaluation: '新人里最有潜力的，继续保持好奇心。',
      },
    ],
  },
  {
    id: 'w2',
    name: '前端开发工作室',
    company: '模拟·技术团队',
    icon: '💻',
    description: '参与真实的前端开发项目，从代码审查到功能上线，体验开发工程师的日常。',
    role: '前端实习生',
    level: '入门',
    participants: 96,
    tasks: [
      {
        id: 'wt4',
        title: '修复导航栏Bug',
        description: '移动端导航栏在iOS Safari上出现错位，定位问题并提交PR修复。',
        deadline: '本周四 18:00',
        completed: false,
      },
      {
        id: 'wt5',
        title: 'Code Review',
        description: '审查另一位实习生的登录页面代码，写Review评论，关注代码规范和可维护性。',
        deadline: '本周三 12:00',
        completed: false,
      },
      {
        id: 'wt6',
        title: '技术分享准备',
        description: '准备一个15分钟的「React Hooks最佳实践」分享，下周团队会议上讲。',
        deadline: '下周二 10:00',
        completed: false,
      },
    ],
    colleagues: [
      {
        id: 'c4',
        name: '赵学长',
        role: '高级前端工程师',
        avatar: '👨‍🔧',
        level: 5,
        evaluation: '代码质量不错，命名规范可以再注意一下。',
      },
      {
        id: 'c5',
        name: '刘同学',
        role: '前端实习生',
        avatar: '👩‍💻',
        level: 3,
        evaluation: '你写的组件很清晰，跟你合作很愉快！',
      },
    ],
  },
  {
    id: 'w3',
    name: '数据分析训练场',
    company: '模拟·数据团队',
    icon: '📊',
    description: '处理真实的数据分析需求，从数据清洗到可视化报告，锻炼数据思维。',
    role: '数据分析实习生',
    level: '入门',
    participants: 85,
    tasks: [
      {
        id: 'wt7',
        title: '用户行为数据分析',
        description: '分析过去一周的用户行为数据，找出用户流失的关键节点，输出一份分析报告。',
        deadline: '本周五 17:00',
        completed: false,
      },
      {
        id: 'wt8',
        title: '制作数据看板',
        description: '用图表工具制作一个运营数据看板，包含DAU、留存率、转化率等核心指标。',
        deadline: '下周一 10:00',
        completed: false,
      },
    ],
    colleagues: [
      {
        id: 'c6',
        name: '周学姐',
        role: '数据分析师',
        avatar: '👩‍🔬',
        level: 4,
        evaluation: 'SQL写得很好，分析的逻辑也很严谨。',
      },
      {
        id: 'c7',
        name: '吴同学',
        role: '数据实习生',
        avatar: '👨‍🎓',
        level: 2,
        evaluation: '你做的可视化图表真好看，向你学习！',
      },
    ],
  },
  {
    id: 'w4',
    name: '设计创意工坊',
    company: '模拟·设计团队',
    icon: '🎨',
    description: '参与产品的设计流程，从设计评审到方案落地，提升设计实战能力。',
    role: 'UI设计实习生',
    level: '入门',
    participants: 72,
    tasks: [
      {
        id: 'wt9',
        title: '首页改版设计',
        description: '针对现有产品首页进行设计改版，输出高保真设计稿，附设计说明。',
        deadline: '下周三 18:00',
        completed: false,
      },
      {
        id: 'wt10',
        title: '图标设计',
        description: '为产品的6个新功能设计一套统一风格的图标。',
        deadline: '本周五 12:00',
        completed: false,
      },
      {
        id: 'wt11',
        title: '设计评审参与',
        description: '参与团队的设计评审会，对其他设计师的方案提出至少1条建设性意见。',
        deadline: '本周四 15:00',
        completed: true,
      },
    ],
    colleagues: [
      {
        id: 'c8',
        name: '林学姐',
        role: '资深UI设计师',
        avatar: '👩‍🎨',
        level: 5,
        evaluation: '审美很好，细节处理很到位！',
      },
      {
        id: 'c9',
        name: '郑同学',
        role: '设计实习生',
        avatar: '👨‍🎨',
        level: 2,
        evaluation: '你的配色方案给了我很多灵感！',
      },
    ],
  },
];
