import React from 'react';
import { Orundum } from './index.jsx';

export default {
  title: 'Components/Orundum',
  component: Orundum,
};

export function Default() {
  return <Orundum>1200</Orundum>;
}

export function WithPulls() {
  return <Orundum withPulls>1200</Orundum>;
}

export function NoPulls() {
  return <Orundum withPulls={false}>1200</Orundum>;
}

export function SmallAmount() {
  return <Orundum withPulls>300</Orundum>;
}

export function LargeAmount() {
  return <Orundum withPulls>3600</Orundum>;
}

export function SmallAmountWithPrecision() {
  return (
    <Orundum withPulls pullsPrecision={3}>
      100
    </Orundum>
  );
}

export function LargeAmountWithPrecision() {
  return (
    <Orundum withPulls pullsPrecision={1}>
      3600
    </Orundum>
  );
}

export function NoOrundum() {
  return <Orundum />;
}

export function ZeroOrundum() {
  return <Orundum>0</Orundum>;
}

export function ZeroOrundumWithPulls() {
  return <Orundum withPulls>0</Orundum>;
}

export function ZeroOrundumWithPrecision() {
  return (
    <Orundum withPulls pullsPrecision={1}>
      0
    </Orundum>
  );
}
