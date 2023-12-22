import * as React from 'react';
import {
  Text,
  View,
  type ColorValue,
  type TextStyle,
  type ViewStyle,
  type TextProps,
} from 'react-native';

export interface StepIconStyleProps {
  /**
   * Height of the progress bar.
   * @default 5
   */
  progressBarSize?: number;

  /**
   * Background color of the default progress bar.
   * @default #ebebe4
   */
  progressBarBgColor?: ColorValue;

  /**
   * Background color of the completed progress bar.
   * @default #4BB543
   */
  completedProgressBarBgColor?: ColorValue;

  /**
   * Background color of the active step icon.
   * @default transparent
   */
  activeStepIconBgColor?: ColorValue;

  /**
   * Background color of the disabled step icon.
   * @default #ebebe4
   */
  disabledStepIconBgColor?: ColorValue;

  /**
   * Background color of the completed step icon.
   * @default #4BB543
   */
  completedStepIconBgColor?: ColorValue;

  /**
   * Border color of the active step icon.
   * @default #4BB543
   */
  activeStepIconBorderColor?: ColorValue;

  /**
   * Color of the default label.
   * @default lightgray
   */
  labelColor?: ColorValue;

  /**
   * Font size for the step icon label.
   * @default 14
   */
  labelFontSize?: number;

  /**
   * Font family for the step icon label.
   */
  labelFontFamily?: string;

  /**
   * Font weight for the step icon label.
   */
  labelFontWeight?: TextStyle['fontWeight'];

  /**
   * Color of the active label.
   * @default #4BB543
   */
  activeLabelColor?: ColorValue;

  /**
   * Font size for the active step icon label.
   */
  activeLabelFontSize?: number;

  /**
   * Color of the completed label.
   * @default lightgray
   */
  completedLabelColor?: ColorValue;

  /**
   * Font size for the step number.
   */
  stepNumFontSize?: number;

  /**
   * Font family for the step number.
   */
  stepNumFontFamily?: string;

  /**
   * Font weight for the step number.
   */
  stepNumFontWeight?: TextStyle['fontWeight'];

  /**
   * Color of the active step number.
   */
  activeStepNumColor?: ColorValue;

  /**
   * Color of the disabled step number.
   */
  disabledStepNumColor?: ColorValue;

  /**
   * Color of the completed step checkmark.
   */
  completedCheckColor?: ColorValue;
}

export interface StepIconProps extends StepIconStyleProps {
  step: number;
  isLast: boolean;
  isFirst: boolean;
  isActive: boolean;
  isCompleted: boolean;

  /**
   * Title of the step.
   */
  label: string;

  /**
   * Icon of active step.
   */
  activeIcon?: React.ReactElement<TextProps>;

  /**
   * Icon of disabled step.
   */
  disabledIcon?: React.ReactElement<TextProps>;

  /**
   * Icon of completed step.
   */
  completedIcon?: React.ReactElement<TextProps>;
}

interface StepIconStyles {
  container: ViewStyle;
  circle: ViewStyle;
  labelText: TextStyle;
  leftBar: ViewStyle;
  rightBar: ViewStyle;
  stepNum: TextStyle;
  completedIcon: TextStyle;
}

