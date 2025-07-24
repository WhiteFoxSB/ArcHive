import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FolderOpen, Calendar, FileText } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 bg-gradient-card border-border/50"
      onClick={() => onClick(project)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: project.color }}
            >
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>{project.paperCount} papers</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.dateCreated).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onClick(project);
            }}
          >
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}