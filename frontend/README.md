# Capsule App — Frontend (Mobile)

Este diretório contém o aplicativo móvel desenvolvido com Expo/React Native.

**Local:** `frontend/capsule-mobile`

**Objetivo:** interface mobile para pacientes, cuidadores e administradores que consome a API do backend.

## Pré-requisitos

- Node.js (>=18)
- npm ou yarn
- Expo CLI (opcional): `npm install -g expo-cli` ou use `npx expo`

## Instalação e execução

Abra um terminal na pasta do app móvel:

```bash
cd frontend/capsule-mobile
npm install
npm run start      # inicia o Metro/Expo
npm run android    # abre no Android (emulador ou dispositivo)
npm run ios        # abre no iOS (MacOS + Xcode)
npm run web        # executar como web (opcional)
```

Ou, sem instalar globalmente:

```bash
cd frontend/capsule-mobile
npx expo start
```

## Configurar URL do Backend

O app consome a API do backend. Por padrão, configure a URL da API em um arquivo de ambiente ou no arquivo de configuração onde as chamadas Axios são feitas (procure por `src/api` ou `src/config`).

Exemplo (usar no ambiente de desenvolvimento):

```env
API_BASE_URL=http://10.0.2.2:8000   # Android emulador -> localhost do host
API_BASE_URL=http://127.0.0.1:8000  # iOS ou web
```

## Estrutura

- `src/` — código-fonte do app (features, navegação, API)
- `assets/` — imagens e ícones
- `App.tsx` — ponto de entrada

## Testes e desenvolvimento

Use ferramentas como `react-query` e mocks (`axios-mock-adapter`) para desenvolvimento local. Consulte o `package.json` para scripts disponíveis.

## Próximos passos

- Documentar variáveis de ambiente usadas pelo app
- Adicionar guia de estilo e padrões de contribuição

---

Se quiser, posso também adicionar um arquivo `ENV.example` e instruções mais detalhadas sobre como apontar para o backend local ou em Docker.
