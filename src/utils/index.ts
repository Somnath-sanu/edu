export const getQueriesTypeColor = (type: string): string => {
  switch (type) {
    case "curiosity":
      return "bg-blue-500/20 text-blue-400";
    case "mechanism":
      return "bg-green-500/20 text-green-400";
    case "causality":
      return "bg-yellow-500/20 text-yellow-400";
    case "innovation":
      return "bg-purple-500/20 text-purple-400";
    case "insight":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

export const getTopicsTypeColor = (type: string) => {
  switch (type) {
    case "prerequisite":
      return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30";
    case "extension":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30";
    case "application":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30";
    case "parallel":
      return "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30 hover:bg-fuchsia-500/30";
    case "deeper":
      return "bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30";
  }
};
