# Estudio editorial Bering Bou V1

Ruta: `/studio/` (aun no fusionada a producción). Rama `feature/content-studio-v1`.

Incluye: autenticación Supabase existente, borradores, copy, enlace HTTPS al material, formato, red, calendario de fecha y estados editoriales. Los estados `planned` y `published` son **manuales**: esta versión no publica en Facebook, Instagram o TikTok. No hay almacenamiento de medios aún.

La tabla `public.bering_content_posts` y sus cuatro políticas RLS ya se aplicaron al proyecto Supabase de Bering Bou. El archivo SQL adjunto preserva el esquema para futuros entornos; **no volver a ejecutarlo en el proyecto actual**.

Pendientes de una V2: carga de imágenes/video mediante Storage, validación de formatos por red, vista calendario mensual, permisos OAuth y publicación mediante API oficiales. El subdominio `admin.beringbou.com` aún no existe; puede asociarse después de probar el módulo.

No fusionar ni desplegar sin una revisión de la interfaz y autorización administrativa.
