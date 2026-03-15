import React from 'react';
import { render } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/i18n';
import { StatusBadge } from '../../src/atoms/work-orders/StatusBadge';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe('StatusBadge', () => {
  it('renderiza o badge para status Pending', () => {
    const { getByText } = render(<StatusBadge status="Pending" />, { wrapper });
    expect(getByText(i18n.t('status.Pending'))).toBeTruthy();
  });

  it('renderiza o badge para status In Progress', () => {
    const { getByText } = render(<StatusBadge status="In Progress" />, { wrapper });
    expect(getByText(i18n.t('status.In Progress'))).toBeTruthy();
  });

  it('renderiza o badge para status Completed', () => {
    const { getByText } = render(<StatusBadge status="Completed" />, { wrapper });
    expect(getByText(i18n.t('status.Completed'))).toBeTruthy();
  });

  it('aplica accessibilityLabel correto', () => {
    const { getByLabelText } = render(<StatusBadge status="Pending" />, { wrapper });
    expect(getByLabelText(i18n.t('status.Pending'))).toBeTruthy();
  });
});