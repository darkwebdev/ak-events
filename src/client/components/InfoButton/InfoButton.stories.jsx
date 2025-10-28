import React from 'react';
import { InfoButton } from '.';

export default {
  title: 'Components/InfoButton',
  component: InfoButton,
};

function Template(args) {
  return <InfoButton {...args}>{args.children || 'This is a tooltip content'}</InfoButton>;
}

export const Default = Template.bind({});
Default.args = {
  title: 'Info',
  label: 'Hover or click here',
};

export const NoTitle = Template.bind({});
NoTitle.args = {
  label: 'Info',
};

export const LongContent = Template.bind({});
LongContent.args = {
  title: 'Detailed Information',
  label: 'More details',
  children:
    'This is a longer tooltip content that provides more detailed information about the feature. It can span multiple lines and include more comprehensive explanations.',
};

export const ShortLabel = Template.bind({});
ShortLabel.args = {
  title: 'Help',
  label: '?',
};

export const LongLabel = Template.bind({});
LongLabel.args = {
  title: 'Detailed Information',
  label:
    'This is a longer tooltip content that provides more detailed information about the feature. It can span multiple lines and include more comprehensive explanations.',
  children:
    'This is a longer tooltip content that provides more detailed information about the feature. It can span multiple lines and include more comprehensive explanations.',
};
