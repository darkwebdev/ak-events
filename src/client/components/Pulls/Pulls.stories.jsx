import React from 'react';
import { Pulls } from './index.jsx';

export default {
  title: 'Components/Pulls',
  component: Pulls,
};

export const Singular = () => <Pulls>1</Pulls>;

export const Plural = () => <Pulls>2</Pulls>;

export const Zero = () => <Pulls>0</Pulls>;

export const Decimal = () => <Pulls>2.5</Pulls>;