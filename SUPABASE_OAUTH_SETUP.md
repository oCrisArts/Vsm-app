# Configuração de OAuth no Supabase

Para que o login social funcione corretamente, você precisa configurar os provedores OAuth no painel do Supabase.

## 1. Acessar o painel do Supabase

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto (nzesvtvxfnpfouvipsde)
3. Vá em "Authentication" > "Providers"

## 2. Configurar Google OAuth

1. No painel do Supabase, habilite o provedor "Google"
2. Você precisará criar um projeto no Google Cloud Console:
   - Acesse https://console.cloud.google.com/
   - Crie um novo projeto
   - Vá em "APIs & Services" > "Credentials"
   - Crie credenciais OAuth 2.0
   - Adicione o redirect URI: `https://nzesvtvxfnpfouvipsde.supabase.co/auth/v1/callback`
3. Copie o Client ID e Client Secret do Google
4. Cole no painel do Supabase na configuração do Google

## 3. Configurar Facebook OAuth

1. No painel do Supabase, habilite o provedor "Facebook"
2. Você precisará criar um app no Facebook Developer:
   - Acesse https://developers.facebook.com/
   - Crie um novo app
   - Configure o Facebook Login
   - Adicione o redirect URI: `https://nzesvtvxfnpfouvipsde.supabase.co/auth/v1/callback`
3. Copie o App ID e App Secret do Facebook
4. Cole no painel do Supabase na configuração do Facebook

## 4. Configurar Site URL

No painel do Supabase:
1. Vá em "Authentication" > "URL Configuration"
2. Adicione seu site URL (por exemplo: http://localhost:5174 para desenvolvimento)
3. Adicione os redirect URLs permitidos:
   - `http://localhost:5174/**`
   - Para produção: `https://seu-dominio.com/**`

## 5. Implementação Atual

O sistema de autenticação foi completamente refatorado:

### Funcionalidades Implementadas:
- **Login por email/senha**: Mantido e funcionando via Supabase
- **Login com Google**: Implementado usando Supabase OAuth
- **Login com Facebook**: Implementado usando Supabase OAuth
- **Cadastro por email/senha**: Mantido e funcionando via Supabase

### Componentes Modificados:
1. **AuthContext.tsx**: Adicionados métodos `loginWithGoogle()` e `loginWithFacebook()`
2. **Login.tsx**: Botões de login social agora chamam os métodos reais do Supabase
3. **LoginPage.tsx**: Integração com os novos métodos de login social
4. **CadastroPage.tsx**: Mantido para cadastro por email/senha

### Comportamento do Sistema:
- O Supabase gerencia automaticamente o redirecionamento OAuth
- O listener `onAuthStateChange` detecta quando o usuário retorna do login social
- Perfis são criados automaticamente na tabela `profiles` se não existirem
- Novos usuários via OAuth recebem role 'student' automaticamente
- O `display_name` é obtido dos metadados do provedor OAuth

## 6. Testar

Após configurar:
1. Teste o login com Google
2. Teste o login com Facebook
3. Teste o cadastro por email/senha
4. Verifique se os usuários são criados corretamente na tabela `profiles`

## Observações Importantes

- O sistema cria automaticamente um perfil na tabela `profiles` se não existir
- Para login social, o display_name é obtido dos metadados do usuário
- O usuário é automaticamente definido como role 'student' para novos cadastros
- Após o primeiro login, o usuário é redirecionado para o onboarding
- Não é necessário uma página de callback separada - o Supabase gerencia isso automaticamente