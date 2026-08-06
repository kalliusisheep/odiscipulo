# Corrigir o preview em branco

## Diagnóstico confirmado

O HTML da rota `/home` volta a ser servido, mas o navegador falha antes de hidratar a aplicação. O erro acontece em `hydrateStart.js:27`, porque a instância do router não possui o store esperado pela versão do cliente de hidratação.

As dependências TanStack instaladas estão desalinhadas e duplicadas: o app carrega versões diferentes de `react-start`, `react-router`, `router-core`, `start-client-core` e `react-start-client` ao mesmo tempo. Essa incompatibilidade explica o acesso inválido a `router.stores.matchesId.get()` e o preview que permanece parado.

## Implementação

1. Alinhar as versões do conjunto TanStack Start/Router para uma única combinação compatível, usando versões exatas em vez de intervalos que resolvem pacotes diferentes.
2. Remover as cópias incompatíveis por meio de uma reinstalação limpa das dependências, preservando React, Vite e a configuração atual do projeto.
3. Manter o bootstrap existente (`router.tsx`, `start.ts` e `__root.tsx`) e só ajustá-lo se a versão alinhada exigir uma mudança documentada de API.
4. Verificar novamente os arquivos restaurados para garantir que nenhuma rota ainda contenha bytes inválidos ou marcadores de truncamento.
5. Validar `/`, `/bem-vindo` e `/home` no navegador, confirmando renderização, hidratação e ausência do erro `Cannot read properties of undefined (reading 'get')` no console.

## Critério de conclusão

- O preview abre normalmente e sai da tela de carregamento.
- A navegação entre as três rotas funciona sem recarregamento forçado.
- Não há erro de hidratação, erro 500 de SSR ou arquivo de rota inválido nos logs.