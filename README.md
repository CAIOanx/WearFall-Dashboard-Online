# WearFall — Dashboard Online (apresentação)

Interface web de apresentação do projeto acadêmico **WearFall**, voltado ao apoio ao cuidado de pessoas idosas.

## O que esta versão mostra

- Página inicial com informações sobre o projeto
- Tela de entrada para percorrer o fluxo de navegação
- Dashboard com status, alertas e histórico **simulados**
- Botões para simular uma possível queda e um evento descartado

> **Importante:** este site é uma apresentação. O formulário de entrada não faz autenticação real, não há banco de dados online e os eventos não são transmitidos pelo ESP32. **Não use dados ou senhas reais no formulário.**

## Acesso ao site demonstrativo

[**Abrir apresentação do WearFall**](https://caioanx.github.io/WearFall-Dashboard-Online/)

Este endereço foi informado como acessível pelo responsável pelo projeto. A publicação usa arquivos estáticos do repositório. Mudanças em `index.html`, `style.css` e `script.js` na branch publicada aparecem no site após o processamento da hospedagem.

Para verificar ou alterar a publicação, acesse **Settings → Pages** e confira a origem selecionada.

## Protótipo físico

O firmware, a montagem, os testes e os registros reais de eventos do protótipo ESP32 estão no [repositório principal WearFall](https://github.com/CAIOanx/WearFall).

O painel local do ESP32 é acessado em `http://192.168.4.1` quando conectado à rede `WearFall_AP`. Esta interface online não o substitui.
