import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/i18n';
import { WorkOrderCard } from '../../src/atoms/work-orders/WorkOrderCard';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

const mockOrder = {
  _id: '1',
  title: 'Troca de válvula',
  description: 'Substituir válvula da bomba',
  status: 'Pending' as const,
  assignedTo: 'Maria Souza',
  createdAt: '2024-03-15T10:00:00.000Z',
  updatedAt: '2024-03-15T10:00:00.000Z',
  _isPendingSync: false,
  _pendingOperation: null,
  deleted: false,
  deletedAt: null,
};

describe('WorkOrderCard', () => {
  it('renderiza o título da ordem', () => {
    const { getByText } = render(
      <WorkOrderCard order={mockOrder as any} onPress={() => {}} />,
      { wrapper }
    );
    expect(getByText('Troca de válvula')).toBeTruthy();
  });

  it('renderiza o responsável', () => {
    const { getByText } = render(
      <WorkOrderCard order={mockOrder as any} onPress={() => {}} />,
      { wrapper }
    );
    expect(getByText('Maria Souza')).toBeTruthy();
  });

  it('chama onPress ao tocar no card', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <WorkOrderCard order={mockOrder as any} onPress={onPress} />,
      { wrapper }
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exibe ícone de pendente quando _isPendingSync é true', () => {
    const { getByTestId } = render(
      <WorkOrderCard order={{ ...mockOrder, _isPendingSync: true } as any} onPress={() => {}} />,
      { wrapper }
    );
    expect(getByTestId('icon-cloud-off')).toBeTruthy();
  });

  it('não exibe ícone de pendente quando _isPendingSync é false', () => {
    const { queryByTestId } = render(
      <WorkOrderCard order={mockOrder as any} onPress={() => {}} />,
      { wrapper }
    );
    expect(queryByTestId('icon-cloud-off')).toBeNull();
  });
});