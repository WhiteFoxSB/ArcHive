import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Tags, ZoomIn, ZoomOut, X, Home } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Paper } from '@/types/paper';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PaperViewerProps {
  paper: Paper;
  onClose: () => void;
}

export function PaperViewer({ paper, onClose }: PaperViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const handleOpenExternal = () => {
    // Create a blob URL from the file path and open it
    if (paper.filePath.startsWith('blob:') || paper.filePath.startsWith('data:')) {
      window.open(paper.filePath, '_blank');
    } else {
      // For local files, try to open them
      window.open(paper.filePath, '_blank');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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
            <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Library
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

      {/* PDF Viewer Controls */}
      {numPages > 0 && (
        <div className="border-b border-border px-6 py-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                disabled={pageNumber >= numPages}
              >
                Next
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(Math.min(2.0, scale + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-muted/10">
        <div className="flex justify-center p-6">
          <Document
            file={{ url: `file://${paper.filePath}` }}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto animate-pulse">
                    <ExternalLink className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Loading PDF...</p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto">
                    <ExternalLink className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Unable to load PDF</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is a demo with simulated files
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={handleOpenExternal}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Try external viewer
                    </Button>
                  </div>
                </div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}