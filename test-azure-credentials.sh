#!/bin/bash

# Script para testar credenciais do Azure AD

source backend/.env

echo "🔍 Testando credenciais Azure AD..."
echo ""
echo "CLIENT_ID: $AZURE_CLIENT_ID"
echo "TENANT_ID: $AZURE_TENANT_ID"
echo "CLIENT_SECRET: ${AZURE_CLIENT_SECRET:0:10}... (primeiros 10 caracteres)"
echo ""

# Simula o que o Spring Security faz: trocar código por token
# Primeiro, gere um código manualmente indo para:
echo "📋 Para testar, vá até esta URL no navegador:"
echo ""
echo "https://login.microsoftonline.com/$AZURE_TENANT_ID/oauth2/v2.0/authorize?client_id=$AZURE_CLIENT_ID&response_type=code&redirect_uri=http://localhost:8080/login/oauth2/code/microsoft&scope=openid%20profile%20email%20User.Read"
echo ""
echo "Após fazer login, você será redirecionado para localhost:8080 com um 'code' na URL."
echo "Copie esse código e execute:"
echo ""
echo "curl -X POST https://login.microsoftonline.com/$AZURE_TENANT_ID/oauth2/v2.0/token \\"
echo "  -H 'Content-Type: application/x-www-form-urlencoded' \\"
echo "  -d 'client_id=$AZURE_CLIENT_ID' \\"
echo "  -d 'client_secret=$AZURE_CLIENT_SECRET' \\"
echo "  -d 'code=COLE_O_CODIGO_AQUI' \\"
echo "  -d 'redirect_uri=http://localhost:8080/login/oauth2/code/microsoft' \\"
echo "  -d 'grant_type=authorization_code'"
echo ""
echo "Se retornar 401, as credenciais estão incorretas!"
