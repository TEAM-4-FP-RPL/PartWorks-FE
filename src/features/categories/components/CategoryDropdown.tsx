import { useCategories } from '../hooks/useCategories';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

interface CategoryDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CategoryDropdown({
  value,
  onChange,
  placeholder = 'Select a category',
  disabled,
  className,
}: CategoryDropdownProps) {
  const { data, isLoading, isError } = useCategories();

  return (
    <Select
      value={value}
      onValueChange={onChange}
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
