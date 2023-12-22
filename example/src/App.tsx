import * as React from 'react';
import {
  Text,
  Keyboard,
  Platform,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  type KeyboardEventName,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Stepper, {
  type StepperButtonType,
  type StepperButtonProps,
  type StepperRefAttributes,
} from 'react-native-stepper-view';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type IonIconsProps = React.ComponentProps<typeof Ionicons>;

const StepperButton: React.FC<StepperButtonProps> = ({
  type,
  step,
  onPress,
  disabled,
}) => {
  const buttonIconNames: Record<StepperButtonType, IonIconsProps['name']> = {
    previous: 'chevron-back',
    next: 'chevron-forward',
    submit: 'checkmark',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.stepperButton,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          backgroundColor: type === 'submit' ? '#4BB543' : '#686868',
        },
        step === 0 &&
          // eslint-disable-next-line react-native/no-inline-styles
          type === 'previous' && {
            display: 'none',
          },
      ]}
    >
      <Ionicons name={buttonIconNames[type]} size={22} color="#ffffff" />
    </Pressable>
  );
};

const App: React.FC = () => {
  const stepperRef = React.useRef<StepperRefAttributes>(null);

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const keyboardHideEventName: KeyboardEventName =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardHideSub = Keyboard.addListener(keyboardHideEventName, () => {
      TextInput.State.blurTextInput(TextInput.State.currentlyFocusedInput());
      stepperRef.current?.showButtons();
    });

    return () => keyboardHideSub.remove();
  }, []);

  const handleFocusInput = () => {
    if (Platform.OS === 'web') {
      return;
    }

    stepperRef.current?.hideButtons();
  };

  return (
    <SafeAreaProvider style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <Stepper
          ref={stepperRef}
          numberOfSteps={3}
          onSubmit={() => console.log('Submitted')}
          stepContainerStyle={styles.stepContainer}
          buttonsContainerStyle={styles.buttonsContainer}
          ButtonComponent={StepperButton}
          stepIconsContainerStyle={styles.stepIconsContainer}
        >
          <Stepper.Step label="Step 1">
            <Text style={styles.title}>Step 1</Text>

            <ScrollView
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.inputLabel}>Input 1</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 2</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 3</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 4</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 5</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />
            </ScrollView>
          </Stepper.Step>

          <Stepper.Step label="Step 2">
            <Text style={styles.title}>Step 2</Text>

            <ScrollView
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.inputLabel}>Input 1</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 2</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 3</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 4</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 5</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />
            </ScrollView>
          </Stepper.Step>

          <Stepper.Step label="Step 3">
            <Text style={styles.title}>Step 3</Text>

            <ScrollView
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.inputLabel}>Input 1</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 2</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 3</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 4</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />

              <Text style={styles.inputLabel}>Input 5</Text>
              <TextInput style={styles.input} onFocus={handleFocusInput} />
            </ScrollView>
          </Stepper.Step>
        </Stepper>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'transparent',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
  },
  stepperButton: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    paddingHorizontal: 15,
  },
  buttonsContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  stepIconsContainer: {
    paddingVertical: 15,
  },
});

export default App;
