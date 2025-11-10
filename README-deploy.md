# README — Servir localmente e publicar (GitHub Pages)

Este arquivo descreve passos rápidos para rodar o site localmente (Windows PowerShell) e publicar no GitHub Pages para este repositório do tipo `username.github.io`.

Servir localmente (rápido)

- Recomendado: use a extensão Live Server do VS Code e clique em "Go Live".
- Alternativa: usando Python (funciona em PowerShell se `python` estiver no PATH):

```powershell
# a partir da raiz do repositório
python -m http.server 8000
# então abra http://localhost:8000 no navegador
```

Publicar no GitHub Pages (user/organization site)

Observação: repositórios com nome `username.github.io` são servidos a partir da branch `master` (ou `main` se configurado). Confirme a branch usada nas configurações do repositório.

```powershell
# adicionar alterações, commitar e enviar para a branch master
git add .
git commit -m "Atualiza site estático"
git push origin master
```

Depois do push, aguarde alguns segundos/minutos e acesse `https://<seu-usuario>.github.io`.

Dicas de debug rápido

- Se algo não aparece: abra o DevTools do navegador (F12) e verifique a aba Network — procure 404s de assets (`css/`, `js/`, `images/`).
- Se plugins JS falham: verifique a ordem de carregamento em `index.html` — jQuery deve ser carregado antes dos plugins.
- Se atualizações locais não aparecem: limpe cache do navegador (Ctrl+Shift+R) ou teste em uma janela anônima.

Se quiser, posso adicionar um pequeno workflow de GitHub Actions que faça build (se houver) e publique automaticamente; pondere que este projeto hoje não usa bundler e normalmente não necessita de build.
