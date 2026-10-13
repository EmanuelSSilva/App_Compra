# Compre Agora

Aplicativo mobile de compras desenvolvido com React Native e Expo SDK 57.

## Experiência

- Login com e-mail e senha, separado do cadastro.
- Cadastro com nome, e-mail, senha e confirmação. Ao concluir, mostra apenas “Usuário cadastrado” e retorna ao login.
- Catálogo de produtos, carrinho com quantidades editáveis e opção de cancelar o pedido antes da confirmação.
- Revisão da compra antes de finalizar e histórico em Meus pedidos.
- Localização com endereço, quando disponível, e latitude/longitude no perfil e carrinho.
- Informações do dispositivo em Configurações, acessadas pelo perfil.
- Ícones Ionicons nas abas e ações, com contador de produtos no carrinho.

## Executar

```bash
npm install
npx expo start --clear --port 8082
```

Se a porta 8081 estiver disponível, é possível omitir `--port 8082`.

## Estrutura

As rotas Expo Router ficam em `src/app/`. Componentes ficam em `src/components/`, telas em `src/screens/`, estado em `src/context/` e serviços em `src/services/`.

Os dados de usuários, carrinho e pedidos permanecem no dispositivo com AsyncStorage e SQLite. Contas existentes são preservadas. Este projeto não possui pagamento nem autenticação em servidor.

## Notificações

No Expo Go Android, o app evita carregar `expo-notifications`, pois esta versão do pacote registra um listener de push ao ser importada e lança erro nesse ambiente. A confirmação aparece por alerta. Builds próprios mantêm notificações locais; uma falha de notificação não impede a conclusão do pedido.

## Validação

```bash
npm run lint
npm run typecheck
npx expo export --platform android --platform ios
```

Os comandos validam código e bundles, mas o GPS, permissões, aparência e navegação ainda devem ser verificados em dispositivo real.

## Build com EAS

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build -p android
```

O nome e o ícone instalados no celular são aplicados em um novo build. Dentro do Expo Go, o aplicativo continua sendo executado pelo contêiner Expo Go.

## Identidade visual

A logo está em `assets/compre-agora-icon.png`. O prompt e a ferramenta utilizados estão em `assets/IDENTIDADE.md`.
