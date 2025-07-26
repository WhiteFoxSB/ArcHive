import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaperCard } from './PaperCard';
import { Paper } from '@/types/paper';

interface PaperListProps {
  papers: Paper[];
  title: string;
  onBack: () => void;
  onPaperClick: (paper: Paper) => void;
  onTagClick?: (tag: string) => void;
}

export function PaperList({ papers, title, onBack, onPaperClick, onTagClick }: PaperListProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">
            {papers.length} {papers.length === 1 ? 'paper' : 'papers'}
          </p>
        </div>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">No papers found</div>
          <div className="text-sm text-muted-foreground">
            Try adjusting your search or upload some papers
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onClick={() => onPaperClick(paper)}
              onTagClick={onTagClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}