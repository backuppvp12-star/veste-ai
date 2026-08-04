# Veste.AI

## Publicar na Netlify
1. Envie todo o conteúdo desta pasta para a raiz de um repositório GitHub.
2. Na Netlify: Add new project > Import an existing project > GitHub.
3. Escolha o repositório. O `netlify.toml` configura automaticamente:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions: `netlify/functions`
4. Adicione as variáveis:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` = `gemini-2.5-flash`
5. Faça um novo deploy.

## Rodar localmente
```bash
npm install
npm run dev
```
