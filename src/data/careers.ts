// 职业方向预设数据
export interface Career {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const careers: Career[] = [
  {
    id: 'pm',
    name: '产品经理',
    icon: '📋',
    description: '从需求分析到产品落地，学习定义和迭代产品',
    color: '#4A90D9',
  },
  {
    id: 'frontend',
    name: '前端开发',
    icon: '💻',
    description: '学习网页与应用的前端技术，构建用户界面',
    color: '#5BA4E6',
  },
  {
    id: 'data',
    name: '数据分析',
    icon: '📊',
    description: '用数据驱动决策，掌握分析和可视化技能',
    color: '#3CB371',
  },
  {
    id: 'design',
    name: 'UI/UX 设计',
    icon: '🎨',
    description: '设计美好的用户体验，从原型到界面落地',
    color: '#9B59B6',
  },
];
