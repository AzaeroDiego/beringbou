# Bering Bou MCP: prueba de conexión

Servidor MCP remoto **solo de lectura**, sin claves, sin conexión a Supabase y sin acciones sobre redes sociales. Nunca almacena datos ni permite crear campañas; el objetivo es comprobar que ChatGPT detecta `get_brand_context`.

## Despliegue separado

Desde raíz del repositorio: `npx wrangler deploy --config wrangler.mcp.jsonc`.

No cambies `wrangler.jsonc` ni el Worker/Pages de la web. El despliegue de MCP debe tener URL HTTPS independiente con ruta `/mcp`. Ejemplo **no confirmado**: `https://beringbou-mcp-test.<subdominio>.workers.dev/mcp`.

Conecta esa URL en ChatGPT > Plugins > + > Add custom MCP server (para esta prueba únicamente: sin autenticación). Comprueba que aparece y puede ejecutar `get_brand_context`.

**Antes de implementar herramientas de escritura o lectura de datos internos**, incorporar OAuth 2.1, aislar identidades y permisos, y verificar acceso de administrador. No conectar Supabase service_role a este endpoint abierto. El objetivo es retirar el modo público tras validar la conexión.
