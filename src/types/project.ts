export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  dateCreated: string;
  paperIds: string[];
  paperCount: number;
}

export interface ProjectDatabase {
  projects: Project[];
  lastProjectId: number;
}