const useStyles = (
  props: StepIconStyleProps & Pick<StepIconProps, 'isActive' | 'isCompleted'>
): StepIconStyles => {
  const {
    isActive,
    isCompleted,
    progressBarSize = 5,
    progressBarBgColor = '#ebebe4',
    completedProgressBarBgColor = '#4BB543',
    stepNumFontSize,
    stepNumFontFamily,
    stepNumFontWeight,
    activeStepNumColor,
    labelColor = 'lightgray',
    labelFontSize = 14,
    labelFontFamily,
    labelFontWeight,
    activeLabelColor = '#4BB543',
    activeLabelFontSize,
    completedLabelColor = 'lightgray',
    activeStepIconBgColor = 'transparent',
    activeStepIconBorderColor = '#4BB543',
    disabledStepIconBgColor = '#ebebe4',
    completedStepIconBgColor = '#4BB543',
    disabledStepNumColor = 'white',
    completedCheckColor = 'white',
  } = props;

  const circleSize = isActive ? 40 : 36;
  const circleBorderWidth = isActive ? 4 : 0;
  const progressBarTopPos =
    (circleSize - progressBarSize - circleBorderWidth) / 2;

  return {
    container: {
      alignItems: 'center',
      flexDirection: 'column',
    },
    circle: {
      width: circleSize,
      height: circleSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: isActive ? 20 : 18,
      ...(isActive && {
        bottom: 2,
        borderWidth: circleBorderWidth,
        borderStyle: 'solid',
        borderColor: activeStepIconBorderColor,
      }),
      backgroundColor: isActive
        ? activeStepIconBgColor
        : isCompleted
        ? completedStepIconBgColor
        : disabledStepIconBgColor,
    },
    labelText: {
      textAlign: 'center',
      flexWrap: 'wrap',
      width: 100,
      paddingTop: 4,
      ...(!isActive && {
        marginTop: 4,
      }),
      color: isActive
        ? activeLabelColor || labelColor
        : isCompleted
        ? completedLabelColor
        : labelColor,
      fontSize: isActive ? activeLabelFontSize ?? labelFontSize : labelFontSize,
      fontFamily: labelFontFamily,
      fontWeight: labelFontWeight,
    },
    leftBar: {
      position: 'absolute',
      top: progressBarTopPos,
      left: 0,
      right: circleSize + 8,
      height: progressBarSize,
      marginRight: circleSize / 2 + 2,
      backgroundColor:
        isActive || isCompleted
          ? completedProgressBarBgColor
          : progressBarBgColor,
    },
    rightBar: {
      position: 'absolute',
      top: progressBarTopPos,
      right: 0,
      left: circleSize + 8,
      height: progressBarSize,
      marginLeft: circleSize / 2 + 2,
      backgroundColor: isCompleted
        ? completedProgressBarBgColor
        : progressBarBgColor,
    },
    stepNum: {
      color: isActive ? activeStepNumColor : disabledStepNumColor,
      fontSize: stepNumFontSize,
      fontFamily: stepNumFontFamily,
      fontWeight: stepNumFontWeight,
    },
    completedIcon: {
      color: completedCheckColor,
    },
  } as StepIconStyles;
};

const StepIcon: React.FC<StepIconProps> = (props) => {
  const {
    step,
    label,
    isFirst,
    isLast,
    isActive,
    isCompleted,
    activeIcon,
    disabledIcon,
    completedIcon,
  } = props;

  const styles = useStyles(props);

  const renderCircleContent = (): React.ReactElement => {
    if (isCompleted) {
      return completedIcon ? (
        React.cloneElement(completedIcon, {
          ...completedIcon.props,
          style: [styles.completedIcon, completedIcon.props.style],
        })
      ) : (
        <Text
          testID="completedCheckIcon"
          style={styles.completedIcon}
          selectable={false}
          adjustsFontSizeToFit={true}
        >
          &#10003;
        </Text>
      );
    } else {
      let iconElement: React.ReactElement<TextProps> | undefined;

      if (isActive && activeIcon) {
        iconElement = activeIcon;
      } else if (!isActive && disabledIcon) {
        iconElement = disabledIcon;
      }

      return iconElement ? (
        React.cloneElement(iconElement, {
          ...iconElement.props,
          style: [styles.stepNum, iconElement.props.style],
        })
      ) : (
        <Text
          style={styles.stepNum}
          selectable={false}
          adjustsFontSizeToFit={true}
        >
          {step}
        </Text>
      );
    }
  };

  return (
    <View testID="stepIconContainer" style={styles.container}>
      <View style={styles.circle}>{renderCircleContent()}</View>
      <Text style={styles.labelText}>{label}</Text>
      {!isFirst && <View style={styles.leftBar} />}
      {!isLast && <View style={styles.rightBar} />}
    </View>
  );
};

export default StepIcon;
