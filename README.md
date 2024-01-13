# React Native Stepper View

![](https://badgen.net/npm/license/react-native-stepper-view)
[![](https://img.shields.io/npm/v/react-native-stepper-view.svg)](https://www.npmjs.com/package/react-native-stepper-view)
![](https://badgen.net/packagephobia/install/react-native-stepper-view)
![](https://badgen.net/bundlephobia/min/react-native-stepper-view)
![](https://badgen.net/bundlephobia/minzip/react-native-stepper-view)
![](https://badgen.net/npm/dw/react-native-stepper-view)
![](https://badgen.net/npm/dm/react-native-stepper-view)

A simple and fully customizable React Native component that implements a progress stepper view.

## Installation

```sh
yarn add react-native-stepper-view
```

## Screenshots

- [Android Screenshot](./screenshots/android-screenshot.gif)
- [iOS Screenshot](./screenshots/ios-screenshot.gif)
- [Web Screenshot](./screenshots/web-screenshot.gif)

## Usage

```tsx
import * as React from 'react';
import { View, Text } from 'react-native';
import Stepper from 'react-native-stepper-view';

const App: React.FC = () => {
  const handleSubmit = React.useCallback(() => {
    console.log('submitted');
  }, [])

  const handlePrevStep = React.useCallback((prevStep: number) => {
    console.log('navigate to:', prevStep);
  }, []);

  const handleNextStep = React.useCallback((nextStep: number) => {
    console.log('navigate to:', nextStep);
  }, []);

  return (
    <Stepper
      onSubmit={handleSubmit}
      onPrevStep={handlePrevStep}
      onNextStep={handleNextStep}
      numberOfSteps={3}
    >
      <Stepper.Step label="Step 1">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Step 1 view</Text>
        </View>
      </Stepper.Step>

      <Stepper.Step label="Step 2">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Step 2 view</Text>
        </View>
      </Stepper.Step>

      <Stepper.Step label="Step 3">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Step 3 view</Text>
        </View>
      </Stepper.Step>
    </Stepper>
  );
};
```

> See [example](./example) for a more detailed usage.

## API

### &lt;Stepper /&gt;

`numberOfSteps={number}`: Determines the number of steps.

`activeStep={number}`: Manually specify the active step.

`showButtons={boolean}`: When set to false, the buttons (previous, next and submit) are not rendered.

`allCompleted={boolean}`: Marks all steps as completed.

`onPrevStep={(prevStep: number) => void}`: Triggered when navigate to the previous step.

`onNextStep={(nextStep: number) => void}`: Triggered when navigate to the next step.

`onSubmit={() => void}`: It is triggered when the submit button in the last step is pressed.

`stepProps={object}`: Used to assign props to each step.

`ButtonComponent={React.ComponentType}`: Component of the buttons (previous, next and submit).

`stepContainerStyle={StyleProp<ViewStyle>}`: Used to style the step container view.

`buttonsContainerStyle={StyleProp<ViewStyle>}`: Used to style the buttons container view.

`stepIconsContainerStyle={StyleProp<ViewStyle>}`: Used to style the step icons container view.

`prevButtonDisabled={boolean}`: When set true, the previous button is disabled.

`nextButtonDisabled={boolean}`: When set true, the next button is disabled.

`submitButtonDisabled={boolean}`: When set true, the submit button is disabled.

### &lt;Stepper.Step /&gt;

`label={string}`: Title of the step.

`activeIcon={React.ReactElement<TextProps>}`: Icon of active step.

`disabledIcon={React.ReactElement<TextProps>}`: Icon of disabled step.

`completedIcon={React.ReactElement<TextProps>}`: Icon of completed step.

`progressBarSize={number}`: Height of the progress bar.

`progressBarBgColor={ColorValue}`: Background color of the default progress bar.

`completedProgressBarBgColor={ColorValue}`: Background color of the completed progress bar.

`activeStepIconBgColor={ColorValue}`: Background color of the active step icon.

`disabledStepIconBgColor={ColorValue}`: Background color of the disabled step icon.

`completedStepIconBgColor={ColorValue}`: Background color of the completed step icon.

`activeStepIconBorderColor={ColorValue}`: Border color of the active step icon.

`labelColor={ColorValue}`: Color of the default label.

`labelFontSize={number}`: Font size for the step icon label.

`labelFontFamily={string}`: Font family for the step icon label.

`labelFontWeight={TextStyle['fontWeight']}`: Font weight for the step icon label.

`activeLabelColor={ColorValue}`: Color of the active label.

`activeLabelFontSize={number}`: Font size for the active step icon label.

`completedLabelColor={ColorValue}`: Color of the completed label.

`stepNumFontSize={number}`: Font size for the step number.

`stepNumFontFamily={string}`: Font family for the step number.

`stepNumFontWeight={TextStyle['fontWeight']}`: Font weight for the step number.

`activeStepNumColor={ColorValue}`: Color of the active step number.

`disabledStepNumColor={ColorValue}`: Color of the disabled step number.

`completedCheckColor={ColorValue}`: Color of the completed step checkmark.

### &lt;Stepper ref={stepperRef} /&gt;

`stepperRef.prevStep()`: Used to navigate to the previous step.

`stepperRef.nextStep()`: Used to navigate to the next step.

`stepperRef.showButtons()`: Used to show the buttons.

`stepperRef.hideButtons()`: Used to hide the buttons.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
