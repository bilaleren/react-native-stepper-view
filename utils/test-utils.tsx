import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

type Props = Record<string, unknown>;

type CreateTestRendererResult = ReturnType<typeof render> & {
  updateProps(props: Props): void;
};

export { act, fireEvent } from '@testing-library/react-native';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Component Error</Text>;
    }

    return this.props.children;
  }
}

export function createTestRenderer(
  element: React.ReactElement
): CreateTestRendererResult {
  const { update, ...rendererResult } = render(element);

  const updateProps: CreateTestRendererResult['updateProps'] = (props) => {
    update(
      React.cloneElement(element, {
        ...element.props,
        ...props,
      })
    );
  };

  return {
    ...rendererResult,
    update,
    updateProps,
  };
}
