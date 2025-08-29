import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import KchDatabase from './KchDatabase';

// Mock the fetch API
global.fetch = jest.fn();

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock useAuth context
const mockUseAuth = {
  user: { role: 'BASEUSER' },
  isAuthenticated: true,
};

jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('KchDatabase', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  test('renders KCH Database header', () => {
    renderWithProviders(<KchDatabase />);
    expect(screen.getByText('KCH Key Chip Database')).toBeInTheDocument();
  });

  test('renders search input', () => {
    renderWithProviders(<KchDatabase />);
    expect(screen.getByPlaceholderText(/Search by chip type, OEM code, vehicle details/)).toBeInTheDocument();
  });

  test('renders filters toggle button', () => {
    renderWithProviders(<KchDatabase />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  test('shows onboarding modal on first visit', () => {
    // Clear localStorage to simulate first visit
    localStorage.clear();
    renderWithProviders(<KchDatabase />);
    expect(screen.getByText('Welcome to KCH Database! 🎉')).toBeInTheDocument();
  });

  test('hides onboarding modal after clicking Get Started', async () => {
    localStorage.clear();
    renderWithProviders(<KchDatabase />);
    
    const getStartedButton = screen.getByText('Get Started');
    fireEvent.click(getStartedButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Welcome to KCH Database! 🎉')).not.toBeInTheDocument();
    });
  });

  test('toggles filters panel when filters button is clicked', () => {
    renderWithProviders(<KchDatabase />);
    
    const filtersButton = screen.getByText('Filters');
    fireEvent.click(filtersButton);
    
    // Should show filters panel
    expect(screen.getByText('Make')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
  });

  test('shows loading state during search', async () => {
    // Mock a slow fetch response
    fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({
          content: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
          pageSize: 20,
          hasNext: false,
          hasPrevious: false
        })
      }), 100))
    );

    renderWithProviders(<KchDatabase />);
    
    const searchInput = screen.getByPlaceholderText(/Search by chip type, OEM code, vehicle details/);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    expect(screen.getByText('Searching transponder database...')).toBeInTheDocument();
  });

  test('redirects guest users to subscription page', () => {
    mockUseAuth.user.role = 'GUEST';
    renderWithProviders(<KchDatabase />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/subscription');
  });

  test('redirects unauthenticated users to login page', () => {
    mockUseAuth.isAuthenticated = false;
    renderWithProviders(<KchDatabase />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
