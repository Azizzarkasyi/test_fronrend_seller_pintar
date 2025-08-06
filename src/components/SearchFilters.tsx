import {Search} from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  selectedTag: string;
  tags: Array<{id: number; name: string; count: number}>;
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
}

export default function SearchFilters({
  searchTerm,
  selectedTag,
  tags,
  onSearchChange,
  onTagChange,
}: SearchFiltersProps) {
  return (
    <div className="relative flex-1 min-w-0">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
      />
    </div>
  );
}
