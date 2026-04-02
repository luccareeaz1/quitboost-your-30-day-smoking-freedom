# Plano de Lançamento Beta - QuitBoost 🚀

Este documento detalha o que foi concluído hoje e o que precisa ser ajustado para o lançamento amanhã.

## ✅ Concluído Hoje (Integridade & Estabilidade)
- **Refatoração de Tipos (TypeScript):** Substituição extensiva de `any` em:
  - `Comunidade.tsx` (Perfís, Posts, Comentários)
  - `Dashboard.tsx` (Serviços e Estados)
  - `Desafios.tsx` (Configurações de Categoria e Leaderboard)
  - `Auth.tsx` / `Checkout.tsx` (Tratamento de Erros)
- **Correção de Imports ESM:** `tailwindcss-animate` convertido de `require` para `import`.
- **Estabilização de Hooks:** Implementação de `useCallback` para funções de carregamento de dados em páginas críticas.

## ⚠️ Ajustes Finais (Prioridade para Amanhã)

### 1. Verificação do Fluxo de Pagamento (Stripe)
- **Status:** Integrado, mas requer validação em ambiente de staging.
- **Ação:** Testar o webhook de Stripe (`stripe-webhook`) com o CLI para garantir que as assinaturas sejam ativadas no banco de dados.
- **Implementar:** Substituir o placeholder `getUserByEmail` no webhook por uma consulta real ou usar `client_reference_id`.

### 2. Configuração de Build (Otimização)
- **Problema:** Avisos de tamanho de chunk (>500kB).
- **Solução:** Configurar `manualChunks` no `vite.config.ts` para separar bibliotecas grandes (Framer Motion, Lucide, Supabase).

### 3. Inteligência Artificial (AI Coach)
- **Status:** Interface concluída.
- **Ação:** Verificar se a `OPENAI_API_KEY` está configurada nos Secrets do Supabase.
- **Ação:** Testar a resposta síncrona/assíncrona para evitar timeouts de 10s.

### 4. Última Limpeza de Linting
- **Status:** ~16 erros restantes.
- **Ação:** Resolver os erros residuais em `Conquistas.tsx` e `useNotifications.tsx`.

## 📈 Títulos e Metadados (SEO)
- [ ] Revisar Títulos e Descrições meta em `index.html`.
- [ ] Adicionar OpenGraph images para compartilhamento social.

---
> [!IMPORTANT]
> **Blocker Crítico:** Verifique se as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão devidamente configuradas no Lovable ou no ambiente de produção.
