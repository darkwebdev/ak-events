import React from 'react';
import { InfoButton, type InfoButtonProps } from '.';

function renderInfoButton(args: Partial<InfoButtonProps>) {
  return (
    <InfoButton title={args.title} label={args.label ?? ''}>
      {args.children || 'This is a tooltip content'}
    </InfoButton>
  );
}

export default {
  title: 'Components/InfoButton',
  component: InfoButton,
  render: renderInfoButton,
};

export const Default = {
  args: {
    title: 'Info',
    label: 'Hover or click here',
  },
};

export const NoTitle = {
  args: {
    label: 'Info',
  },
};

export const LongContent = {
  args: {
    title: 'Detailed Information',
    label: 'More details',
    children:
      'This is a longer tooltip content that provides more detailed information about the feature. It can span multiple lines and include more comprehensive explanations.',
  },
};

export const ShortLabel = {
  args: {
    title: 'Help',
    label: '?',
  },
};

export const LongLabel = {
  args: {
    title: 'Detailed Information',
    label:
      'This is a longer tooltip content that provides more detailed information about the feature. It can span multiple lines and include more comprehensive explanations.',
    children:
      'This is a longer tooltip content that provides more detailed information about the feature. It can span multiple lines and include more comprehensive explanations.',
  },
};
