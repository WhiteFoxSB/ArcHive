import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/paper';

interface CategoryListProps {
  categories: Category[];
  onCategoryClick: (categoryName: string) => void;
  selectedCategory?: string;
}

export function CategoryList({ categories, onCategoryClick, selectedCategory }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">No papers uploaded yet</div>
        <div className="text-sm text-muted-foreground">
          Click the + button to add your first research paper
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Categories</h2>
        <span className="text-sm text-muted-foreground">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategoryClick(category.name)}
            className={`
              group cursor-pointer p-4 rounded-lg border border-border bg-gradient-card 
              hover:shadow-soft hover:border-primary/20 transition-all duration-300
              ${selectedCategory === category.name ? 'border-primary shadow-soft' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {category.paperCount}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}