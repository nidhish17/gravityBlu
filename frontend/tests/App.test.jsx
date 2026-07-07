import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';
import React from 'react';

// Setup pywebview mock for testing context
window.pywebview = {
  api: {
    default: {
      get_download_preferences: async () => ({ ok: true, data: {} }),
      get_save_loc: async () => ({ ok: true, data: { save_location: 'C:\\' } }),
      get_downloads: async () => ({ ok: true, data: [] })
    }
  }
};

describe('App Layout', () => {
  it('renders the navbar search input', () => {
    render(<App />);
    // The search input should have a placeholder "URL" or something similar
    const input = screen.getByPlaceholderText(/URL/i);
    expect(input).toBeDefined();
  });
});
