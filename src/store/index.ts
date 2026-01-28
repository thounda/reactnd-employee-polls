/**
 * FILE: src/store/index.ts
 * DESCRIPTION:
 * Barrel file for the store folder.
 * This simplifies imports throughout the app. 
 * We use a single named export here because store.ts 
 * exports the store instance as a named constant.
 */

// Export everything from store.ts (store, RootState, and AppDispatch)
export * from './store';