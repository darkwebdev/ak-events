import React from 'react';
import { Toast } from './index.jsx';

export default {
  title: 'Components/Toast',
  component: Toast,
};

export function Default() {
  return <Toast message="2 new events added" />;
}

export function SingleEvent() {
  return <Toast message="New event: Stronghold Protocol Alliance Part 2" />;
}
