import React from 'react';
import { Orundum } from './index.jsx';

export default {
  title: 'Components/Orundum',
  component: Orundum,
};

export const Default = () => <Orundum>1200</Orundum>;

export const WithPulls = () => <Orundum withPulls>1200</Orundum>;

export const NoPulls = () => <Orundum withPulls={false}>1200</Orundum>;

export const SmallAmount = () => <Orundum withPulls>300</Orundum>;

export const LargeAmount = () => <Orundum withPulls>3600</Orundum>;

export const SmallAmountWithPrecision = () => <Orundum withPulls pullsPrecision={3}>100</Orundum>;

export const LargeAmountWithPrecision = () => <Orundum withPulls pullsPrecision={1}>3600</Orundum>;

export const NoOrundum = () => <Orundum></Orundum>;

export const ZeroOrundum = () => <Orundum>0</Orundum>;

export const ZeroOrundumWithPulls = () => <Orundum withPulls>0</Orundum>;

export const ZeroOrundumWithPrecision = () => <Orundum withPulls pullsPrecision={1}>0</Orundum>;