import { render } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => null);
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
  window.confirm = jest.fn(() => false);
});

test('renders scoreboard without crashing', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.volley-mark')).toBeInTheDocument();
});
