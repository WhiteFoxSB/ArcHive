export interface Paper {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  dateAdded: string;
  tags: string[];
  fileSize: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  paperCount: number;
}

export interface PaperDatabase {
  papers: Paper[];
  categories: Category[];
  lastId: number;
}