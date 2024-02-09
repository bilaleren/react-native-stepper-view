import * as React from 'react';
import {
  View,
  Text,
  Platform,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import StepIcon from './StepIcon';
import Step, { type StepProps } from './Step';

export interface StepperProps {
  children: React.ReactElement<StepProps>[];

  /**
   * Determines the number of steps.
   */
  numberOfSteps: number;

  /**
   * Manually specify the active step.
   * @default 0
   */
  activeStep?: number;

  /**
   * When set to false, the buttons (previous, next and submit) are not rendered.
   * @default true
   */
  showButtons?: boolean;

  /**
   * Marks all steps as completed.
   * @default false
   */
  allCompleted?: boolean;

  /**
   * Triggered when navigate to the previous step.
   */
  onPrevStep?: (prevStep: number) => void;

  /**
   * Triggered when navigate to the next step.
   */
  onNextStep?: (nextStep: number) => void;

  /**
   * Triggered when going to the next step.
   */
  onSubmit?: () => void;

  /**
   * Used to assign props to each step.
   */
  stepProps?: Partial<Omit<StepProps, 'label'>>;

  /**
   * Component of the buttons (previous, next and submit).
   */
  ButtonComponent?: React.ComponentType<StepperButtonProps>;

  /**
   * Used to style the step container view.
   */
  stepContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Used to style the buttons container view.
   */
  buttonsContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Used to style the step icons container view.
   */
  stepIconsContainerStyle?: StyleProp<ViewStyle>;

  /**
   * When set true, the previous button is disabled.
   */
  prevButtonDisabled?: boolean;

  /**
   * When set true, the next button is disabled.
   */
  nextButtonDisabled?: boolean;

  /**
   * When set true, the submit button is disabled.
   */
  submitButtonDisabled?: boolean;
}

export type StepperButtonType = 'previous' | 'next' | 'submit';

export interface StepperButtonProps {
  step: number;
  type: StepperButtonType;
  disabled: boolean | undefined;
  onPress: (() => void) | undefined;
}

export interface StepperRefAttributes {
  /**
   * Used to navigate to the step.
   */
  jumpToStep(value: number): void;

  /**
   * Used to navigate to the previous step.
   */
  prevStep(): void;

  /**
   * Used to navigate to the next step.
   */
  nextStep(): void;

  /**
   * Used to show the buttons.
   */
  showButtons(): void;

  /**
   * Used to hide the buttons.
   */
  hideButtons(): void;
}

type StepperFC = React.ForwardRefExoticComponent<
  StepperProps & React.RefAttributes<StepperRefAttributes>
> & {
  Step: typeof Step;
};

const StepperButton: React.FC<StepperButtonProps> = (props) => {
  const { type, disabled, onPress } = props;

  const buttonText: Record<StepperButtonType, string> = {
    previous: 'Previous',
    next: 'Next',
    submit: 'Submit',
  };

  return (
    <Pressable
      testID={`${type}Button`}
      style={({ pressed }) => ({
        opacity: pressed || disabled ? 0.5 : 1,
        padding: 10,
        minWidth: 70,
        backgroundColor: 'rgb(33, 150, 243)',
      })}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText} selectable={false}>
        {buttonText[type]}
      </Text>
    </Pressable>
  );
};

