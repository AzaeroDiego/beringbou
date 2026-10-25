# Verificación de esta versión

- 12 pruebas automatizadas de utilidades, validación y recursos de las tres rutas: aprobadas.
- Sintaxis de todos los módulos JavaScript: comprobada.
- Migración aplicada al proyecto Supabase conectado, sin alterar tablas existentes de finanzas/inventario.
- Escritura por RPC desde rol anónimo: comprobada en transacción con rollback.
- Reintentos con el mismo UUID no duplican eventos ni solicitudes: comprobado.
- Lectura anónima de solicitudes/analítica: sin permisos. Usuario autenticado sin membresía administrativa: sin datos y RPC privada rechazada.
- Dos confirmaciones para el mismo box/evento: bloqueadas por índice único; prueba con rollback.
- Navegador de escritorio: selección de box Red, avance por zona/datos/solicitud y guardado real con código devuelto por Supabase. Se usaron datos ficticios y se retiraron después.
- Analítica rechazada: cero eventos. Tras aceptación: page_view, section_view, box_select y scroll_depth verificados en la base. Se retiraron los eventos de QA después.
- Apariencia revisada en escritorio y viewport de iframe de 390px. No sustituye una prueba en iPhone físico.
- UID administrador autorizado: consulta del panel verificada con ese rol. No se manejaron contraseñas del usuario.
- El asesor de seguridad no encontró alertas WARN nuevas en las funciones Bering. La lista privada de administradores tiene RLS y ningún permiso de tabla para visitantes; el aviso INFO de ausencia de políticas es deliberado para denegar todo acceso directo.
- El proyecto Supabase ya tenía otros avisos ajenos a Bering; no se modificaron esas aplicaciones.

No se han modificado DNS ni publicado sobre beringbou.com. El workflow publica únicamente `dist/` compilado en modo demostración y no aplica migraciones. El modo funcional se conserva para otro alojamiento.
