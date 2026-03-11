import { pushLocalChanges, syncFromServer } from '../../src/realm/SyncService';
import { api } from '../../src/services/api';

jest.mock('../../src/services/api', () => ({
  api: {
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

function makeRealm(orders: any[]) {
  const snapshot = [...orders];
  return {
    objects: jest.fn().mockReturnValue({
      filtered: jest.fn().mockReturnValue({
        snapshot: jest.fn().mockReturnValue(snapshot),
      }),
    }),
    objectForPrimaryKey: jest.fn(),
    write: jest.fn((fn: () => void) => fn()),
    create: jest.fn(),
    delete: jest.fn(),
  };
}

describe('pushLocalChanges', () => {
  beforeEach(() => jest.clearAllMocks());

  it('chama api.post para operação create', async () => {
    const order = {
      isValid: () => true,
      _id: '1',
      _isPendingSync: true,
      _pendingOperation: 'create',
      title: 'Teste',
      description: '',
      status: 'Pending',
      assignedTo: 'João',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      completed: false,
      deleted: false,
      deletedAt: null,
    };
    mockedApi.post.mockResolvedValueOnce({ data: {} });
    const realm = makeRealm([order]);

    await pushLocalChanges(realm as any);

    expect(mockedApi.post).toHaveBeenCalledWith('/work-orders', expect.objectContaining({ id: '1' }));
  });

  it('chama api.put para operação update', async () => {
    const order = {
      isValid: () => true,
      _id: '2',
      _isPendingSync: true,
      _pendingOperation: 'update',
      title: 'Atualizado',
      description: '',
      status: 'In Progress',
      assignedTo: 'Ana',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      completed: false,
      deleted: false,
      deletedAt: null,
    };
    mockedApi.put.mockResolvedValueOnce({ data: {} });
    const realm = makeRealm([order]);

    await pushLocalChanges(realm as any);

    expect(mockedApi.put).toHaveBeenCalledWith('/work-orders/2', expect.objectContaining({ id: '2' }));
  });

  it('chama api.delete e remove do Realm para operação delete', async () => {
    const order = {
      isValid: () => true,
      _id: '3',
      _isPendingSync: true,
      _pendingOperation: 'delete',
      title: 'Para excluir',
      description: '',
      status: 'Pending',
      assignedTo: 'Carlos',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      completed: false,
      deleted: true,
      deletedAt: '2024-01-02T00:00:00.000Z',
    };
    mockedApi.delete.mockResolvedValueOnce({ data: {} });
    const realm = makeRealm([order]);

    await pushLocalChanges(realm as any);

    expect(mockedApi.delete).toHaveBeenCalledWith('/work-orders/3');
    expect(realm.delete).toHaveBeenCalledWith(order);
  });

  it('ignora ordens inválidas', async () => {
    const order = { isValid: () => false };
    const realm = makeRealm([order]);

    await pushLocalChanges(realm as any);

    expect(mockedApi.post).not.toHaveBeenCalled();
    expect(mockedApi.put).not.toHaveBeenCalled();
    expect(mockedApi.delete).not.toHaveBeenCalled();
  });
});

describe('syncFromServer', () => {
  beforeEach(() => jest.clearAllMocks());

  it('busca /work-orders na sincronização inicial (epoch)', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    const realm = makeRealm([]);
    realm.objectForPrimaryKey.mockReturnValue(null);

    await syncFromServer(new Date(0).toISOString(), realm as any);

    expect(mockedApi.get).toHaveBeenCalledWith('/work-orders');
  });

  it('busca /work-orders/sync com since para sincronizações subsequentes', async () => {
    const since = '2024-03-01T00:00:00.000Z';
    mockedApi.get.mockResolvedValueOnce({ data: { created: [], updated: [], deleted: [] } });
    const realm = makeRealm([]);

    await syncFromServer(since, realm as any);

    expect(mockedApi.get).toHaveBeenCalledWith('/work-orders/sync', { params: { since } });
  });

  it('salva ordens novas no Realm', async () => {
    const serverOrder = {
      id: '10',
      title: 'Nova ordem',
      description: '',
      status: 'Pending',
      assignedTo: 'Lucas',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      completed: false,
    };
    mockedApi.get.mockResolvedValueOnce({ data: [serverOrder] });
    const realm = makeRealm([]);
    realm.objectForPrimaryKey.mockReturnValue(null);

    await syncFromServer(new Date(0).toISOString(), realm as any);

    expect(realm.create).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ _id: '10', title: 'Nova ordem' }),
      expect.anything(),
    );
  });
});