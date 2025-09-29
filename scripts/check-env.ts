// Script para verificar configurações do NextAuth
console.log('=== Verificando Configurações NextAuth ===');

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Definido' : 'NÃO DEFINIDO');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Definido' : 'NÃO DEFINIDO');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Definido' : 'NÃO DEFINIDO');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NÃO DEFINIDO');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NÃO DEFINIDO');

console.log('\n=== Configurações de Email ===');
console.log('ALLOWED_EMAILS:', process.env.ALLOWED_EMAILS || 'Vazio');
console.log('ALLOWED_EMAIL_DOMAINS:', process.env.ALLOWED_EMAIL_DOMAINS || 'Vazio');

export {};