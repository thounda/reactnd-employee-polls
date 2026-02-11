/**
File: src/store/index.ts
Purpose: Central export point for the Redux store and custom hooks.
Providing a single entry point simplifies imports throughout the
component tree, allowing developers to import 'store', 'useAppDispatch',
and 'useAppSelector' from a single location.
*/

export * from './store';
export * from './hooks';