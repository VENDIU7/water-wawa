'use client';

import { Component, type ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 p-6">
          <span className="text-5xl">💧</span>
          <h2 className="text-lg font-semibold text-blue-700">哎呀，水滴娃打了个盹...</h2>
          <p className="text-sm text-blue-500 max-w-xs">
            页面出了点小问题，可能是水流太急了～
          </p>
          <Link
            href="/"
            className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm rounded-full shadow-md hover:shadow-lg transition-all"
          >
            回到首页
          </Link>
          <p className="text-xs text-gray-400 mt-2 max-w-xs break-all">
            {this.state.errorMsg}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
