# Bering Bou · web + Supabase

Repositorio público limpio de la nueva web; no contiene archivos ni historial del sistema antiguo. Diseño adaptado al video de Diego: fondo navy, cian/fucsia, botones amarillos redondeados, portada inmersiva, cuenta regresiva y reserva en tres pasos. Incluye el evento real del flyer, plano de diez boxes y sección de cumpleaños.

## Ejecutar y compilar

Requiere Node 20 o superior. Sin dependencias de npm.

```sh
npm test
npm run build
```

`dist/` contiene únicamente la nueva web. Para verla localmente:

```sh
python -m http.server 8080 --directory dist
```

Abrir `http://localhost:8080/`. No abrir el HTML con `file://`, porque usa módulos JavaScript.

## Rutas

- `/`: inicio, Halloween, boxes, cumpleaños y ubicación.
- `/cumple/`: misma experiencia con acceso directo a cumpleaños.
- `/admin/`: panel privado de métricas y solicitudes.

## Supabase conectado

Proyecto: `gowitycgqmywvtxzdrdu`. El cliente usa una clave publicable en `web/config.js`; no hay secretos de servidor en este proyecto. La migración ya fue aplicada y se guarda en `supabase/migrations/` para trazabilidad. No ejecutarla de nuevo en ese mismo proyecto.

Tablas nuevas:

| Tabla | Uso |
|---|---|
| `public.bering_analytics_events` | Vistas, secciones, selección de box, inicio y envío de formularios, clics a WhatsApp y scroll. |
| `public.bering_requests` | Solicitudes con nombre y celular, separadas de la analítica. |
| `public.bering_events` | Fecha y apertura de solicitudes del evento. |
| `public.bering_boxes` | Paquetes y precios del plano. |
| `bering_private.admins` | Lista privada de UID autorizados. |

Las tablas tienen RLS. El visitante no puede consultar solicitudes ni analítica. Se permite enviar a través de RPC con validación, restricciones e identificadores idempotentes. El backend solo expone la lista de boxes confirmados, sin información del cliente. Las funciones privilegiadas se encuentran en un esquema no expuesto; las RPC públicas son `SECURITY INVOKER`. No exponer `bering_private` en la Data API.

### Activar el administrador

La cuenta elegida por Diego ya está autorizada. Para añadir otra cuenta, usar su UID según `docs/SUPABASE_ADMIN.sql`. No se incluyen UID personales ni contraseñas en este repositorio. El acceso del panel usa Supabase Auth con contraseña y renovación de sesión; no crea usuarios ni muestra datos a usuarios no autorizados. No compartir contraseñas en conversaciones.

### Solicitar no equivale a reservar

El recorrido es zona → datos → solicitud recibida con código. El administrador coordina y verifica el adelanto fuera de la web; después cambia el estado a confirmada. Un índice único impide confirmar dos solicitudes para el mismo box y evento. Los pendientes no bloquean un box. No se cobra, no se verifica Yape automáticamente ni se envían mensajes automáticos.

La capacidad de asientos, invitados adicionales, adelanto, hora de apertura y premio no se inventaron. El flyer solo confirma cuatro pulseras VIP por paquete. Antes de lanzar, completar esos detalles con el negocio.

## Qué mide el panel

Rango de fechas en hora de Lima, vistas, sesiones por pestaña, solicitudes, confirmaciones, interacción agregada, origen, campañas, evolución diaria y boxes consultados. Exportación CSV solo de métricas, sin datos personales. Los listados muestran hasta 500 solicitudes recientes del periodo; los totales se calculan sobre todas las solicitudes.

- Analítica solo con consentimiento. Rechazar no bloquea formularios.
- No hay grabación de pantallas ni de pulsaciones, fingerprinting ni mapas de calor.
- No se guardan URL completas, IP, nombres o teléfonos en la analítica.
- Un ID por pestaña no equivale a una persona única. Las etapas son interés agregado, no un embudo secuencial ni atribución causal de ventas.
- Un clic de WhatsApp no demuestra mensaje enviado. La opción aparece después del envío solo si se confirma un número del negocio en `web/config.js`.
- La analítica puede perder eventos al cerrar abruptamente, ante bloqueadores o sin conexión. La cola de reintento es temporal y no persiste contenido de formularios.
- Las métricas del navegador son indicativas y pueden ser manipuladas. El límite por sesión y el campo trampa son básicos, no una defensa contra bots; antes de campañas grandes añadir una pasarela con límites por IP y verificación de desafío.

Ejemplo de enlace de campaña: `https://beringbou.com/?utm_source=facebook&utm_campaign=halloween_2026`. Solo se aceptan etiquetas de campaña de letras, números, guiones y guion bajo; no incluir datos personales en enlaces.

## Publicación posterior en beringbou.com

El dominio no se ha cambiado ni se ha reemplazado la web actual.

### GitHub Pages: demostración visual

El workflow de `main` compila con `node scripts/build.mjs --demo`. Esta variante permite explorar el diseño y el recorrido de reserva, pero **no envía solicitudes, no registra analítica y no habilita el panel**. Incluye un aviso visible y elimina la URL y la clave de Supabase del artefacto de Pages. El código funcional completo permanece en `web/`.

En Settings → Pages, elegir **GitHub Actions** como Source. GitHub publicará la demostración en la URL que devuelva el workflow, bajo `/beringbou/`. No se incluye un CNAME para no afectar el dominio existente.

### Web funcional

Compilar con `npm run build`, sin `--demo`, en un alojamiento adecuado para la operación comercial.

Opción sugerida: alojamiento estático comercial que permita conectar este repositorio (p. ej., Cloudflare Pages). Seleccionar **la rama del proyecto**, directorio raíz del repositorio, comando `npm run build` y carpeta de salida `dist`. Para hacerlo estable, integrar el PR primero y seleccionar `main` al configurar el despliegue.

Alternativa: subir exclusivamente el contenido de `dist/` a una raíz web nueva de Apache, usando su `.htaccess` incluido. Conservar copia de la web y base antiguas. El archivo antiguo `.htaccess` no debe seguir reescribiendo `/cumple` a la página antigua.

Después de probar la URL temporal: añadir `beringbou.com` y `www.beringbou.com` en el alojamiento, verificar titularidad y cambiar solo los DNS necesarios en el registrador. Conservar registros de correo MX/TXT. Activar HTTPS. No publicar el repositorio histórico completo, que contiene PHP, archivos operativos y datos antiguos; solo `dist/` de este proyecto.

Antes de publicar: confirmar WhatsApp, completar identificación del responsable y canal/plazo de privacidad, verificar paquetes y autorizar la cuenta administrativa. Los cambios posteriores de evento necesitan actualizar tanto el catálogo de Supabase como `web/config.js`; no hay editor de contenidos en esta versión.

## Validación

Pruebas unitarias de plano/precios, procedencia, sanitización de campañas, rechazo de claves privilegiadas, validación de solicitudes, fecha de Lima, UUID y CSV. Pruebas de base en transacción con rollback para escritura anónima por RPC, idempotencia, bloqueo de lectura a anónimos/no administradores y exclusión de doble confirmación. Prueba de navegador para elección de box y recorrido de solicitud. El UID de la cuenta elegida ya fue autorizado y la consulta de métricas bajo ese rol fue comprobada. El login interactivo con la contraseña real corresponde al usuario.

Ver `docs/ASSETS.md` para la procedencia de los recursos y `docs/VERIFICATION.md` para resultados de esta entrega.
