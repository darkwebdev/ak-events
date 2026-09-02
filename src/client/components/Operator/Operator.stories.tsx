import React from 'react';
import { Operator } from './index.jsx';
import type { ResolvedBannerOperator } from '../../types.js';

interface OperatorArgs {
  name: string;
  star: number;
  opClass: string;
  limited: boolean;
  sparkCost: string;
}

function renderOperator({ name, star, opClass, limited, sparkCost }: OperatorArgs) {
  const operator: ResolvedBannerOperator = {
    name,
    star,
    class: opClass,
    limited,
    icon: null,
    sparkCost: sparkCost === 'None' ? null : Number(sparkCost),
  };
  return (
    <div style={{ padding: '24px' }}>
      <Operator operator={operator} />
    </div>
  );
}

export default {
  title: 'Components/Operator',
  component: Operator,
  argTypes: {
    name: { control: 'text' },
    star: {
      control: 'select',
      options: [6, 5, 4],
      description: 'Rarity — only 6★/5★ ever carry a spark cost',
    },
    opClass: { control: 'text', description: 'Operator class, e.g. Guard, Caster' },
    limited: {
      control: 'boolean',
      description:
        'Whether this is a Limited (exclusive) operator — adds the gold ring + LIMITED tag. Every sparkable operator is also Limited, so a sparkCost with limited:false is not a real combination.',
    },
    sparkCost: {
      control: 'select',
      options: ['None', '75', '200', '300'],
      description:
        'Headhunting Data Contract cost. 200 renders in the darker "reduced cost" color; None means not (yet) spark-redeemable.',
    },
  },
  render: renderOperator,
};

export const Plain = {
  args: { name: 'Mudrock', star: 6, opClass: 'Defender', limited: false, sparkCost: 'None' },
};

export const Limited = {
  args: { name: 'Chongyue', star: 6, opClass: 'Guard', limited: true, sparkCost: 'None' },
};

export const Sparkable = {
  args: {
    name: 'Exusiai the New Covenant',
    star: 6,
    opClass: 'Specialist',
    limited: true,
    sparkCost: '300',
  },
};

export const ReducedSparkCost = {
  args: { name: "Ch'en the Holungday", star: 6, opClass: 'Guard', limited: true, sparkCost: '200' },
};

export const FiveStarSparkable = {
  args: { name: 'Crackborne', star: 5, opClass: 'Defender', limited: true, sparkCost: '75' },
};
