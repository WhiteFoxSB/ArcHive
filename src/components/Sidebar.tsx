import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Folder, FolderOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from './SearchBar';
import { Paper, Category } from '@/types/paper';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  categories: Category[];
  papers: Paper[];
  selectedPaper: Paper | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryClick: (categoryName: string) => void;
  onPaperClick: (paper: Paper) => void;
  viewMode: 'home' | 'category' | 'search';
  selectedCategory: string;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  categories,
  papers,
  selectedPaper,
  searchQuery,
  onSearchChange,
  onCategoryClick,
  onPaperClick,
  viewMode,
  selectedCategory
}: SidebarProps) {
  const navigate = useNavigate();

  const filteredCategories = categories
  const filteredPapers = papers;


  return (
    <div className={`
      bg-card border-r border-border h-full transition-all duration-300 flex flex-col
      ${isCollapsed ? 'w-16' : 'w-80'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="font-semibold text-foreground">Library</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hover:bg-secondary"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isCollapsed ? (
          // Collapsed state - just icons
          <div className="p-2 space-y-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full hover:bg-secondary"
              onClick={() => onToggleCollapse()}
            >
              <Folder className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          // Expanded state
          <div className="p-4 space-y-4 h-full overflow-y-auto">
            {/* Projects (currently a button) */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/projects')}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Projects
              </Button>
            </div>

            {/* Categories */}
            {viewMode !== 'search' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                  <Folder className="h-4 w-4" />
                  <span>Categories</span>
                </div>
                <div className="space-y-1">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => onCategoryClick(category.name)}
                      className={`
                        flex items-center justify-between p-2 rounded-md cursor-pointer
                        hover:bg-secondary transition-colors
                        ${selectedCategory === category.name ? 'bg-secondary border-primary/20' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${category.color} flex-shrink-0`} />
                        <span className="text-sm truncate">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {category.paperCount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Papers */}
            {(viewMode === 'category' || viewMode === 'search') && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Papers ({filteredPapers.length})</span>
                </div>
                <div className="space-y-1">
                  {filteredPapers.map((paper) => (
                    <div
                      key={paper.id}
                      onClick={() => onPaperClick(paper)}
                      className={`
                        p-2 rounded-md cursor-pointer transition-colors
                        hover:bg-secondary
                        ${selectedPaper?.id === paper.id ? 'bg-secondary border-primary/20' : ''}
                      `}
                    >
                      <div className="text-sm font-medium truncate mb-1">
                        {paper.originalName.replace('.pdf', '')}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {paper.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {paper.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{paper.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}