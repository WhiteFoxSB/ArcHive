import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Folder, FolderOpen, FileText, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Paper, Category } from '@/types/paper';
import { Project } from '@/types/project';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  categories: Category[];
  papers: Paper[];
  projects: Project[];
  selectedPaper: Paper | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryClick: (categoryName: string) => void;
  onPaperClick: (paper: Paper) => void;
  onProjectClick: (project: Project) => void;
  onTagClick?: (tag: string) => void;
  viewMode: 'home' | 'category' | 'search';
  selectedCategory: string;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  categories,
  papers,
  projects,
  selectedPaper,
  searchQuery,
  onSearchChange,
  onCategoryClick,
  onPaperClick,
  onProjectClick,
  onTagClick,
  viewMode,
  selectedCategory
}: SidebarProps) {
  const navigate = useNavigate();
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  const filteredCategories = categories || [];
  const filteredPapers = papers || [];
  const safeProjects = projects || [];

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation(); // Prevent triggering the paper click
    onTagClick?.(tag);
  };


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
            {/* Projects Section */}
            <Collapsible open={isProjectsOpen} onOpenChange={setIsProjectsOpen}>
              <div className="flex items-center justify-between">
                <CollapsibleTrigger className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex-1 justify-start p-2 rounded-md hover:bg-secondary">
                  <FolderOpen className="h-4 w-4" />
                  <span>Projects</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-secondary"
                  onClick={() => navigate('/projects')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CollapsibleContent className="space-y-1 mt-2">
                {safeProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => onProjectClick(project)}
                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-secondary transition-colors ml-4"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <Folder className="h-3 w-3 flex-shrink-0" />
                      <span className="text-sm truncate">{project.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {project.paperCount || 0}
                    </Badge>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Categories */}
            {viewMode !== 'search' && (
              <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                <CollapsibleTrigger className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full justify-start p-2 rounded-md hover:bg-secondary">
                  <Folder className="h-4 w-4" />
                  <span>Categories</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-2">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => onCategoryClick(category.name)}
                      className={`
                        flex items-center justify-between p-2 rounded-md cursor-pointer
                        hover:bg-secondary transition-colors ml-4
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
                </CollapsibleContent>
              </Collapsible>
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
                           <Badge 
                             key={tag} 
                             variant="outline" 
                             className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                             onClick={(e) => handleTagClick(e, tag)}
                           >
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