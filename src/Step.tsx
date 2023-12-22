import * as React from 'react';
import type { StepIconProps } from './StepIcon';

type BaseStepProps = Omit<
  StepIconProps,
  'step' | 'isLast' | 'isFirst' | 'isActive' | 'isCompleted'
>;

export type StepProps = React.PropsWithChildren<BaseStepProps>;

const Step: React.FC<StepProps> = (props) => {
  const { children } = props;
  return <>{children}</>;
};

export default Step;
