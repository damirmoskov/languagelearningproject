import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the fetch function
global.fetch = jest.fn();

const mockLanguages = ["English", "French"];
const mockLevels = ["A1", "B2"];
const mockClubs = [
    { id: 1, name: "Science Club" },
    { id: 3, name: "Let's Celebrate" }
];
const mockClubContent = {
    name: "Test Holiday",
    url: "http://test.com",
    vocabulary: ["word1", "word2"],
    round_one: ["question1?"],
    round_two: ["statement1."]
};

beforeEach(() => {
  // Reset mocks before each test
  fetch.mockClear();

  // Setup default mocks
  fetch.mockImplementation((url) => {
    if (url.includes('/api/languages')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockLanguages),
      });
    }
    if (url.includes('/api/levels')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockLevels),
      });
    }
    if (url.includes('/api/speaking_clubs')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockClubs),
      });
    }
    if (url.includes('/api/speaking_clubs/3/content')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockClubContent),
      });
    }
    return Promise.reject(new Error('not found'));
  });
});

test('renders loading state and then the main app content', async () => {
  render(<App />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for the initial data to be loaded
  await waitFor(() => expect(screen.getByText(/Language Speaking Clubs/i)).toBeInTheDocument());

  expect(screen.getByText('Languages')).toBeInTheDocument();
  expect(screen.getByText('Levels')).toBeInTheDocument();
  expect(screen.getByText('Speaking Clubs')).toBeInTheDocument();

  // Check if clubs are rendered
  expect(screen.getByText('Science Club')).toBeInTheDocument();
  expect(screen.getByText("Let's Celebrate")).toBeInTheDocument();
});

test('loads and displays club content when "Load Content" is clicked', async () => {
  render(<App />);

  // Wait for initial data to load
  await waitFor(() => expect(screen.getByText("Let's Celebrate")).toBeInTheDocument());

  // Find the button for "Let's Celebrate"
  const loadButton = screen.getAllByRole('button', { name: /load content/i })[1];
  fireEvent.click(loadButton);

  // Check for loading state for the content
  expect(await screen.findByText(/loading club content/i)).toBeInTheDocument();

  // Wait for the content to be loaded and displayed
  await waitFor(() => {
    expect(screen.getByText('Test Holiday')).toBeInTheDocument();
    expect(screen.getByText('word1')).toBeInTheDocument();
    expect(screen.getByText('question1?')).toBeInTheDocument();
    expect(screen.getByText('statement1.')).toBeInTheDocument();
  });

  // Verify fetch was called for the content
  expect(fetch).toHaveBeenCalledWith('http://localhost:5002/api/speaking_clubs/3/content');
});
