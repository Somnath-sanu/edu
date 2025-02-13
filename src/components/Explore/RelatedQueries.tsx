import React from "react";
import { getQueriesTypeColor } from "../../utils";

interface RelatedQueriesProps {
  queries: Array<{
    query: string;
    type: string;
    context: string;
  }>;
  onQueryClick: (query: string) => void;
}

export const RelatedQueries: React.FC<RelatedQueriesProps> = ({
  queries,
  onQueryClick,
}) => {
  return (
    <div className="mt-6 pt-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3 px-2">
        Follow-up Questions
      </h3>
      <div className="rounded-lg bg-gray-800/50 divide-y divide-gray-700/50">
        {queries.map((query, index) => (
          <button
            key={index}
            onClick={() => onQueryClick(query.query)}
            className="w-full text-left hover:bg-gray-700/30 transition-all duration-200 group first:rounded-t-lg last:rounded-b-lg"
          >
            <div className="py-3 px-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-200 group-hover:text-primary transition-colors line-clamp-2">
                      {query.query}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getQueriesTypeColor(
                        query.type
                      )}`}
                    >
                      {query.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {query.context}
                  </p>
                </div>
                <span className="text-gray-400 group-hover:text-primary transition-colors text-lg">
                  →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
