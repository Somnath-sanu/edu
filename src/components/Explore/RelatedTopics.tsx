import { getTopicsTypeColor } from "../../utils";

interface RelatedTopicsProps {
  topics: Array<{
    topic: string;
    type: string;
    reason: string;
  }>;
  onTopicClick: (topic: string) => void;
}

export const RelatedTopics: React.FC<RelatedTopicsProps> = ({
  topics,
  onTopicClick,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-6">
      {topics.map((topic, index) => (
        <button
          key={index}
          onClick={() => onTopicClick(topic.topic)}
          className={`px-3 py-1 rounded-full text-xs font-medium border 
            transition-all duration-200 hover:scale-105 
            ${getTopicsTypeColor(topic.type)}`}
        >
          {topic.topic}
        </button>
      ))}
    </div>
  );
};
