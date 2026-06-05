'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchedule } from '@/hooks/useSchedule';
import { useWawa } from '@/hooks/useWawa';
import Link from 'next/link';

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const DAYS_SHORT = ['一', '二', '三', '四', '五', '六', '日'];

export default function SchedulePage() {
  const {
    courses, todos, mounted,
    addCourse, removeCourse,
    addTodo, toggleTodo, removeTodo,
    getCoursesByDay, getTodosByDate,
    getTodayCompletion, hasTodayTodos,
  } = useSchedule();

  const { wawa, addXp, addHydration } = useWawa();
  const [activeTab, setActiveTab] = useState<'schedule' | 'todos'>('schedule');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  });

  // 新课程表单
  const [newCourse, setNewCourse] = useState({ name: '', startTime: '08:00', endTime: '09:40', location: '', day: selectedDay });
  // 新待办
  const [newTodo, setNewTodo] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const handleAddCourse = () => {
    if (!newCourse.name.trim()) return;
    addCourse({ ...newCourse, day: selectedDay });
    setNewCourse({ name: '', startTime: '08:00', endTime: '09:40', location: '', day: selectedDay });
    setShowAddCourse(false);
    addHydration(3);
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    addTodo(newTodo.trim(), today);
    setNewTodo('');
    setShowAddTodo(false);
    addHydration(2);
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    addXp(10);
    addHydration(3);
  };

  // 加载中
  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 animate-bounce" />
        <p className="text-blue-500 text-sm">加载中...</p>
      </div>
    );
  }

  // 未创建水滴娃
  if (!wawa.name) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-6xl">📅</span>
        <p className="text-blue-600/70">请先创建你的水滴娃～</p>
        <Link href="/create-wawa" className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full text-sm">
          去创建 →
        </Link>
      </div>
    );
  }

  const todayCourses = getCoursesByDay(selectedDay);
  const todayTodos = getTodosByDate(today);

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-800">📅 日程管理</h1>
        <div className="text-xs text-blue-500">
          今日完成率 <span className="font-bold text-blue-600">{getTodayCompletion()}%</span>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex bg-white/40 rounded-xl p-1">
        {[
          { key: 'schedule' as const, label: '📖 课表', },
          { key: 'todos' as const, label: '✅ 待办', },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 课表视图 */}
      {activeTab === 'schedule' && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* 星期选择 */}
          <div className="flex gap-1">
            {DAYS_SHORT.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedDay === i
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md'
                    : 'bg-white/50 text-gray-500 hover:bg-white/70'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* 课程列表 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-blue-700">
                {DAYS[selectedDay]} 课程
              </h3>
              <button
                onClick={() => setShowAddCourse(!showAddCourse)}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              >
                + 添加课程
              </button>
            </div>

            {todayCourses.length === 0 && (
              <div className="text-center text-gray-400 py-8 text-sm">
                这天还没有课程～ 点击上方按钮添加吧 📖
              </div>
            )}

            <AnimatePresence>
              {todayCourses.map(course => (
                <motion.div
                  key={course.id}
                  className="glass-card p-3 flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div
                    className="w-1.5 h-12 rounded-full shrink-0"
                    style={{ backgroundColor: course.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{course.name}</p>
                    <p className="text-xs text-gray-400">
                      {course.startTime} - {course.endTime}
                      {course.location ? ` · ${course.location}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 添加课程表单 */}
            <AnimatePresence>
              {showAddCourse && (
                <motion.div
                  className="glass-card p-4 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="text"
                    placeholder="课程名称"
                    value={newCourse.name}
                    onChange={e => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/70 rounded-lg text-sm border border-blue-100 focus:outline-none focus:border-blue-300"
                  />
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={newCourse.startTime}
                      onChange={e => setNewCourse(prev => ({ ...prev, startTime: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-white/70 rounded-lg text-sm border border-blue-100"
                    />
                    <span className="text-gray-400 self-center">-</span>
                    <input
                      type="time"
                      value={newCourse.endTime}
                      onChange={e => setNewCourse(prev => ({ ...prev, endTime: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-white/70 rounded-lg text-sm border border-blue-100"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="上课地点（可选）"
                    value={newCourse.location}
                    onChange={e => setNewCourse(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/70 rounded-lg text-sm border border-blue-100 focus:outline-none focus:border-blue-300"
                  />
                  <button
                    onClick={handleAddCourse}
                    className="w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-medium"
                  >
                    确认添加
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* 待办视图 */}
      {activeTab === 'todos' && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-blue-700">今日待办 ({today})</h3>
            <button
              onClick={() => setShowAddTodo(!showAddTodo)}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              + 添加待办
            </button>
          </div>

          {!hasTodayTodos() && !showAddTodo && (
            <div className="text-center text-gray-400 py-8 text-sm">
              今天还没有待办事项～ 规划一下今天要做什么吧 ✅
            </div>
          )}

          <AnimatePresence>
            {todayTodos.map(todo => (
              <motion.div
                key={todo.id}
                className="glass-card p-3 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    todo.completed
                      ? 'bg-green-400 border-green-400 text-white'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {todo.completed && '✓'}
                </button>
                <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {todo.title}
                </span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                >
                  ✕
                </button>
              </motion.div>
            ))}

            {showAddTodo && (
              <motion.div
                className="glass-card p-3 flex gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <input
                  type="text"
                  placeholder="新的待办事项..."
                  value={newTodo}
                  onChange={e => setNewTodo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTodo()}
                  className="flex-1 px-3 py-2 bg-white/70 rounded-lg text-sm border border-blue-100 focus:outline-none focus:border-blue-300"
                  autoFocus
                />
                <button
                  onClick={handleAddTodo}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-medium"
                >
                  添加
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
