/**
 * File: src/store/hooks.ts
 * Purpose: This file provides custom-typed versions of the standard React-Redux hooks.
 * * By using these instead of the standard 'useDispatch' and 'useSelector', we:
 * 1. Ensure type safety throughout the application without repeating types in every component.
 * 2. Get proper IDE autocomplete for the entire Redux state tree.
 * 3. Handle Thunk dispatching correctly by using the 'AppDispatch' type.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Custom hook to use the typed Dispatch function
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook to use the typed Selector function
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;