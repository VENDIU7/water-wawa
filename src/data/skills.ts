// 技能树数据
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: number; // 1-5, 对应解锁等级
  tasks: SkillTask[];
  unlocked: boolean;
  completed: boolean;
  x: number; // 可视化位置
  y: number;
}

export interface SkillTask {
  id: string;
  title: string;
  description: string;
  requirements: string;
  xpReward: number;
}

export interface CareerSkills {
  careerId: string;
  nodes: SkillNode[];
}

export const careerSkills: Record<string, SkillNode[]> = {
  pm: [
    {
      id: 'pm-1',
      name: '需求分析',
      description: '学习如何挖掘和分析用户需求',
      level: 1,
      unlocked: true,
      completed: false,
      x: 150,
      y: 80,
      tasks: [
        {
          id: 'pm-1-1',
          title: '用户访谈练习',
          description: '模拟进行一次用户访谈，写出你的访谈提纲和3个核心发现。',
          requirements: '提交一份用户访谈提纲（至少8个问题）+ 3个从访谈中提炼的核心洞察',
          xpReward: 50,
        },
        {
          id: 'pm-1-2',
          title: '需求文档撰写',
          description: '为一个校园场景的产品写出PRD需求文档。',
          requirements: '提交一份PRD文档，包含：背景、目标用户、核心功能列表、优先级排序',
          xpReward: 80,
        },
      ],
    },
    {
      id: 'pm-2',
      name: '竞品分析',
      description: '学习如何进行市场调研和竞品分析',
      level: 2,
      unlocked: false,
      completed: false,
      x: 300,
      y: 80,
      tasks: [
        {
          id: 'pm-2-1',
          title: '竞品调研报告',
          description: '选择一款你常用的APP，完成一份竞品分析报告。',
          requirements: '提交报告：产品定位、核心功能对比、优劣势分析、改进建议',
          xpReward: 80,
        },
      ],
    },
    {
      id: 'pm-3',
      name: '原型设计',
      description: '学习使用工具制作产品原型',
      level: 3,
      unlocked: false,
      completed: false,
      x: 225,
      y: 200,
      tasks: [
        {
          id: 'pm-3-1',
          title: '低保真原型',
          description: '为一个功能模块画出线框图和交互流程。',
          requirements: '提交线框图和交互流程图，至少包含5个页面/状态',
          xpReward: 100,
        },
        {
          id: 'pm-3-2',
          title: '用户测试方案',
          description: '设计一套用户测试方案来验证你的原型。',
          requirements: '提交测试方案：测试目标、测试任务、用户招募标准、成功指标',
          xpReward: 100,
        },
      ],
    },
    {
      id: 'pm-4',
      name: '数据分析',
      description: '用数据驱动产品决策',
      level: 4,
      unlocked: false,
      completed: false,
      x: 150,
      y: 320,
      tasks: [
        {
          id: 'pm-4-1',
          title: '数据指标体系',
          description: '为一个产品设计核心数据指标体系。',
          requirements: '设计指标体系：北极星指标、关键漏斗指标、留存指标，并说明为什么',
          xpReward: 100,
        },
      ],
    },
    {
      id: 'pm-5',
      name: '项目实战',
      description: '从0到1完成一个完整产品方案',
      level: 5,
      unlocked: false,
      completed: false,
      x: 300,
      y: 320,
      tasks: [
        {
          id: 'pm-5-1',
          title: '产品方案书',
          description: '完成一份完整的产品方案书，包含所有前置技能的综合运用。',
          requirements: '提交完整方案：需求分析、竞品分析、原型设计、数据指标、项目排期、商业模式',
          xpReward: 200,
        },
      ],
    },
  ],
  frontend: [
    {
      id: 'fe-1',
      name: 'HTML & CSS',
      description: '掌握网页结构基础与样式',
      level: 1,
      unlocked: true,
      completed: false,
      x: 150,
      y: 80,
      tasks: [
        {
          id: 'fe-1-1',
          title: '个人主页',
          description: '用HTML+CSS完成一个个人介绍页面。',
          requirements: '提交代码：包含导航、个人介绍、技能列表、联系方式等区域，要求响应式布局',
          xpReward: 50,
        },
      ],
    },
    {
      id: 'fe-2',
      name: 'JavaScript 基础',
      description: '学习JS核心概念和DOM操作',
      level: 2,
      unlocked: false,
      completed: false,
      x: 300,
      y: 80,
      tasks: [
        {
          id: 'fe-2-1',
          title: 'Todo应用',
          description: '用原生JS实现一个Todo待办应用。',
          requirements: '提交代码：支持添加、删除、标记完成、过滤功能，数据存localStorage',
          xpReward: 80,
        },
      ],
    },
    {
      id: 'fe-3',
      name: 'React 框架',
      description: '学习现代前端框架React',
      level: 3,
      unlocked: false,
      completed: false,
      x: 225,
      y: 200,
      tasks: [
        {
          id: 'fe-3-1',
          title: '组件化重构',
          description: '将之前的Todo应用用React重构。',
          requirements: '使用React hooks、组件拆分、状态管理，附组件结构说明',
          xpReward: 100,
        },
      ],
    },
    {
      id: 'fe-4',
      name: 'API & 后端交互',
      description: '学习前后端数据交互',
      level: 4,
      unlocked: false,
      completed: false,
      x: 150,
      y: 320,
      tasks: [
        {
          id: 'fe-4-1',
          title: '天气应用',
          description: '调用公开API完成一个天气查询应用。',
          requirements: '接入天气API，显示当前天气和未来预报，包含搜索城市功能，处理加载和错误状态',
          xpReward: 100,
        },
      ],
    },
    {
      id: 'fe-5',
      name: '全栈项目',
      description: '完成一个完整的全栈应用',
      level: 5,
      unlocked: false,
      completed: false,
      x: 300,
      y: 320,
      tasks: [
        {
          id: 'fe-5-1',
          title: '博客系统',
          description: '从前后端到数据库完成一个博客系统。',
          requirements: '包含文章CRUD、用户登录、评论、搜索功能，附项目文档',
          xpReward: 200,
        },
      ],
    },
  ],
  data: [
    {
      id: 'dt-1',
      name: '数据思维',
      description: '建立数据分析的基本思维方式',
      level: 1,
      unlocked: true,
      completed: false,
      x: 150,
      y: 80,
      tasks: [
        {
          id: 'dt-1-1',
          title: '数据叙事',
          description: '找一个公开数据，用数据讲一个故事。',
          requirements: '选定一个数据集，提出3个问题，用数据回答，形成一份数据故事报告',
          xpReward: 50,
        },
      ],
    },
    {
      id: 'dt-2',
      name: 'Excel / 表格工具',
      description: '掌握数据整理和基础分析工具',
      level: 2,
      unlocked: false,
      completed: false,
      x: 300,
      y: 80,
      tasks: [
        {
          id: 'dt-2-1',
          title: '数据清洗与分析',
          description: '对一个脏数据集进行清洗和分析。',
          requirements: '提交清洗后的数据 + 数据透视表 + 3个关键发现 + 可视化图表',
          xpReward: 80,
        },
      ],
    },
    {
      id: 'dt-3',
      name: 'SQL 数据库',
      description: '学习SQL查询语言',
      level: 3,
      unlocked: false,
      completed: false,
      x: 225,
      y: 200,
      tasks: [
        {
          id: 'dt-3-1',
          title: 'SQL练习题',
          description: '完成一套SQL查询练习题。',
          requirements: '完成至少10道SQL查询题，覆盖SELECT/JOIN/GROUP BY/子查询/窗口函数',
          xpReward: 100,
        },
      ],
    },
    {
      id: 'dt-4',
      name: '可视化',
      description: '学习数据可视化工具和方法',
      level: 4,
      unlocked: false,
      completed: false,
      x: 150,
      y: 320,
      tasks: [
        {
          id: 'dt-4-1',
          title: '数据看板',
          description: '设计并制作一个数据可视化看板。',
          requirements: '选择一个主题，制作包含至少4种图表类型的看板，附解读说明',
          xpReward: 100,
        },
      ],
    },
    {
      id: 'dt-5',
      name: '分析实战',
      description: '完成一个完整的数据分析项目',
      level: 5,
      unlocked: false,
      completed: false,
      x: 300,
      y: 320,
      tasks: [
        {
          id: 'dt-5-1',
          title: '完整分析报告',
          description: '从数据获取到最终报告的全流程分析项目。',
          requirements: '提交完整报告：业务理解、数据收集/清洗、探索分析、建模/洞察、建议方案',
          xpReward: 200,
        },
      ],
    },
  ],
  design: [
    {
      id: 'ds-1',
      name: '设计基础',
      description: '学习设计的基本原理和规范',
      level: 1,
      unlocked: true,
      completed: false,
      x: 150,
      y: 80,
      tasks: [
        {
          id: 'ds-1-1',
          title: '设计原则分析',
          description: '选择一款你喜欢的APP，分析其设计。',
          requirements: '从色彩、排版、间距、图标4个维度分析，每个维度至少2个观察点',
          xpReward: 50,
        },
      ],
    },
    {
      id: 'ds-2',
      name: '设计工具',
      description: '掌握Figma等设计工具',
      level: 2,
      unlocked: false,
      completed: false,
      x: 300,
      y: 80,
      tasks: [
        {
          id: 'ds-2-1',
          title: '界面临摹',
          description: '选择一个界面进行1:1临摹。',
          requirements: '提交临摹的Figma文件链接或截图，标注用到的工具和技巧',
          xpReward: 80,
        },
      ],
    },
    {
      id: 'ds-3',
      name: '用户研究',
      description: '学习用户研究方法',
      level: 3,
      unlocked: false,
      completed: false,
      x: 225,
      y: 200,
      tasks: [
        {
          id: 'ds-3-1',
          title: '用户画像',
          description: '为一个产品创建用户画像。',
          requirements: '创建2-3个用户画像，包含：人口统计、行为模式、目标、痛点、场景',
          xpReward: 100,
        },
      ],
    },
    {
      id: 'ds-4',
      name: '交互设计',
      description: '设计流畅的用户交互体验',
      level: 4,
      unlocked: false,
      completed: false,
      x: 150,
      y: 320,
      tasks: [
        {
          id: 'ds-4-1',
          title: '交互原型',
          description: '完成一个功能的交互动效原型。',
          requirements: '提交交互原型（Figma/Principle等），包含至少3个交互动效，附交互说明文档',
          xpReward: 100,
        },
      ],
    },
    {
      id: 'ds-5',
      name: '设计系统',
      description: '搭建完整的设计系统',
      level: 5,
      unlocked: false,
      completed: false,
      x: 300,
      y: 320,
      tasks: [
        {
          id: 'ds-5-1',
          title: '设计系统搭建',
          description: '为一个产品搭建一套设计系统。',
          requirements: '包含：颜色系统、文字层级、组件库（至少10个组件）、使用规范文档',
          xpReward: 200,
        },
      ],
    },
  ],
};
