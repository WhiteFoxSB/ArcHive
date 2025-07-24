import { Paper, Category, PaperDatabase } from '@/types/paper';
import { Project, ProjectDatabase } from '@/types/project';

const STORAGE_KEY = 'research_papers_db';
const PROJECTS_STORAGE_KEY = 'research_projects_db';

// Default categories for research papers
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Machine Learning', color: 'bg-blue-500', paperCount: 0 },
  { id: '2', name: 'Computer Science', color: 'bg-green-500', paperCount: 0 },
  { id: '3', name: 'Mathematics', color: 'bg-purple-500', paperCount: 0 },
  { id: '4', name: 'Physics', color: 'bg-red-500', paperCount: 0 },
  { id: '5', name: 'Biology', color: 'bg-emerald-500', paperCount: 0 },
  { id: '6', name: 'Chemistry', color: 'bg-orange-500', paperCount: 0 },
  { id: '7', name: 'Engineering', color: 'bg-cyan-500', paperCount: 0 },
  { id: '8', name: 'Research Methods', color: 'bg-indigo-500', paperCount: 0 },
];

class PaperStorage {
  private getDatabase(): PaperDatabase {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      papers: [],
      categories: DEFAULT_CATEGORIES,
      lastId: 0
    };
  }

  private saveDatabase(db: PaperDatabase): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  public getAllPapers(): Paper[] {
    const db = this.getDatabase();
    return db.papers.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  }

  public getPapersByCategory(categoryName: string): Paper[] {
    const papers = this.getAllPapers();
    return papers.filter(paper => paper.tags.includes(categoryName));
  }

  public searchPapers(query: string): Paper[] {
    const papers = this.getAllPapers();
    const lowercaseQuery = query.toLowerCase();
    return papers.filter(paper => 
      paper.fileName.toLowerCase().includes(lowercaseQuery) ||
      paper.originalName.toLowerCase().includes(lowercaseQuery) ||
      paper.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  public addPaper(file: File, tags: string[], projectIds: string[] = []): Paper {
    const db = this.getDatabase();
    db.lastId += 1;
    
    const paper: Paper = {
      id: db.lastId.toString(),
      fileName: file.name,
      originalName: file.name,
      filePath: `/papers/${db.lastId}_${file.name}`, // Simulated path
      dateAdded: new Date().toISOString(),
      tags,
      fileSize: file.size,
      projectIds
    };

    db.papers.push(paper);
    this.updateCategoryPaperCounts(db);
    this.saveDatabase(db);
    
    return paper;
  }

  public getAllCategories(): Category[] {
    const db = this.getDatabase();
    return db.categories.filter(cat => cat.paperCount > 0);
  }

  public getAllCategoriesWithEmpty(): Category[] {
    const db = this.getDatabase();
    return db.categories;
  }

  public addCategory(name: string): Category {
    const db = this.getDatabase();
    const existingCategory = db.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    
    if (existingCategory) {
      return existingCategory;
    }

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-emerald-500', 'bg-orange-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500'];
    const newCategory: Category = {
      id: (db.categories.length + 1).toString(),
      name,
      color: colors[db.categories.length % colors.length],
      paperCount: 0
    };

    db.categories.push(newCategory);
    this.saveDatabase(db);
    
    return newCategory;
  }

  private updateCategoryPaperCounts(db: PaperDatabase): void {
    db.categories.forEach(category => {
      category.paperCount = db.papers.filter(paper => paper.tags.includes(category.name)).length;
    });
  }

  public deletePaper(paperId: string): void {
    const db = this.getDatabase();
    db.papers = db.papers.filter(paper => paper.id !== paperId);
    this.updateCategoryPaperCounts(db);
    this.saveDatabase(db);
  }

  public getCategoryNames(): string[] {
    const db = this.getDatabase();
    return db.categories.map(cat => cat.name);
  }
}

class ProjectStorage {
  private getDatabase(): ProjectDatabase {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      projects: [],
      lastProjectId: 0
    };
  }

  private saveDatabase(db: ProjectDatabase): void {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(db));
  }

  public getAllProjects(): Project[] {
    const db = this.getDatabase();
    return db.projects.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
  }

  public createProject(name: string, description: string, color: string): Project {
    const db = this.getDatabase();
    db.lastProjectId += 1;
    
    const project: Project = {
      id: db.lastProjectId.toString(),
      name,
      description,
      color,
      dateCreated: new Date().toISOString(),
      paperIds: [],
      paperCount: 0
    };

    db.projects.push(project);
    this.saveDatabase(db);
    
    return project;
  }

  public addPaperToProject(projectId: string, paperId: string): void {
    const db = this.getDatabase();
    const project = db.projects.find(p => p.id === projectId);
    
    if (project && !project.paperIds.includes(paperId)) {
      project.paperIds.push(paperId);
      project.paperCount = project.paperIds.length;
      this.saveDatabase(db);
    }
  }

  public removePaperFromProject(projectId: string, paperId: string): void {
    const db = this.getDatabase();
    const project = db.projects.find(p => p.id === projectId);
    
    if (project) {
      project.paperIds = project.paperIds.filter(id => id !== paperId);
      project.paperCount = project.paperIds.length;
      this.saveDatabase(db);
    }
  }

  public getProjectPapers(projectId: string): Paper[] {
    const db = this.getDatabase();
    const project = db.projects.find(p => p.id === projectId);
    
    if (!project) return [];
    
    const papers = paperStorage.getAllPapers();
    return papers.filter(paper => project.paperIds.includes(paper.id));
  }

  public deleteProject(projectId: string): void {
    const db = this.getDatabase();
    db.projects = db.projects.filter(project => project.id !== projectId);
    this.saveDatabase(db);
  }
}

export const paperStorage = new PaperStorage();
export const projectStorage = new ProjectStorage();