import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingUploadButtonProps {
  onClick: () => void;
}

export function FloatingUploadButton({ onClick }: FloatingUploadButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="floating"
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full animate-float shadow-modal z-50"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}