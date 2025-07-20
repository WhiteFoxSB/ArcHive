import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Tags } from 'lucide-react';
import { Paper } from '@/types/paper';

interface PaperViewerProps {
  paper: Paper;
  onClose: () => void;
}

export function PaperViewer({ paper, onClose }: PaperViewerProps) {
  const handleOpenExternal = () => {
    // In a real desktop app, this would open the PDF with the system's default viewer
    // For now, we'll show a placeholder
  };

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground pr-4 break-words">
                {paper.originalName.replace('.pdf', '')}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Added {new Date(paper.dateAdded).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenExternal}
              className="flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in PDF viewer
            </Button>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
              <Tags className="h-4 w-4" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {paper.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Placeholder */}
      <div className="flex-1 p-6">
        <div className="h-full border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <ExternalLink className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">PDF Viewer Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                In the full version, this will display an integrated PDF viewer with highlighting and markup capabilities.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleOpenExternal}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in external viewer for now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}