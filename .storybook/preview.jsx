import React from 'react';
import '../src/client/App.css';
import './global.css';

export const decorators = [
  (Story) => (
    <div className="storybook-wrapper">
      <Story />
    </div>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
};