# Auditoria de produção

## Edge Function legada

O frontend não depende mais de `make-server-bbe832b4`. Auth, perfis, cursos,
biblioteca, contatos, evolução e gamificação usam o cliente Supabase e RLS.

A função permanece implantada temporariamente para compatibilidade. Somente o
health check responde normalmente; os endpoints legados retornam HTTP 410. Ela
pode ser aposentada no painel do Supabase após confirmar que não há consumidores
externos. A tabela `kv_store_bbe832b4` foi preservada e não sofreu alterações.

## Produção

- URL: https://vsm-app-coral.vercel.app
- Redirect OAuth: `https://vsm-app-coral.vercel.app/login`
- Refresh de rotas SPA: configurado por rewrite em `vercel.json`
