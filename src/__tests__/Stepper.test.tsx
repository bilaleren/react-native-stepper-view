import * as React from 'react';
import { Text, View } from 'react-native';
import Stepper, {
  type StepperProps,
  type StepperRefAttributes,
} from '../Stepper';
import { act, fireEvent, createTestRenderer, ErrorBoundary } from 'test-utils';

const StepperComponent = React.forwardRef<
  StepperRefAttributes,
  Partial<StepperProps>
>(({ numberOfSteps = 3, ...other }, ref) => (
  <Stepper {...other} ref={ref} numberOfSteps={numberOfSteps}>
    {Array(numberOfSteps)
      .fill(1)
      .map((_, index) => (
        <Stepper.Step key={index} label={`Label ${index + 1}`}>
          <Text>{`Step ${index + 1}`}</Text>
        </Stepper.Step>
      ))}
  </Stepper>
));

describe('<Stepper />', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('should throw error when `numberOfSteps < 2`', () => {
    const handleError = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});

    createTestRenderer(
      <ErrorBoundary onError={handleError}>
        <StepperComponent numberOfSteps={1} />
      </ErrorBoundary>
    );

    expect(handleError).toHaveBeenCalledTimes(1);
  });

  it('should throw error when `activeStep < 0`', () => {
    const handleError = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});

    createTestRenderer(
      <ErrorBoundary onError={handleError}>
        <StepperComponent activeStep={-1} numberOfSteps={3} />
      </ErrorBoundary>
    );

    expect(handleError).toHaveBeenCalledTimes(1);
  });

  it('should throw error when `activeStep > (numberOfSteps - 1)`', () => {
    const handleError = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});

    createTestRenderer(
      <ErrorBoundary onError={handleError}>
        <StepperComponent activeStep={3} numberOfSteps={3} />
      </ErrorBoundary>
    );

    expect(handleError).toHaveBeenCalledTimes(1);
  });

  it('should render basic', () => {
    const { getByTestId, getByText, getAllByTestId } = createTestRenderer(
      <StepperComponent />
    );

    const stepIcons = getAllByTestId('stepIconContainer');
    const nextButton = getByTestId('nextButton');
    const prevButton = getByTestId('previousButton');

    expect(stepIcons).toHaveLength(3);
    expect(() => getByText('Step 1')).not.toThrow();
    expect(() => getByTestId('submitButton')).toThrow();
    expect(prevButton.props).toHaveProperty(
      'accessibilityState.disabled',
      true
    );
    expect(nextButton.props).toHaveProperty(
      'accessibilityState.disabled',
      undefined
    );
  });

  it('should be set activeStep 1', async () => {
    const { getByText, updateProps } = createTestRenderer(<StepperComponent />);

    expect(() => getByText('Step 1')).not.toThrow();
    expect(() => getByText('Step 2')).toThrow();

    await act(() => {
      updateProps({
        activeStep: 1,
      });
    });

    expect(() => getByText('Step 1')).toThrow();
    expect(() => getByText('Step 2')).not.toThrow();
  });

  it('all steps should be marked as completed when `allCompleted={true}`', async () => {
    const { updateProps, getAllByTestId } = createTestRenderer(
      <StepperComponent />
    );

    expect(() => getAllByTestId('completedCheckIcon')).toThrow();

    await act(() => {
      updateProps({
        allCompleted: true,
      });
    });

    expect(getAllByTestId('completedCheckIcon')).toHaveLength(3);
  });

  it('buttons should not be rendered', async () => {
    const { updateProps, getByTestId } = createTestRenderer(
      <StepperComponent />
    );

    expect(() => getByTestId('buttonsContainer')).not.toThrow();

    await act(() => {
      updateProps({
        showButtons: false,
      });
    });

    expect(() => getByTestId('buttonsContainer')).toThrow();
  });

  it('`onPrevStep` method must be called', () => {
    const handlePrevStep = jest.fn();
    const { getByText, getByTestId } = createTestRenderer(
      <StepperComponent onPrevStep={handlePrevStep} />
    );

    const prevButton = getByTestId('previousButton');
    const nextButton = getByTestId('nextButton');

    expect(() => getByText('Step 1')).not.toThrow();

    fireEvent(prevButton, 'press');

    expect(handlePrevStep).not.toHaveBeenCalled();

    fireEvent(nextButton, 'press');

    expect(() => getByText('Step 1')).toThrow();
    expect(() => getByText('Step 2')).not.toThrow();

    fireEvent(prevButton, 'press');

    expect(() => getByText('Step 1')).not.toThrow();
    expect(() => getByText('Step 2')).toThrow();

    expect(handlePrevStep).toHaveBeenCalled();
    expect(handlePrevStep).toHaveBeenCalledWith(0);
  });

  it('`onNextStep` method must be called', () => {
    const handleNextStep = jest.fn();
    const { getByText, getByTestId } = createTestRenderer(
      <StepperComponent onNextStep={handleNextStep} />
    );

    const nextButton = getByTestId('nextButton');

    expect(() => getByText('Step 1')).not.toThrow();

    fireEvent(nextButton, 'press');

    expect(handleNextStep).toHaveBeenCalled();
    expect(handleNextStep).toHaveBeenCalledWith(1);
    expect(() => getByText('Step 1')).toThrow();
    expect(() => getByText('Step 2')).not.toThrow();
  });

  it('`onSubmit` method must be called', () => {
    const handleSubmit = jest.fn();
    const { getByText, getByTestId } = createTestRenderer(
      <StepperComponent onSubmit={handleSubmit} />
    );

    const nextButton = getByTestId('nextButton');

    expect(() => getByTestId('submitButton')).toThrow();
    expect(() => getByText('Step 1')).not.toThrow();
    expect(() => getByText('Step 2')).toThrow();

    fireEvent(nextButton, 'press');

    expect(() => getByText('Step 1')).toThrow();
    expect(() => getByText('Step 2')).not.toThrow();

    fireEvent(nextButton, 'press');

    expect(() => getByText('Step 2')).toThrow();
    expect(() => getByText('Step 3')).not.toThrow();

    fireEvent(getByTestId('submitButton'), 'press');

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('when `nextButtonDisabled={true}`, the `nextButton` should not be pressable', async () => {
    const handleNextStep = jest.fn();
    const { updateProps, getByTestId } = createTestRenderer(
      <StepperComponent onNextStep={handleNextStep} />
    );

    const nextButton = getByTestId('nextButton');

    expect(nextButton.props).toHaveProperty(
      'accessibilityState.disabled',
      undefined
    );

    fireEvent(nextButton, 'press');

    expect(handleNextStep).toHaveBeenCalled();
    expect(handleNextStep).toHaveBeenCalledWith(1);

    handleNextStep.mockReset();

    await act(() => {
      updateProps({
        nextButtonDisabled: true,
      });
    });

    expect(nextButton.props).toHaveProperty(
      'accessibilityState.disabled',
      true
    );

    fireEvent(nextButton, 'press');

    expect(handleNextStep).not.toHaveBeenCalled();
  });

  it('when `prevButtonDisabled={true}`, the `prevButton` should not be pressable', async () => {
    const handlePrevStep = jest.fn();
    const { updateProps, getByTestId } = createTestRenderer(
      <StepperComponent onPrevStep={handlePrevStep} />
    );

    const prevButton = getByTestId('previousButton');
    const nextButton = getByTestId('nextButton');

    expect(prevButton.props).toHaveProperty(
      'accessibilityState.disabled',
      true
    );

    fireEvent(nextButton, 'press');

    expect(prevButton.props).toHaveProperty(
      'accessibilityState.disabled',
      undefined
    );

    await act(() => {
      updateProps({
        prevButtonDisabled: true,
      });
    });

    fireEvent(prevButton, 'press');

    expect(handlePrevStep).not.toHaveBeenCalled();
  });

  it('when `submitButtonDisabled={true}`, the `submitButton` should not be pressable', async () => {
    const handleSubmit = jest.fn();
    const { updateProps, getByTestId } = createTestRenderer(
      <StepperComponent onSubmit={handleSubmit} />
    );

    const nextButton = getByTestId('nextButton');

    expect(() => getByTestId('submitButton')).toThrow();

    fireEvent(nextButton, 'press');
    fireEvent(nextButton, 'press');

    const submitButton = getByTestId('submitButton');

    fireEvent(submitButton, 'press');

    expect(handleSubmit).toHaveBeenCalled();

    await act(() => {
      updateProps({
        submitButtonDisabled: true,
      });
    });

    handleSubmit.mockReset();

    fireEvent(submitButton, 'press');

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('stepperRef.jumpToStep()', async () => {
    const stepperRef = React.createRef<StepperRefAttributes>();
    const { getByText } = createTestRenderer(
      <StepperComponent ref={stepperRef} />
    );

    expect(() => getByText('Step 1')).not.toThrow();

    await act(() => {
      stepperRef.current?.jumpToStep(1);
    });

    expect(() => getByText('Step 1')).toThrow();
    expect(() => getByText('Step 2')).not.toThrow();

    await act(() => {
      stepperRef.current?.jumpToStep(-1);
    });

    expect(() => getByText('Step 1')).not.toThrow();
    expect(() => getByText('Step 2')).toThrow();
  });

  it('stepperRef.prevStep()', async () => {
    const stepperRef = React.createRef<StepperRefAttributes>();
    const handlePrevStep = jest.fn();
    const { getByText } = createTestRenderer(
      <StepperComponent ref={stepperRef} onPrevStep={handlePrevStep} />
    );

    expect(() => getByText('Step 1')).not.toThrow();

    await act(() => {
      stepperRef.current?.prevStep();
      stepperRef.current?.nextStep();
    });

    expect(() => getByText('Step 1')).toThrow();
    expect(() => getByText('Step 2')).not.toThrow();

    await act(() => {
      stepperRef.current?.nextStep();
    });

    expect(() => getByText('Step 2')).toThrow();
    expect(() => getByText('Step 3')).not.toThrow();

    await act(() => {
      stepperRef.current?.prevStep();
    });

    expect(() => getByText('Step 3')).toThrow();
    expect(() => getByText('Step 2')).not.toThrow();

    await act(() => {
      stepperRef.current?.prevStep();
    });

    expect(() => getByText('Step 2')).toThrow();
    expect(() => getByText('Step 1')).not.toThrow();

    expect(handlePrevStep).toHaveBeenCalledTimes(2);
    expect(handlePrevStep).toHaveBeenCalledWith(1);
    expect(handlePrevStep).toHaveBeenCalledWith(0);
  });

  it('stepperRef.nextStep()', async () => {
    const stepperRef = React.createRef<StepperRefAttributes>();
    const handleNextStep = jest.fn();
    const { getByText } = createTestRenderer(
      <StepperComponent ref={stepperRef} onNextStep={handleNextStep} />
    );

    expect(() => getByText('Step 1')).not.toThrow();

    await act(() => {
      stepperRef.current?.nextStep();
    });

    expect(() => getByText('Step 1')).toThrow();
    expect(() => getByText('Step 2')).not.toThrow();

    await act(() => {
      stepperRef.current?.nextStep();
    });

    expect(() => getByText('Step 2')).toThrow();
    expect(() => getByText('Step 3')).not.toThrow();

    expect(handleNextStep).toHaveBeenCalledTimes(2);
    expect(handleNextStep).toHaveBeenCalledWith(1);
    expect(handleNextStep).toHaveBeenCalledWith(2);
  });

  it('stepperRef.hideButtons()', async () => {
    const stepperRef = React.createRef<StepperRefAttributes>();
    const setNativePropsFn = jest.spyOn(View.prototype, 'setNativeProps');

    createTestRenderer(<StepperComponent ref={stepperRef} />);

    await act(() => {
      stepperRef.current?.hideButtons();
    });

    expect(setNativePropsFn).toHaveBeenCalledTimes(1);
    expect(setNativePropsFn).toHaveBeenCalledWith({
      display: 'none',
    });
  });

  it('stepperRef.showButtons()', async () => {
    const stepperRef = React.createRef<StepperRefAttributes>();
    const setNativePropsFn = jest.spyOn(View.prototype, 'setNativeProps');

    createTestRenderer(<StepperComponent ref={stepperRef} />);

    await act(() => {
      stepperRef.current?.hideButtons();
    });

    expect(setNativePropsFn).toHaveBeenCalledTimes(1);
    expect(setNativePropsFn).toHaveBeenCalledWith({
      display: 'none',
    });

    await act(() => {
      stepperRef.current?.showButtons();
    });

    expect(setNativePropsFn).toHaveBeenCalledTimes(2);
    expect(setNativePropsFn).toHaveBeenLastCalledWith({
      display: 'flex',
    });
  });
});
