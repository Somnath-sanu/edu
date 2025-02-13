import React from 'react';
import { Trophy, Timer, Target, Award } from 'lucide-react';
import { Stats } from './types';

interface StatsDisplayProps {
  stats: Stats;
  currentQuestionTime: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, currentQuestionTime }) => {
  const formatAccuracy = (accuracy: number): number => {
    return Math.round(accuracy);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2 bg-neutral-300 dark:bg-gray-900 drop-shadow-sm select-none">
      <div className="card ">
        <div className="flex items-center gap-2 text-primary">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium">Score</span>
        </div>
        <div className="mt-1 text-xl font-semibold text-slate-300 ">
          {formatAccuracy(stats.accuracy)}%
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <span className="stats-value text-xs sm:text-base text-primary">
            {stats.questions}
          </span>
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <span className="stats-label text-xs sm:text-sm">Questions</span>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <span className="stats-value text-yellow-500">{stats.streak}</span>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
        <span className="stats-label">Streak</span>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <span className="stats-value text-purple-500">
            {currentQuestionTime}s
          </span>
          <Timer className="w-5 h-5 text-purple-500" />
        </div>
        <span className="stats-label">Time</span>
      </div>
    </div>
  );
}; 