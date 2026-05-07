import { useCategories } from '../hooks/useCategories';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Plus } from 'lucide-react';

const ADD_NEW = '__add_new__';

interface CategoryDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onAddCategory?: () => void;
}

export function CategoryDropdown({
  value,
  onChange,
  placeholder = 'Select a category',
  disabled,
  className,
  onAddCategory,
}: CategoryDropdownProps) {
  const { data, isLoading, isError } = useCategories();

  const handleChange = (val: string) => {
    if (val === ADD_NEW) {
      onAddCategory?.();
      return;
    }
    onChange?.(val);
  };

  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={disabled || isLoading || isError}
    >
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={
            isLoading
              ? 'Loading categories...'
              : isError
                ? 'Failed to load'
                : placeholder
          }
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Spinner className="size-4" />
          </div>
        ) : (
          <SelectGroup>
            {onAddCategory && (
              <>
                <SelectItem
                  value={ADD_NEW}
                  className="text-primary font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" /> Tambah Kategori Baru
                  </span>
                </SelectItem>
                <SelectSeparator />
              </>
            )}
            {data?.data.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
