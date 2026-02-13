import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

/**
 * FILE: src/test-utils.tsx
 * DESCRIPTION: Custom render function for testing Redux-connected components.
 * FIX: Resolved environment resolution issues while maintaining 
 * RTK 2.0+ compatibility using combineReducers for state inference.
 */

// @ts-ignore - Importing from slices for the store setup
import usersReducer from './slices/usersSlice';
// @ts-ignore
import questionsReducer from './slices/questionsSlice';
// @ts-ignore
import authedUserReducer from './slices/authedUserSlice';

/**
 * Combine all slice reducers to create the root reducer.
 */
const rootReducer = combineReducers({
  users: usersReducer,
  questions: questionsReducer,
  authedUser: authedUserReducer,
});

// Infer the RootState type from the combined reducer
type RootState = ReturnType<typeof rootReducer>;

/**
 * Extended options for the custom render function.
 * Allows passing a partial state to mock specific data.
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: any;
}

/**
 * renderWithProviders wraps the component under test in a Redux Provider.
 * This ensures that components using hooks like 'useAppSelector'
 * have access to a valid store instance during testing.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Create a new store instance for every test to prevent state pollution
    store = configureStore({ 
      reducer: rootReducer, 
      preloadedState: preloadedState as any
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  }

  // Return the store instance so tests can inspect state or dispatch actions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}