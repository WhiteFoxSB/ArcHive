export interface Paper {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  dateAdded: string;
  tags: string[];
  fileSize: number;
  projectIds: string[];

  // New metadata fields
  authors: string[];
  journal: string;
  yearPublished: number;
  doi: string;
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
