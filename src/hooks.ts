/**
 * File: src/hooks.ts
 * Description:
 * This file provides typed versions of the standard React-Redux hooks.
 * In a TypeScript environment, using 'useSelector' directly often results in 
 * 'state' being typed as 'any'. By exporting these pre-typed hooks, we ensure 
 * full IDE autocompletion and type safety throughout the component tree.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * useAppDispatch:
 * A pre-typed version of 'useDispatch'. This ensures that any thunks or 
 * actions dispatched are checked against the store's actual Dispatch type.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * useAppSelector:
 * A pre-typed version of 'useSelector'. This automatically maps the 
 * state argument to our 'RootState' interface, providing full 
 * IntelliSense for the global state object.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;