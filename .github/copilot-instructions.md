## Contexto rápido

Este repositório é um site estático de portfólio / currículo pessoal (HTML/CSS/JS). O projeto não usa bundlers ou package managers — arquivos estáticos ficam em `index.html`, estilos em `css/` e scripts em `js/`. O repositório é nomeado `yuriCardoso.github.io` (página GitHub Pages servida a partir da branch `master`).

## Objetivo para agentes de codificação

Seja prático: edições tendem a ser em HTML estático, CSS temático e pequenos ajustes em JS. Evite introduzir toolchains pesados sem consenso (ex.: webpack, npm) — qualquer mudança desses deve incluir manifestos/README e instruções de (des)implantação.

## Arquitetura e pontos principais

- Entrada: `index.html` — estrutura de “single page” com subpáginas internas (carregadas no DOM) controladas por `js/pages-switcher.js`.
- Estilos: `css/main-green.css` contém a customização principal do tema; várias bibliotecas CSS (Bootstrap, animate, owl.carousel, magnific-popup) são usadas cruas.
- JS: `js/main.js` é o script de comportamento global; dependências e plugins (jQuery 2.1.3, owl.carousel, masonry, magnific-popup, shuffle, etc.) são incluídos diretamente na ordem necessária. Preserve a ordem: jQuery antes dos plugins.
- Ativos: imagens em `images/` (portfolio em `images/portfolio` e `images/portfolio/full`), fontes em `fonts/`, CV em `cv/`.

## Convenções do projeto (observáveis no código)

- Plugins e bibliotecas são incluídos diretamente como arquivos estáticos (por exemplo `js/jquery-2.1.3.min.js` no head). Não remova nem reordene scripts sem testar — a ordem importa.
- Nomes de arquivos nem sempre seguem convenções sem espaços (ex.: `cv/Jhonatta Yuri Cardoso Figueiredo_CV.pdf`) — tomar cuidado ao renomear; prefira underscores em novos arquivos.
- HTML usa classes e atributos específicos do tema (ex.: seções com `section.pt-page` e `data-id="resume"`, grid de portfólio com `data-groups` em `<figure>`). Ao adicionar itens de portfólio, siga o padrão existente (ver `index.html` para exemplo de `<figure class="item" data-groups='["all","media"]'>`).

## Como rodar localmente (rápido)

- Abrir `index.html` no navegador funciona, mas alguns navegadores bloqueiam requisições locais; recomendo usar:
  - VS Code: extensão Live Server — botão "Go Live" (mais fácil para edição interativa).
  - Servidor estático simples (PowerShell):
    - `python -m http.server 8000` e abrir `http://localhost:8000` (assegure que o Python esteja no PATH).

## Debug e problemas comuns

- 404s de assets: verifique paths relativos em `index.html` e se os arquivos existem em `images/`, `css/`, `js/`.
- Ordem de scripts: jQuery precisa ser carregado antes de plugins (por exemplo `owl.carousel.min.js`, `jquery.magnific-popup.min.js`). Alterar a ordem pode quebrar funcionalidades (carrossel, lightbox, filtros).
- Plugins antigos: jQuery 2.x é usado — atualizar jQuery exige teste e possivelmente atualizar plugins.

## Exemplos concretos de tarefas e onde fazer

- Mudar cor/tema: editar `css/main-green.css` e recarregar página.
- Alterar texto do cabeçalho (nome/título): editar a `div.site-title` em `index.html` (bloco de header). Ex.: alterar o texto dentro de `<div class="site-title">`.
- Adicionar item no portfólio: colocar imagem em `images/portfolio/` e `images/portfolio/full/` e copiar um `<figure>` existente em `index.html`, ajustando `data-groups`, `href` e `img src`.
- Atualizar navegação/novas páginas: manter o padrão de âncoras e o atributo data-id nas sections para compatibilidade com pages-switcher.js.

## Checklist rápido para PRs/commits

1. Rodar localmente e abrir `http://localhost:8000` (ou Live Server).  
2. Verificar console do navegador para erros JS (plugins faltando/ordem).  
3. Conferir 404s de imagens/fonts no Network tab.  
4. Preservar ordem de scripts e inclusão de jQuery/plugins.  
5. Testar comportamento de portfólio, carrossel e lightbox (ex.: `owl-carousel`, `magnific-popup`).

## O que não inventar/assumir

- Não converta o projeto automaticamente para um empacotador (webpack, parcel) sem concordância — mudanças desse tipo exigem um README e scripts de build.  
- Não remova arquivos de plugins; prefira atualizar apenas se houver testes e justificativa.

## Onde procurar mais contexto

- `index.html` — mapa principal da aplicação (subpáginas, exemplos de portfólio, links sociais).  
- `css/main-green.css` — regras de estilo do tema.  
- `js/main.js` e `js/pages-switcher.js` — comportamento e roteamento entre subpáginas.  
- `images/` e `cv/` — ativos de mídia e PDF do currículo.

Se algo estiver faltando ou desejar que eu inclua exemplos mais detalhados (trechos de código ou uma checklist de CI/CD para deploy no GitHub Pages), diga o que quer que eu acrescente e eu atualizo este arquivo.

## Snippets úteis

Exemplo pronto para colar no grid de portfólio em index.html dentro do elemento com id "portfolio_grid" (copie um dos `<figure>` existentes e substitua caminhos/título):

```html
<figure class="item" data-groups='["all","media"]'>
  <a href="images/portfolio/full/example-full.jpg" class="lightbox" title="Nome do Projeto">
    <img src="images/portfolio/example-thumb.jpg" alt="Nome do Projeto">
    <div>
      <h5 class="name">Nome do Projeto</h5>
      <small>Categoria</small>
      <i class="fa fa-file-text-o"></i>
    </div>
  </a>
</figure>
```

Notas rápidas:
- Coloque a versão em tamanho real em `images/portfolio/full/` e a miniatura em `images/portfolio/`.
- Ajuste `data-groups` para as categorias do filtro (`all`, `media`, `video`, `illustration`, etc.).
- Para links de vídeo use `class="lightbox mfp-iframe"` e o href apontando para o player (ex.: Vimeo).
