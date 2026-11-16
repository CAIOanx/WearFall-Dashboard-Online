# WearFall — Dashboard Online (apresentação)

Interface web de apresentação do projeto acadêmico **WearFall**, voltado ao apoio ao cuidado de pessoas idosas.

## O que esta versão mostra

- Página inicial com informações sobre o projeto
- Tela de entrada para percorrer o fluxo de navegação
- Dashboard com status, alertas e histórico **simulados**
- Botões para simular uma possível queda e um evento descartado

> **Importante:** este site é uma apresentação. O formulário de entrada não faz autenticação real, não há banco de dados online e os eventos não são transmitidos pelo ESP32. **Não use dados ou senhas reais no formulário.**

## Publicar no GitHub Pages

Este repositório contém `index.html`, `style.css` e `script.js` na raiz, prontos para hospedagem estática.

1. Abra **Settings → Pages** neste repositório.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Escolha a branch **main**, a pasta **/(root)** e clique em **Save**.
4. Aguarde a indicação de publicação na página **Settings → Pages**.

Endereço esperado após a publicação: `https://caioanx.github.io/WearFall-Dashboard-Online/`

Se a opção de publicação não estiver disponível, confira as permissões e configurações do repositório.

## Protótipo físico

O firmware, a montagem, os testes e os registros reais de eventos do protótipo ESP32 estão no [repositório principal WearFall](https://github.com/CAIOanx/WearFall).

O painel local do ESP32 é acessado em `http://192.168.4.1` quando conectado à rede `WearFall_AP`. Esta interface online não o substitui.
