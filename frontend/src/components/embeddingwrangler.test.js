import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmbeddingWrangler from './EmbeddingWrangler';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test('renders EmbeddingWrangler', () => {
  render(<EmbeddingWrangler />);
  expect(screen.getByText('Embedding Wrangler')).toBeInTheDocument();
});

test('compares words', async () => {
  render(<EmbeddingWrangler />);
  
  fireEvent.change(screen.getByPlaceholderText('Enter first word'), { target: { value: 'king' } });
  fireEvent.change(screen.getByPlaceholderText('Enter second word'), { target: { value: 'queen' } });
  fireEvent.click(screen.getByText('Compare'));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/similarity'), expect.any(Object));
});

test('finds nearest neighbors', async () => {
  render(<EmbeddingWrangler />);
  
  fireEvent.change(screen.getByPlaceholderText('Enter a word'), { target: { value: 'king' } });
  fireEvent.click(screen.getByText('Find Neighbors'));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/nearest_neighbors'), expect.any(Object));
});

test('performs word arithmetic', async () => {
  render(<EmbeddingWrangler />);
  
  fireEvent.change(screen.getByPlaceholderText('Positive word'), { target: { value: 'king' } });
  fireEvent.change(screen.getByPlaceholderText('Negative word'), { target: { value: 'man' } });
  fireEvent.click(screen.getByText('Calculate'));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/word_arithmetic'), expect.any(Object));
});

test('visualizes embeddings', async () => {
  render(<EmbeddingWrangler />);
  
  fireEvent.click(screen.getByText('Visualize'));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/visualize_embeddings'), expect.any(Object));
});