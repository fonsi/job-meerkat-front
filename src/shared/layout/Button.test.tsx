import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

const clickHandler = jest.fn();

describe('Button', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should render', () => {
        render(<Button>Test button</Button>);

        const button = screen.getByRole('button');
        expect(button.textContent).toEqual('Test button');
    });

    test('should handle click', () => {
        render(<Button onClick={clickHandler}>Test button</Button>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(clickHandler).toHaveBeenCalledTimes(1);
    });
});
