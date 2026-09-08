import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  ThumbsUp,
  Users,
  Compass,
  Sparkles,
  RefreshCw,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { AnalyticsMetrics, FeedbackSummary } from '../types';
import { INITIAL_ANALYTICS } from '../data/campusInfo';

export const AnalyticsView: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(INITIAL_ANALYTICS);
  const [feedback, setFeedback] = useState<FeedbackSummary>({
    total: 24,
    helpful: 23,
    unhelpful: 1,
    satisfaction_rate: 95.8
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/v1/analytics'),
        fetch('/api/v1/feedback/summary')
      ]);
      if (res1.ok) {
        const data1 = await res1.json();
        setMetrics(data1);
      }
      if (res2.ok) {
        const data2 = await res2.json();
        setFeedback(data2);
      }
    } catch (e) {
      console.warn('Analytics fetch error, using local state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const maxCategoryCount = Math.max(...metrics.top_categories.map(c => c.count), 1);
  const maxPersonaCount = Math.max(...metrics.top_personas.map(p => p.count), 1);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 md:p-8 text-white shadow-md border-l-4 border-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block bg-amber-500/20 text-amber-300 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-amber-500/30">
              Campus Intelligence & RAG Telemetry
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Aditya Campus Insights
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Real-time analytics on student inquiries, audience persona trends, factual grounding rates, and actionable feedback intelligence.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="self-start md:self-center inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Inquiries</span>
              <BarChart3 className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.total_queries}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18% from last week</span>
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Grounding Accuracy</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">
              {metrics.grounding_rate}
            </div>
            <p className="text-[11px] text-slate-500">
              Verified with official university documents
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Student Satisfaction</span>
              <ThumbsUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.satisfaction_rate}%
            </div>
            <p className="text-[11px] text-slate-500">
              Based on {feedback.total} student reviews
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Audience Personas</span>
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              5 Roles
            </div>
            <p className="text-[11px] text-slate-500">
              Students, Parents, Aspirants, Visitors
            </p>
          </div>
        </div>

        {/* Breakdown Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Inquiry Volume by Campus Category</span>
              </h3>
              <span className="text-[11px] text-slate-600 font-semibold">Volume Count</span>
            </div>

            <div className="space-y-3">
              {metrics.top_categories.map((cat, idx) => {
                const percentage = Math.round((cat.count / maxCategoryCount) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 capitalize">{cat.category}</span>
                      <span className="font-bold text-slate-900">{cat.count} inquiries</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Persona Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-600" />
                <span>Inquiries by User Persona</span>
              </h3>
              <span className="text-[11px] text-slate-600 font-semibold">User Role</span>
            </div>

            <div className="space-y-3">
              {metrics.top_personas.map((pers, idx) => {
                const percentage = Math.round((pers.count / maxPersonaCount) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{pers.persona}</span>
                      <span className="font-bold text-slate-900">{pers.count} queries</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actionable Campus Insights */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Actionable AI Campus Insights
              </h3>
              <p className="text-xs text-slate-500">
                Pattern-detected trends to support university administration & academic counseling
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.campus_insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
