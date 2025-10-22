import React, { useEffect, useState } from 'react';
import SlotCounter from 'react-slot-counter';
import './index.css';

export const PullCounter = ({ value }) => {
  const [counterValue, setCounterValue] = useState(0);

  useEffect(() => {
    setCounterValue(value);
  }, [value]);

  return (
    <SlotCounter
      // startValue={[
      //   <img src="images/icon-diamond-black.svg" style={{ height: '2.5rem', verticalAlign: 'middle' }} />
      // ]}
      startValue={0}
      value={counterValue}
      sequentialAnimationMode
      autoAnimationStart={false}
      animateUnchanged={false}
    />
  );
}
