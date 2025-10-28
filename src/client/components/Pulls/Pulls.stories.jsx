import React from 'react';
import { Pulls } from './index.jsx';

export default {
  title: 'Components/Pulls',
  component: Pulls,
};

export function Singular() {
  return <Pulls>1</Pulls>;
}

export function Plural() {
  return <Pulls>2</Pulls>;
}

export function Zero() {
  return <Pulls>0</Pulls>;
}

export function Decimal() {
  return <Pulls>2.5</Pulls>;
}
