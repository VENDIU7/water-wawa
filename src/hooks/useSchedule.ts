'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStorage, setStorage } from '@/lib/storage';

export interface Course {
  id: string;
  name: string;
  day: number; // 0-6, 周一开始
  startTime: string;
  endTime: string;
  location: string;
  color: string;
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

const COURSE_COLORS = ['#4A90D9', '#5BA4E6', '#3CB371', '#9B59B6', '#E67E22', '#E74C3C', '#1ABC9C'];

export function useSchedule() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCourses(getStorage<Course[]>('courses', []));
    setTodos(getStorage<TodoItem[]>('todos', []));
    setMounted(true);
  }, []);

  // 课程操作
  const addCourse = useCallback((course: Omit<Course, 'id' | 'color'>) => {
    setCourses(prev => {
      const newCourse: Course = {
        ...course,
        id: `course_${Date.now()}`,
        color: COURSE_COLORS[Math.floor(Math.random() * COURSE_COLORS.length)],
      };
      const updated = [...prev, newCourse];
      setStorage('courses', updated);
      return updated;
    });
  }, []);

  const removeCourse = useCallback((id: string) => {
    setCourses(prev => {
      const updated = prev.filter(c => c.id !== id);
      setStorage('courses', updated);
      return updated;
    });
  }, []);

  // 待办操作
  const addTodo = useCallback((title: string, date: string) => {
    setTodos(prev => {
      const newTodo: TodoItem = {
        id: `todo_${Date.now()}`,
        title,
        completed: false,
        date,
      };
      const updated = [...prev, newTodo];
      setStorage('todos', updated);
      return updated;
    });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      setStorage('todos', updated);
      return updated;
    });
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos(prev => {
      const updated = prev.filter(t => t.id !== id);
      setStorage('todos', updated);
      return updated;
    });
  }, []);

  // 获取某天的课程
  const getCoursesByDay = useCallback((day: number) => {
    return courses.filter(c => c.day === day).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [courses]);

  // 获取某天的待办
  const getTodosByDate = useCallback((date: string) => {
    return todos.filter(t => t.date === date);
  }, [todos]);

  // 计算今日完成率
  const getTodayCompletion = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTodos = todos.filter(t => t.date === today);
    if (todayTodos.length === 0) return 0;
    return Math.round((todayTodos.filter(t => t.completed).length / todayTodos.length) * 100);
  }, [todos]);

  // 检查是否有今日待办
  const hasTodayTodos = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return todos.some(t => t.date === today);
  }, [todos]);

  return {
    courses,
    todos,
    mounted,
    addCourse,
    removeCourse,
    addTodo,
    toggleTodo,
    removeTodo,
    getCoursesByDay,
    getTodosByDate,
    getTodayCompletion,
    hasTodayTodos,
  };
}
