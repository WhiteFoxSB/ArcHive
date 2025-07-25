import { useState, useEffect } from 'react';
import { FolderOpen, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProjectList } from '@/components/ProjectList';
import { PaperList } from '@/components/PaperList';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { FloatingUploadButton } from '@/components/FloatingUploadButton';
import { UploadModal } from '@/components/UploadModal';
import { TaggingModal } from '@/components/TaggingModal';
import { projectStorage, paperStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/project';
import { Paper } from '@/types/paper';

type ViewMode = 'projects' | 'project-papers';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectPapers, setProjectPapers] = useState<Paper[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('projects');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [taggingModalOpen, setTaggingModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = projectStorage.getAllProjects();
    setProjects(allProjects);
  };

  const handleProjectClick = (project: Project) => {
    const papers = projectStorage.getProjectPapers(project.id);
    setSelectedProject(project);
    setProjectPapers(papers);
    setViewMode('project-papers');
  };

  const handleBackToProjects = () => {
    setViewMode('projects');
    setSelectedProject(null);
    setProjectPapers([]);
  };

  const handleCreateProject = (name: string, description: string, color: string) => {
    try {
      const newProject = projectStorage.createProject(name, description, color);
      loadProjects();
      
      toast({
        title: "Project created!",
        description: `${newProject.name} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error creating project",
        description: "There was a problem creating your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTaggingModalOpen(true);
  };

  const handleTaggingComplete = (tags: string[]) => {
    if (selectedFile && selectedProject) {
      try {
        const newPaper = paperStorage.addPaper(selectedFile, tags, [selectedProject.id]);
        projectStorage.addPaperToProject(selectedProject.id, newPaper.id);
        
        // Refresh project papers if viewing a project
        if (viewMode === 'project-papers') {
          const papers = projectStorage.getProjectPapers(selectedProject.id);
          setProjectPapers(papers);
        }
        
        loadProjects(); // Refresh projects to update paper counts
        
        toast({
          title: "Paper added to project!",
          description: `${newPaper.originalName} has been added to ${selectedProject.name}.`,
        });
        
        setSelectedFile(null);
      } catch (error) {
        toast({
          title: "Error adding paper",
          description: "There was a problem adding the paper to your project.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePaperClick = (paper: Paper) => {
    // For now, just show a toast. Later this could open the paper viewer
    toast({
      title: "Opening paper",
      description: `${paper.originalName} would open in the PDF viewer.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Projects</h1>
                <p className="text-sm text-muted-foreground">Organize papers into research projects</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Library
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {viewMode === 'projects' ? (
          <ProjectList
            projects={projects}
            onProjectClick={handleProjectClick}
            onCreateProject={() => setCreateModalOpen(true)}
          />
        ) : (
          <PaperList
            papers={projectPapers}
            title={`Papers in ${selectedProject?.name}`}
            onBack={handleBackToProjects}
            onPaperClick={handlePaperClick}
          />
        )}
      </div>

      {/* Floating Upload Button - only show when viewing a project */}
      {viewMode === 'project-papers' && (
        <FloatingUploadButton onClick={() => setUploadModalOpen(true)} />
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onComplete={handleCreateProject}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onFileSelect={handleFileSelect}
      />

      <TaggingModal
        isOpen={taggingModalOpen}
        onClose={() => setTaggingModalOpen(false)}
        onComplete={handleTaggingComplete}
        fileName={selectedFile?.name || ''}
      />
    </div>
  );
};

export default Projects;