const Stepper = React.forwardRef<StepperRefAttributes, StepperProps>(
  (props, ref) => {
    const {
      children,
      stepProps,
      activeStep = 0,
      showButtons = true,
      allCompleted = false,
      numberOfSteps,
      onSubmit,
      onPrevStep,
      onNextStep,
      ButtonComponent = StepperButton,
      stepContainerStyle,
      buttonsContainerStyle,
      stepIconsContainerStyle,
      nextButtonDisabled,
      prevButtonDisabled,
      submitButtonDisabled,
    } = props;
    const activeStepRef = React.useRef<number>(activeStep);
    const buttonsContainerRef = React.useRef<View | HTMLDivElement>(null);
    const [step, setStep] = React.useState<number>(activeStep);

    if (numberOfSteps < 2) {
      throw new Error('You must have at least two steps.');
    }

    if (activeStep < 0 || activeStep > numberOfSteps - 1) {
      throw new Error(
        `The active step value must be between 0 and ${numberOfSteps - 1}.`
      );
    }

    React.useEffect(() => {
      activeStepRef.current = step;
    }, [step]);

    React.useEffect(() => {
      if (activeStep !== activeStepRef.current) {
        setStep(activeStep);
      }
    }, [activeStep]);

    const jumpToStep = React.useCallback(
      (value: number) => {
        setStep(Math.max(0, Math.min(value, numberOfSteps - 1)));
      },
      [numberOfSteps]
    );

    const handlePrevStep = React.useCallback(() => {
      if (step <= 0) {
        return;
      }

      setStep((prevState) => {
        const prevStep = prevState - 1;
        onPrevStep?.(prevStep);
        return prevStep;
      });
    }, [step, onPrevStep]);

    const handleNextStep = React.useCallback(() => {
      if (step >= numberOfSteps - 1) {
        return;
      }

      setStep((prevState) => {
        const nextStep = prevState + 1;
        onNextStep?.(nextStep);
        return nextStep;
      });
    }, [step, numberOfSteps, onNextStep]);

    const handleShowButtons = React.useCallback(() => {
      const buttonsContainer = buttonsContainerRef.current;

      if (!buttonsContainer) {
        return;
      }

      if ('setNativeProps' in buttonsContainer) {
        buttonsContainer.setNativeProps({
          display: 'flex',
        });
      } else if (Platform.OS === 'web') {
        buttonsContainer.style.display = '';
      }
    }, []);

    const handleHideButtons = React.useCallback(() => {
      const buttonsContainer = buttonsContainerRef.current;

      if (!buttonsContainer) {
        return;
      }

      if ('setNativeProps' in buttonsContainer) {
        buttonsContainer.setNativeProps({
          display: 'none',
        });
      } else if (Platform.OS === 'web') {
        buttonsContainer.style.display = 'none';
      }
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        jumpToStep,
        prevStep: handlePrevStep,
        nextStep: handleNextStep,
        showButtons: handleShowButtons,
        hideButtons: handleHideButtons,
      }),
      [
        jumpToStep,
        handlePrevStep,
        handleNextStep,
        handleShowButtons,
        handleHideButtons,
      ]
    );

    const renderStepIcons = () => {
      const steps: React.ReactElement[] = [];

      for (let i = 0; i < numberOfSteps; i++) {
        const isActive = !allCompleted && i === step;
        const isCompleted = allCompleted || i < step;

        const childProps = children[i]?.props;
        const label = childProps?.label;

        steps.push(
          <View key={i}>
            <StepIcon
              {...stepProps}
              {...childProps}
              step={i + 1}
              label={label!}
              isLast={i === numberOfSteps - 1}
              isFirst={i === 0}
              isActive={isActive}
              isCompleted={isCompleted}
            />
          </View>
        );
      }

      return steps;
    };

    return (
      <View style={styles.flex}>
        <View style={stepIconsContainerStyle}>
          <View style={styles.stepIconsContentContainer}>
            {renderStepIcons()}
          </View>
        </View>

        <View style={[styles.flex, stepContainerStyle]}>{children[step]}</View>

        {showButtons && (
          <View
            testID="buttonsContainer"
            ref={buttonsContainerRef as React.RefObject<View>}
            style={buttonsContainerStyle}
          >
            <View style={styles.buttonsContentContainerStyle}>
              <ButtonComponent
                step={step}
                type="previous"
                onPress={handlePrevStep}
                disabled={step === 0 ? true : prevButtonDisabled}
              />

              <View role="none" />

              {step < numberOfSteps - 1 ? (
                <ButtonComponent
                  step={step}
                  type="next"
                  onPress={handleNextStep}
                  disabled={nextButtonDisabled}
                />
              ) : (
                <ButtonComponent
                  step={step}
                  type="submit"
                  onPress={onSubmit}
                  disabled={submitButtonDisabled}
                />
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
) as StepperFC;

Stepper.Step = Step;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  hideButtons: {
    display: 'none',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  stepIconsContentContainer: {
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  buttonsContentContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Stepper;
