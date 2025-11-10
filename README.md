# yuriCardoso.github.io

Site estático de portfólio / currículo pessoal (HTML/CSS/JS). Projeto simples sem bundlers — arquivos estáticos estão na raiz, estilos em `css/`, scripts em `js/` e imagens em `images/`.

Visão rápida

- Abra `index.html` no navegador para visualizar. Recomendo usar a extensão Live Server do VS Code ou servir localmente com Python.

Servir localmente (PowerShell)

```powershell
python -m http.server 8000
# abrir http://localhost:8000
```

Publicar

- Este repositório é um site do tipo `username.github.io` e é servido a partir da branch `master`.
- Para publicar: commite suas mudanças e `git push origin master`. Há também um workflow de GitHub Actions (`.github/workflows/deploy-pages.yml`) que publica automaticamente o conteúdo quando houver push para `master`.

Onde editar

- Texto e estrutura: `index.html` (subpáginas controladas por `js/pages-switcher.js`).
- Estilos: `css/main-green.css`.
- Scripts/glue: `js/main.js` e plugins em `js/` (jQuery 2.1.3 e plugins devem manter ordem).
- Portfólio: `images/portfolio/` (miniaturas) e `images/portfolio/full/` (versões em tamanho real).

Instruções detalhadas e snippets estão em `.github/copilot-instructions.md`.

Contribuições

- Faça alterações em uma branch separada, verifique localmente e abra PRs quando desejar revisão. Preserve a ordem de inclusão de scripts e teste carrossel/lightbox/portfolio ao alterar JS ou CSS.
