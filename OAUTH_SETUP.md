# Configuração Google OAuth para Produção

## Problema: Erro "Configuration" no NextAuth

O erro `https://quadro-funcionarios.epamig.tech/login?error=Configuration` indica que há um problema na configuração das credenciais do Google OAuth.

## Passos para Corrigir:

### 1. Verificar Credenciais do Google Console

Acesse: https://console.developers.google.com

1. **Selecione o projeto** ou crie um novo
2. **Ative a Google+ API** (se ainda não estiver ativa)
3. **Vá para "Credenciais"**
4. **Selecione ou crie um "OAuth 2.0 Client ID"**

### 2. Configurar URLs Autorizadas

No Google Console, configure as seguintes URLs:

**JavaScript origins autorizadas:**
- `https://quadro-funcionarios.epamig.tech`
- `http://localhost:3000` (para desenvolvimento)

**URIs de redirecionamento autorizadas:**
- `https://quadro-funcionarios.epamig.tech/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (para desenvolvimento)

### 3. Variáveis de Ambiente

#### Para Desenvolvimento (.env.local):
```env
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
NEXTAUTH_SECRET="sua-secret-key"
```

#### Para Produção (.env):
```env
NEXTAUTH_URL="https://quadro-funcionarios.epamig.tech"
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
NEXTAUTH_SECRET="sua-secret-key"
ALLOWED_EMAIL_DOMAINS="epamig.br,epamig.ufla.br"
```

### 4. Verificar Configurações

Execute o script de verificação:
```bash
npm run dev
```

Verifique o console para confirmar que todas as variáveis estão definidas.

### 5. Problemas Comuns

1. **Client ID/Secret incorretos**: Verifique se copiou corretamente do Google Console
2. **URLs não autorizadas**: Certifique-se que `quadro-funcionarios.epamig.tech` está nas URLs autorizadas
3. **Domínio não verificado**: O domínio deve estar verificado no Google Console
4. **Cache**: Limpe o cache do navegador após as alterações

### 6. Debug

Para debug adicional, defina:
```env
NODE_ENV=development
```

E verifique os logs no console do navegador e do servidor.

## Notas Importantes:

- As credenciais do Google devem ser diferentes para desenvolvimento e produção
- O domínio `quadro-funcionarios.epamig.tech` deve estar verificado no Google Console
- Certifique-se que não há espaços extras nas variáveis de ambiente
- Reinicie o servidor após alterar as variáveis de ambiente