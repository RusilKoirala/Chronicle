import { Achievement } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AchievementFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: Achievement['type'] | 'all';
  onFilterChange: (value: Achievement['type'] | 'all') => void;
  totalCount: number;
  filteredCount: number;
}

export function AchievementFilter({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  totalCount,
  filteredCount
}: AchievementFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search achievements..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={filterType} onValueChange={onFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="book">Books</SelectItem>
          <SelectItem value="certificate">Certificates</SelectItem>
          <SelectItem value="skill">Skills</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
        {filteredCount === totalCount ? (
          <span>{totalCount} achievement{totalCount !== 1 ? 's' : ''}</span>
        ) : (
          <span>{filteredCount} of {totalCount} achievement{totalCount !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
}