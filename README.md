# FieldSync — Work Orders Offline

> Aplicativo React Native para gerenciamento de ordens de serviço com suporte **offline-first**, sincronização automática, internacionalização, dark mode e acessibilidade.

---

## Funcionalidades

- **Offline-first**: todas as operações (criar, editar, excluir) funcionam sem conexão com a internet
- **Sincronização automática**: ao recuperar a conexão, as alterações locais são enviadas ao servidor e novas ordens são baixadas
- **Dark mode**: alternância manual entre tema claro e escuro com animação suave
- **Internacionalização (i18n)**: suporte a múltiplos idiomas via i18next com detecção automática do locale do dispositivo
- **Acessibilidade**: labels, roles e states para leitores de tela (TalkBack/VoiceOver)
- **Validação de formulários**: campos validados em tempo real com mensagens de erro traduzidas
- **Splash screen animada**: tela de abertura com logo e animação de fade + spring

---

## Pré-requisitos

- Node.js >= 18
- JDK 17
- Android SDK (API 33+) com emulador ou dispositivo físico
- [Ambiente React Native configurado](https://reactnative.dev/docs/set-up-your-environment)

---

## Instalação e execução

```sh
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor Metro
npm start

# 3. Em outro terminal, rodar no Android
npm run android
```

### Gerar APK debug standalone

```sh
# Empacotar o bundle JS
npx react-native bundle --platform android --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# Buildar o APK
cd android && ./gradlew assembleDebug
```

O APK gerado estará em `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## Arquitetura

### Padrões utilizados

| Padrão | Aplicação |
|---|---|
| **Atomic Design** | Componentes organizados em `atoms/` (WorkOrderCard, StatusBadge, InfoRow, SyncStatusBar) |
| **Repository Pattern** | `WorkOrderRepository.ts` e `SyncMetaRepository.ts` isolam o acesso ao Realm |
| **Service Layer** | `SyncService.ts` concentra a lógica de push/pull com a API |
| **Context + Hook** | `ThemeContext` + `useTheme` para tema global |

### Estrutura de pastas

```
src/
├── atoms/work-orders/   # Componentes atômicos reutilizáveis
├── constants/           # Paleta de cores
├── context/             # ThemeContext
├── hooks/               # useSyncManager, useTheme
├── i18n/                # Traduções (pt-BR, en-US)
├── realm/
│   ├── schemas/         # WorkOrderSchema, SyncMetaSchema
│   ├── WorkOrderRepository.ts
│   ├── SyncMetaRepository.ts
│   └── SyncService.ts
├── routes/              # RootNavigator, tipos de navegação
├── screens/             # WorkOrderList, WorkOrderDetail, WorkOrderForm, Splash
├── services/            # Instância Axios (api.ts)
├── stores/              # Zustand: syncStore, workOrderStore
├── types/               # Tipos TypeScript globais
└── utils/               # formatDate
```

---

## Decisões técnicas

### Realm.js — armazenamento local
Escolhido pela performance superior em leitura/escrita de coleções grandes comparado ao AsyncStorage e SQLite, pela integração com `@realm/react` (hooks reativos) e pelo suporte nativo a objetos complexos sem necessidade de serialização manual.

### Zustand — estado global
Preferido ao Redux pela API mínima sem boilerplate. Usado exclusivamente para estado de sincronização (status, lastSync), mantendo o estado de dados no Realm como fonte de verdade.

### React Hook Form + Zod — formulários
A combinação permite validação em tempo real com performance otimizada (re-renders apenas nos campos alterados) e tipagem completa do schema inferida pelo TypeScript.

### i18next + react-native-localize
Detecção automática do idioma do dispositivo com fallback para `pt-BR`. Configurado com `initImmediate: false` para evitar tela em branco durante a inicialização síncrona no React Native.

### Soft delete
Ordens excluídas recebem `deleted: true` e `_pendingOperation: 'delete'` localmente. A exclusão física no servidor e no Realm só ocorre após confirmação da API, evitando perda de dados em caso de falha de rede.

---

## Testes

```sh
# Rodar todos os testes
npx jest
```

Cobertura atual: **30 testes** em 6 suites

| Suite | Testes |
|---|---|
| `utils/formatDate` | 4 |
| `schemas/workOrderSchema` | 9 |
| `components/StatusBadge` | 4 |
| `components/WorkOrderCard` | 5 |
| `sync/SyncService` | 7 |
| `App` | 1 |

---

## Limitações conhecidas

- A API backend é simulada (mock); a URL base deve ser configurada em `src/services/api.ts`
- iOS não foi testado neste ciclo de desenvolvimento
- Conflitos de sincronização (edição simultânea offline em dois dispositivos) não são tratados — o último push vence
