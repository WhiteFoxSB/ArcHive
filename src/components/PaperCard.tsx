import { FileText, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Paper } from '@/types/paper';

interface PaperCardProps {
  paper: Paper;
  onClick: () => void;
}

export function PaperCard({ paper, onClick }: PaperCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-6 rounded-lg border border-border bg-gradient-card hover:shadow-paper hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {paper.originalName.replace('.pdf', '')}
          </h3>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(paper.dateAdded)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{formatFileSize(paper.fileSize)}</span>
            </div>
          </div>
          
          {paper.tags.length > 0 && (
            <div className="flex items-center space-x-2 mt-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {paper.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}