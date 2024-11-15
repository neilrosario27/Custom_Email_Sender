import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] }, // Ignore build/dist folder
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Include JavaScript and TypeScript files
    languageOptions: {
      ecmaVersion: 2020, // Use ECMAScript 2020 features
      globals: globals.browser, // Use browser global variables
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enable JSX
        sourceType: 'module', // Use ES Modules
      },
    },
    settings: { 
      react: { version: 'detect' } // Automatically detect React version
    },
    plugins: {
      react, // React plugin
      'react-hooks': reactHooks, // React Hooks plugin
      'react-refresh': reactRefresh, // React Refresh plugin for hot reload
    },
    rules: {
      // Recommended JavaScript rules
      ...js.configs.recommended.rules,
      
      // React recommended rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      
      // Custom rules
      'react/jsx-no-target-blank': 'off', // Disable target="_blank" security warnings
      'react-refresh/only-export-components': [
        'warn', 
        { allowConstantExport: true }
      ],
      
      // Prop validation rule (adjust as needed)
      'react/prop-types': 'off', // Disable prop-types validation (set to 'warn' or 'error' if required)
    },
  },
];
