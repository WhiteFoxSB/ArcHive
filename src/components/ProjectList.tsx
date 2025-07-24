import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectListProps {
  projects: Project[];
  title?: string;
  onBack?: () => void;
  onProjectClick: (project: Project) => void;
  onCreateProject: () => void;
}

export function ProjectList({ projects, title, onBack, onProjectClick, onCreateProject }: ProjectListProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {title && (
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          )}
        </div>
        <Button onClick={onCreateProject} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first project to organize your research papers
          </p>
          <Button onClick={onCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={onProjectClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}