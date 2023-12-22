import * as React from 'react';
import type { StepIconProps } from './StepIcon';

export type StepProps = Omit<
  StepIconProps,
  'step' | 'isLast' | 'isFirst' | 'isActive' | 'isCompleted'
>;

const Step: React.FC<StepProps> = (props) => {
  const { children } = props;
  return <>{children}</>;
};

export default Step;
