import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
    test('should render', () => {
        render(<Badge>Test text</Badge>);

        screen.getByText('Test text');
    });
});
