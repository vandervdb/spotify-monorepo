import React from 'react';
import { render } from '@testing-library/react-native';
import { DefaultApp } from './DefaultApp';

jest.mock('@react-native-spotify/core-logger', () => ({
  log: {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('DefaultApp without Provider', () => {
  it('throw une erreur claire quand le Provider manque', () => {
    expect(() => render(<DefaultApp />)).toThrow(
      'AuthStoreContext.Provider missing in component tree',
    );
  });
});
