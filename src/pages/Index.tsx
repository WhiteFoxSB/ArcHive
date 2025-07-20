import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { CategoryList } from '@/components/CategoryList';
import { PaperList } from '@/components/PaperList';
import { Sidebar } from '@/components/Sidebar';
import { PaperViewer } from '@/components/PaperViewer';
import { UploadModal } from '@/components/UploadModal';
import { TaggingModal } from '@/components/TaggingModal';
import { FloatingUploadButton } from '@/components/FloatingUploadButton';
import { paperStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Paper, Category } from '@/types/paper';

type ViewMode = 'home' | 'category' | 'search';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [taggingModalOpen, setTaggingModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchResults = paperStorage.searchPapers(searchQuery);
      setPapers(searchResults);
      setViewMode('search');
    } else if (viewMode === 'search') {
      setViewMode('home');
      setPapers([]);
    }
  }, [searchQuery]);

  const loadData = () => {
    const allCategories = paperStorage.getAllCategories();
    setCategories(allCategories);
  };

  const handleCategoryClick = (categoryName: string) => {
    const categoryPapers = paperStorage.getPapersByCategory(categoryName);
    setPapers(categoryPapers);
    setSelectedCategory(categoryName);
    setViewMode('category');
  };

  const handleBackToHome = () => {
    setViewMode('home');
    setSearchQuery('');
    setPapers([]);
    setSelectedCategory('');
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTaggingModalOpen(true);
  };

  const handleTaggingComplete = (tags: string[]) => {
    if (selectedFile) {
      try {
        const newPaper = paperStorage.addPaper(selectedFile, tags);
        loadData();
        
        toast({
          title: "Paper added successfully!",
          description: `${newPaper.originalName} has been saved with ${tags.length} tags.`,
        });

        // Simulate opening the file (in a real app, this would use system APIs)
        toast({
          title: "Opening PDF...",
          description: "The paper would now open in your default PDF viewer.",
        });
        
        setSelectedFile(null);
      } catch (error) {
        toast({
          title: "Error adding paper",
          description: "There was a problem saving your paper. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
  };

  const handleClosePaperViewer = () => {
    setSelectedPaper(null);
  };

  const getViewTitle = () => {
    if (viewMode === 'search') {
      return `Search Results for "${searchQuery}"`;
    }
    if (viewMode === 'category') {
      return `Papers in ${selectedCategory}`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-background">
      {selectedPaper ? (
        // Layout with sidebar when paper is selected
        <div className="flex h-screen">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            categories={categories}
            papers={papers}
            selectedPaper={selectedPaper}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCategoryClick={handleCategoryClick}
            onPaperClick={handlePaperClick}
            viewMode={viewMode}
            selectedCategory={selectedCategory}
          />
          <div className="flex-1 flex flex-col">
            <PaperViewer
              paper={selectedPaper}
              onClose={handleClosePaperViewer}
            />
          </div>
        </div>
      ) : (
        // Original full-width layout when no paper is selected
        <>
          {/* Header */}
          <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Research Papers</h1>
                    <p className="text-sm text-muted-foreground">Organize your academic library</p>
                  </div>
                </div>
              </div>
              
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search papers by title or tags..."
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-6 py-8">
            {viewMode === 'home' ? (
              <div className="animate-fade-in">
                <CategoryList
                  categories={categories}
                  onCategoryClick={handleCategoryClick}
                  selectedCategory={selectedCategory}
                />
              </div>
            ) : (
              <PaperList
                papers={papers}
                title={getViewTitle()}
                onBack={handleBackToHome}
                onPaperClick={handlePaperClick}
              />
            )}
          </div>
        </>
      )}

      {/* Floating Upload Button */}
      <FloatingUploadButton onClick={() => setUploadModalOpen(true)} />

      {/* Modals */}
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

export default Index;
