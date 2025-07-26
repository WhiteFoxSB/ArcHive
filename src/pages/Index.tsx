import { useState, useEffect } from 'react';
import { BookOpen, FolderOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /*useEffect(() => {
    console.log("🔍 Trying to call testWrite");
    if (window.electronAPI?.testWrite) {
      window.electronAPI.testWrite()
        .then((path) => {
          console.log("✅ testWrite success:", path);
        })
        .catch((err) => {
          console.error("❌ testWrite failed:", err);
        });
    } else {
      console.error("❌ testWrite not found on electronAPI");
    }
  }, []);*/
  

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


  //logging and test cases
  //console.log('window.electronAPI:', window.electronAPI);

  /*useEffect(() => {
    const test = async () => {
      const testPath = await window.electronAPI.testWrite();
      console.log('Test file written to:', testPath);
    };
    test();
  }, []);*/

  const handleFileSelect = async (file: File) => {
    try {
      const savedPath = await window.electronAPI.savePdfToStorage(file);
  
      const newPaper: Paper = {
        originalName: file.name,
        dateAdded: new Date().toISOString(),
        filePath: savedPath, // ← full path to file on disk
        tags: [],
        id: '',
        fileName: '',
        fileSize: 0,
        projectIds: [],
        authors: [],
        journal: '',
        yearPublished: 0,
        doi: ''
      };
  
      setSelectedFile(file); // Keep for TaggingModal
      setPendingPaper(newPaper); // Store for tagging completion
      setTaggingModalOpen(true);
    } catch (err) {
      toast({
        title: "Error saving PDF",
        description: "There was a problem writing the file to disk.",
        variant: "destructive",
      });
    }
  };
  
  const [pendingPaper, setPendingPaper] = useState<Paper | null>(null);

  

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
      {/* Always show layout with sidebar */}
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
          {/* Header - Always visible */}
          <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">ArcHive</h1>
                    <p className="text-sm text-muted-foreground">Organize your academic library</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/settings')}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </div>
              
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search papers by title or tags..."
              />
            </div>
          </div>

          {selectedPaper ? (
            <PaperViewer
              paper={selectedPaper}
              onClose={handleClosePaperViewer}
            />
          ) : (
            /* Main Content */
            <div className="container mx-auto px-6 py-8 flex-1 overflow-y-auto">
              {viewMode === 'home' ? (
                <div className="animate-fade-in">
                  <CategoryList
                    categories={categories}
                    onCategoryClick={handleCategoryClick}
                    selectedCategory={selectedCategory}
                    isCompact={sidebarCollapsed}
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
          )}
        </div>
      </div>

      {/* Floating Upload Button */}
      <FloatingUploadButton onClick={() => setUploadModalOpen(true)} />




      {/* Settings Button + Theme Slider */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">

        <div className="relative group">
          <button
            //variant="outline"
            onClick={() => navigate("/settings")}
            //className="ml-auto"
            className="p-3 rounded-full shadow-lg bg-card text-foreground border border-border transition-all hover:scale-105"
            aria-label="Theme Settings"
          >
            ⚙️
          </button>
          <div className="absolute top-14 right-20 w-64 bg-popover text-popover-foreground border border-border rounded-xl shadow-modal p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-sm mb-2">Theme</h3>
            <input
              type="range"
              min={0}
              max={100}
              value={theme === "dark" ? 100 : 0}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setTheme(value > 50 ? "dark" : "light");
              }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Light</span>
              <span>Dark</span>
            </div>
          </div>
        </div>
      </div>

      

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

      


      


      

console.log('window.electronAPI:', window.electronAPI);


export default Index;
