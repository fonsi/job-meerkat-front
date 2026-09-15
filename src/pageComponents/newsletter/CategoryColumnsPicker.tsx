import { CategoryTree } from '@/category/category';
import {
    CategoryColumn,
    CategoryColumns,
    CategoryGroup,
    CategoryGroupTitle,
    CheckboxRow,
} from './newsletterLayout';

const ENGINEERING_GROUP = 'Engineering';

const toggleValue = (values: string[], value: string): string[] =>
    values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];

type Props = {
    categories: CategoryTree;
    selected: string[];
    onChange: (selected: string[]) => void;
};

export const CategoryColumnsPicker = ({
    categories,
    selected,
    onChange,
}: Props) => {
    const renderCategoryGroup = (group: CategoryTree[number]) => (
        <CategoryGroup key={group.name}>
            <CategoryGroupTitle>{group.name}</CategoryGroupTitle>
            {group.categories.map((category) => (
                <CheckboxRow key={category.slug}>
                    <input
                        type="checkbox"
                        checked={selected.includes(category.slug)}
                        onChange={() =>
                            onChange(toggleValue(selected, category.slug))
                        }
                    />
                    {category.name}
                </CheckboxRow>
            ))}
        </CategoryGroup>
    );

    return (
        <CategoryColumns>
            <CategoryColumn>
                {categories
                    .filter((group) => group.name === ENGINEERING_GROUP)
                    .map(renderCategoryGroup)}
            </CategoryColumn>
            <CategoryColumn>
                {categories
                    .filter((group) => group.name !== ENGINEERING_GROUP)
                    .map(renderCategoryGroup)}
            </CategoryColumn>
        </CategoryColumns>
    );
};
