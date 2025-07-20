import { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { paperStorage } from '@/lib/storage';

interface TaggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (tags: string[]) => void;
  fileName: string;
}

export function TaggingModal({ isOpen, onClose, onComplete, fileName }: TaggingModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [availableTags] = useState(() => paperStorage.getCategoryNames());

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleAddNewTag = () => {
    const trimmedTag = newTagInput.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      paperStorage.addCategory(trimmedTag);
      setNewTagInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNewTag();
    }
  };

  const handleComplete = () => {
    if (selectedTags.length > 0) {
      onComplete(selectedTags);
      setSelectedTags([]);
      setNewTagInput('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTags([]);
    setNewTagInput('');
    onClose();
  };

  const filteredAvailableTags = availableTags.filter(tag => 
    !selectedTags.includes(tag) && 
    tag.toLowerCase().includes(newTagInput.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-primary" />
            <span>Tag Your Paper</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File info */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">File:</p>
            <p className="font-medium truncate">{fileName}</p>
          </div>

          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Tags:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="bg-primary text-primary-foreground"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 hover:text-primary-foreground/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add new tag */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Add Tags:</p>
            <div className="flex space-x-2">
              <Input
                placeholder="Type a tag name..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleAddNewTag}
                disabled={!newTagInput.trim()}
                size="icon"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Available tags */}
          {filteredAvailableTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Existing Categories:</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {filteredAvailableTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="tag"
                    size="sm"
                    onClick={() => handleTagSelect(tag)}
                    className="h-8"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={selectedTags.length === 0}
              className="bg-gradient-primary"
            >
              Save Paper ({selectedTags.length} tags)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}