# Bering Bou — continuidad para Codex Cloud

Actualizado: **17 de noviembre de 2026, America/Bogota**. Documento basado en la conversación, los archivos versionados, GitHub y una consulta del dominio público. Esta entrega solo añade documentación; no cambia diseño, funcionalidad, datos ni configuración de producción.

## 0. Leer primero: estado real y fuente de verdad

- Repositorio: https://github.com/AzaeroDiego/beringbou
- Rama compartida: **main**. El checkout local usado en esta conversación se llama `release/bou-en-estereo-production`; sus cambios ya fueron enviados a main.
- Base comprobada antes de este documento: `0000d478db812fcfa0cfb453dbaa8b97b428eb36` (main remoto y HEAD local coincidían; árbol limpio).
- **La nueva web ya está publicada**, en https://www.beringbou.com/ y https://beringbou.com/. El usuario autorizó expresamente el pase a producción después de revisar la propuesta.
- El frontend publicado está en **`proposals/bou-en-estereo/`**, aunque el nombre de la carpeta todavía diga «proposals». **No rediseñar `web/index.html` suponiendo que es la portada actual.**
- `web/` sigue siendo necesario: aporta QR, administración, cumpleaños, configuración pública, módulos de API y analítica. La compilación combina ambos árboles.
- El último commit que cambió el producto/alojamiento fue `10081f53c7317cbcfad5f4545fa7be235883de6e`; el commit `0000d47` posterior guardó pruebas/documentación con `[skip ci]`.
- Cloudflare confirmó el despliegue de **`beringbou-web`** del commit `10081f5`. Versión Cloudflare: `2296f898-90a0-4ebf-b38d-747ebb3542a4`.
- Consulta realizada para este handoff: `/release.json` respondió 200 con `design: bou-en-estereo`, `buildId: 53c9121946bbe653`, `boxPricing: 2026-11-21-owner-confirmed`; una ruta inexistente respondió 404 con el título «Página no encontrada | Bering Bou».
- El `buildId` es un hash del HTML generado, **no un SHA Git**; puede cambiar entre compilaciones del mismo código.

### Documentación antigua que NO debe confundirse con el estado actual

`proposals/bou-en-estereo/README.md`, partes de `DESIGN.md`, `docs/contenido-y-dominio.md`, `docs/whatsapp-atencion.md` y secciones históricas del README raíz describen etapas anteriores: propuesta aislada, no publicada, galería pendiente o build funcional aún por desplegar. Esas afirmaciones quedaron superadas por la publicación y el material del propietario. El README de la propuesta también conserva instrucciones `next start` que ya no corresponden a la exportación estática actual.

Para el estado de producción usar este documento, `docs/RELEASE-2026-11-17.md` y el código. Los documentos históricos siguen siendo útiles como antecedentes; no se reescribieron en esta tarea.

## 1. Objetivo general

Web de entretenimiento nocturno para **Bering Bou**, discoteca de Huaycán, Ate, Lima, Perú. Identidad premium, juvenil, dinámica y moderna, con prioridad móvil. Debe permitir descubrir la programación, ver material real, consultar promociones, organizar grupos y separar un box mediante WhatsApp; además mostrar una propuesta visual para futuras entradas digitales y VIP.

Requisitos originales: portada impactante, eventos con flyers/fechas/invitados, reservas y consultas por WhatsApp, promociones/bebidas, galería de fotos y video, ubicación y concepto de entradas/VIP. No inventar artistas, eventos, precios, promociones ni disponibilidad.

## 2. Decisiones de diseño y experiencia de usuario

### Selección conceptual

Se aplicó `/awwwards` para plantear tres direcciones y elegir una. Las cifras siguientes son **valoraciones de selección del diseñador**, no premios ni notas oficiales de Awwwards. Total = originalidad + afinidad + viabilidad − portabilidad (menor portabilidad es mejor).

| Concepto | Ancla | Valores O/A/V/P | Total | Decisión |
|---|---|---|---|---|
| **Bou en estéreo** | Las dos B de Bering Bou, dos canales de luz | 4/5/5/2 | 12 | Elegido e implementado |
| Huaycán de noche | Recorrido de la avenida al segundo piso del local | 4/5/4/3 | 10 | Alternativa conceptual |
| En primera fila | Canales y controles de una consola musical | 3/4/5/5 | 7 | Alternativa conceptual |

Las tres propuestas se conservan en `/conceptos/` durante desarrollo y en `DESIGN.md`; el build normal elimina esa página de `dist/` para no publicar material interno. No se construyeron tres sitios completos.

### Identidad elegida

- Negro predominante `#090909`, texto claro `#f3f0e8`, secundarios `#aaa9a3`, líneas `#353530`, amarillo `#f9e547`, rosa secundario `#f491cd` como luz.
- **Big Shoulders Display 800** para titulares y **Host Grotesk 400/600** para lectura. Fuentes WOFF2 autoalojadas, licencias OFL en `public/fonts/`.
- Marca monumental, doble B vectorial animada y composición de dos carriles desiguales en escritorio; una columna en móvil. Lenguaje cercano peruano moderado y Huaycán explícito.
- No se sustituyó el local con fotos de otras discotecas ni con personas generadas. El fondo atmosférico heredado es conceptual, no prueba documental.
- Se prioriza la composición vectorial en portada móvil por velocidad. No se implementó un video pesado de portada. El multimedia real está en la galería y los flyers.
- Sin audio automático, estrobos, loader, cursor personalizado ni WebGL.
- Movimiento coherente con «abrir y amplificar»: GSAP, transiciones y revelados; Lenis solo en escritorio compatible, scroll nativo móvil y respeto por movimiento reducido. La animación conceptual se pausa fuera de pantalla.
- Menú móvil accesible, cierre con Escape y devolución de foco; enlace para saltar al contenido; estados de foco/hover visibles.
- CTA móvil persistente **«Separa tu box»**, con espacio y safe area. Header y navegación enlazan al panel de boxes.
- «Fecha» y «Personas» de **Junta a tu mancha** se apilan en móvil. Se corrigieron anchos mínimos de controles y desbordamiento del pase futuro a 320 px, sin ocultar el problema con una máscara global.

### Reglas comerciales y de contenido

- WhatsApp comercial: **+51 930 776 652**, definido en `src/data/site.ts` y también en `web/config.js` por compatibilidad. Un enlace prepara un mensaje; **el visitante decide enviarlo**. No hay bot ni envío automático.
- Ubicación: **Av. 15 de Julio, Zona A, Lote 29; segundo piso del Banco Confianza, Huaycán, Ate, Lima**. Maps abre una búsqueda de referencia; no se verificó un pin exacto.
- Evento confirmado en el contenido actual: **ERROR, TikToker invitado, sábado 21/11/2026**. No presentarlo como DJ o músico. No reutilizar Kike Mouse del 7/11 como próximo evento.
- `EventPeriod` deja de mostrarlo como próximo después de su fecha, según **America/Lima**, y muestra «Programación por anunciar». No inventa un reemplazo.
- Flyers de Viernes Chelero y cumpleaños son originales; se solicita confirmar vigencia y condiciones. No hay una carta completa de bebidas con precios verificados.
- Halloween del 31/10/2026 es archivo histórico, rotulado como finalizado. Sus entradas/promociones no se ofrecen como vigentes. La reutilización de tarifas de **boxes** para ERROR es una autorización específica posterior del propietario, no una reactivación general de Halloween.

### Panel interactivo «Separa tu box»

- Plano de referencia de diez boxes, escenario, zona general y barra VIP; no está a escala.
- Izquierda: 1–5; derecha: 6–10. Black: **1, 2, 6, 7**. Red: **3, 4, 5, 8, 9, 10**.
- Se eligen fecha y box; se actualizan paquete, precio y mensaje de WhatsApp.
- **Fechas normales: «Precios a consultar»**, sin inventar tarifa ni contenido cerrado.
- **Única fecha fuerte dada de alta: 2026-11-21, ERROR**. El propietario pidió usar las tarifas publicadas en Halloween: Black **S/320 / Black Label**, Red **S/270 / Red Label**; una botella, dos guaranás, hielo ilimitado y cuatro pulseras VIP.
- No considerar todos los sábados fechas fuertes. Solo añadir fechas confirmadas en `src/data/boxes.ts`. El modelo actual reutiliza los mismos dos paquetes para todas las claves que se añadan a `strongDates`; para tarifas distintas por evento habrá que ampliar el modelo.
- Capacidad de asientos, invitados adicionales y adelanto: por confirmar con el local. El color representa tipo/selección, **no disponibilidad real**. Consultar no bloquea ni confirma un box.
- Fechas vacías, imposibles o pasadas no habilitan continuar en este panel. Fecha local en Lima; la selección inicial actual es 21/11/2026.

### Datos personales y medición

- Formulario moderno de grupos: prepara un texto en la pantalla y un enlace a WhatsApp; no registra una solicitud en la base de datos.
- `/cumple/` y `/qr/` son flujos operativos distintos que sí usan el backend existente.
- Medición opcional solo tras consentimiento, con rechazo y preferencias. No enviar nombres, teléfonos, DNI ni contenido de formularios a la analítica.
- Visitas actuales usan `event_slug: null`, evitando atribuirlas a Halloween. No introducir un slug nuevo sin revisar las restricciones del backend.
- Se conserva una CSP estricta para scripts con hashes exactos del HTML exportado; no se abrió `unsafe-inline` o `unsafe-eval` en `script-src`.
- El beacon opcional que Cloudflare inyecta desde `static.cloudflareinsights.com` queda bloqueado deliberadamente. Es un aviso conocido de consola, diferenciado de fallos de scripts del sitio.

## 3. Arquitectura y tecnologías

### Frontend y compilación

- App Router de **Next.js 16.4.6**, **React/React DOM 19.3.0**, TypeScript; CSS propio en `src/app/globals.css`.
- Dependencias declaradas: GSAP `^3.15.1`, Lenis `^1.3.27`. Versiones resueltas en el `package-lock.json` de la app.
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, imágenes sin optimización de servidor. **No hay servidor Next en producción** ni API de Next para formularios.
- `scripts/build.mjs` elige build moderno por defecto; `--demo` ejecuta `scripts/build-legacy.mjs`.
- `scripts/build-modern.mjs`: instala dependencias de la app si faltan o en CI, ejecuta pruebas de boxes y build Next, limpia únicamente `dist/`, copia `web/`, superpone `proposals/bou-en-estereo/out/`, elimina conceptos internos, ajusta cumpleaños/QR, genera CSP y `/release.json`.
- El build enfoca `/cumple/` en el formulario heredado con ajustes de HTML/CSS; no lo reimplementa en React. Evitar quitar nodos ocultos sin revisar las consultas del JS heredado.
- Cloudflare **Workers Static Assets**, servicio `beringbou-web`, publica `dist/` por integración con GitHub/main. `wrangler.jsonc` fija ese nombre, el directorio y `not_found_handling: '404-page'`.
- `.github/workflows/bering-web.yml` es otro destino: publica la **demo histórica** en GitHub Pages usando `--demo`, sin configuración de Supabase ni medición/formularios reales. GitHub Pages **no es el despliegue que valida el dominio normal**.

### Backend conservado

- Supabase: proyecto `gowitycgqmywvtxzdrdu`, endpoint público `https://gowitycgqmywvtxzdrdu.supabase.co`.
- Acceso por `fetch` y RPC en `web/js/api.js`; configuración publicable en `web/config.js`, sin SDK npm de Supabase necesario para estos módulos.
- Supabase Auth para administrador, sesión en `sessionStorage` y renovación; permisos/RLS y funciones SQL definidos en las migraciones versionadas.
- Migraciones: analítica/solicitudes (`20261025063346…`), invitados QR (`20261109175952…`) y confirmación QR (`20261109185904…`). El rediseño **no aplicó migraciones ni modificó datos existentes**. No reaplicar ciegamente estas migraciones en producción.
- SQL y código incluyen analítica, solicitudes, catálogo histórico y administración de invitados. El esquema privado `bering_private` no debe exponerse como API pública.
- QR operativo: registro de adulto con nombre, nacimiento, DNI, teléfono y consentimiento para el sábado calculado en Lima; QR descargable, referencia y recuperación por recibo. Estados `pending`, `confirmed`, `active`; administración puede listar invitados y confirmar asistencia. No confundirlo con una entrada comprada.
- El repo no implementa venta de entradas, pagos ni un sistema completo de escaneo/canje de una sola utilización en puerta.

### Mapa de archivos para continuar

| Archivo/directorio | Responsabilidad |
|---|---|
| `proposals/bou-en-estereo/src/app/page.tsx` | Secciones de la portada publicada |
| `src/app/globals.css` dentro de la app | Sistema visual y responsive |
| `src/data/site.ts` dentro de la app | Marca, contacto, ubicación, evento, conceptos |
| `src/data/boxes.ts`, `src/components/BoxPanel.tsx` dentro de la app | Tarifas por fecha, plano, selección y WhatsApp |
| `src/components/Interactions.tsx` dentro de la app | Consulta grupal, flyers ampliables y demo General/VIP |
| `src/components/RealGallery.tsx`, `public/media/gallery/` dentro de la app | Fotografías y video reales optimizados |
| `src/components/EventPeriod.tsx`, `Privacy.tsx` dentro de la app | Caducidad de agenda, consentimiento y privacidad |
| `src/engine/`, `src/motion/` dentro de la app | Movimiento, scroll y transiciones |
| `web/qr/`, `web/admin/`, `web/cumple/`, `web/js/` | Rutas y módulos operativos heredados |
| `scripts/build-modern.mjs`, `web/_headers`, `wrangler.jsonc` | Empaquetado, seguridad y alojamiento |
| `supabase/migrations/` | Historial de esquema y permisos; revisar antes de tocar backend |
| `docs/RELEASE-2026-11-17.md` | Evidencias, límites y reversión de la publicación |

## 4. Funcionalidades implementadas y verificación

**Implementadas:** portada y movimiento de doble B; agenda/flyer con caducidad; panel de boxes; formulario de grupos por WhatsApp; flyers/promociones y cumpleaños; galería con pestañas, ampliación y video manual; ubicación; demo de entradas General/VIP; navegación responsive y 404; metadatos/canonical, sitemap y robots de producción; consentimiento y analítica conectada; conservación de QR, cumpleaños y administración.

**Multimedia real:** el usuario entregó `Photos-1-001.zip`. Se publicaron tres fotos convertidas a WebP (`IMG_8337.HEIC`, `IMG_8339.JPG`, `IMG_8344.HEIC`) y un clip de `IMG_8336.MOV` de aproximadamente 6,7 segundos, sin audio, 540 px y 24 fps, con controles y `preload="none"`. Se excluyó `gemini_generated_video_1EA62117.mp4` como registro documental. No se identificaron personas ni se atribuyeron fechas a las fotos. Procedencia: `proposals/bou-en-estereo/docs/MEDIA.md`.

**Pruebas realizadas en el pase a producción:**

- 15 pruebas del repositorio heredado, 4 pruebas de fechas/precios de boxes, lint y compilación TypeScript aprobados.
- Chromium vía Edge y WebKit (motor Safari), en **320, 360, 375, 390, 414, 540, 600, 768, 1024, 1440 y 1920 px**.
- Comprobaciones de desbordamiento, separación Fecha/Personas, diez precios, fechas ordinarias/inválidas, texto de WhatsApp, menú/Escape/foco, lightbox, video bajo demanda y navegación a la demo VIP.
- QR/PNG/estado pendiente y envío de cumpleaños: probados con **RPC interceptadas y simuladas**, también sobre el dominio público. No se crearon registros ni solicitudes reales para probar. La pantalla de login administrativo se comprobó cerrada al visitante; **no se inició sesión con credenciales reales ni se certificó el flujo administrativo completo** en esta entrega.
- Cero errores de ejecución, recursos ausentes, bloqueos CSP inesperados y hallazgos graves/críticos de axe en la portada en la pasada final de ambos motores. No equivale a certificación WCAG ni a prueba en teléfonos físicos.
- Rendimiento de una ejecución sobre el dominio público: LCP **2444 ms**, CLS **0**, scroll **61 fps**, CPU 4×, 1,6 Mbps y latencia de 150 ms; sin descarga inicial MP4. Son datos de laboratorio, no métricas reales de todos los visitantes.
- `/jury` tuvo revisión independiente histórica de **7,54/10 anterior al material del propietario**. No es nota de esta versión publicada ni evaluación oficial de Awwwards. Informe: `docs/design-review-before-owner-media.md` dentro de la app.
- Evidencias detalladas locales en `.release-checks/`, ignoradas por Git. Cloud no recibirá esos archivos; el resumen de resultados sí está versionado en `docs/RELEASE-2026-11-17.md`. Las capturas versionadas de `proposals/bou-en-estereo/docs/` son de la propuesta y no deben presentarse como capturas nuevas de todos los cambios finales.

## 5. Funcionalidades pendientes

1. **Entradas digitales/VIP reales:** catálogo de eventos vendibles, tarifas/condiciones, pagos, emisión segura, estados, devoluciones y validación/canje en puerta. Hoy `/entradas/` es una demo explícita; `/qr/` es un registro de invitados separado.
2. **Gestión de disponibilidad/reservas de boxes por evento:** el panel moderno consulta por WhatsApp; no bloquea inventario ni registra reservas. Hay backend histórico de solicitudes/boxes, pero no se conectó el nuevo panel a él.
3. **Editor/CMS de programación, promociones y tarifas** y posible sincronización con redes. El contenido moderno actual está en código, no se administra desde el panel existente.
4. Confirmar carta completa de bebidas, precios, vigencias de promociones, horario de atención, condiciones de cumpleaños, aforos, adelantos/cancelaciones y responsables de WhatsApp. No completarlos con suposiciones.
5. Automatización de WhatsApp/n8n/Meta: solo propuesta documental; no hay bot, integración para leer conversaciones ni automatizaciones activadas por este proyecto.
6. Confirmar pin de Maps y enlaces oficiales de redes antes de añadirlos; completar y mantener la información de privacidad/retención con el responsable del negocio.
7. Más medios reales pueden incorporarse cuando el propietario los facilite. No hace falta el ZIP original para ejecutar la web actual.

## 6. Errores conocidos, límites y asuntos sin resolver

- **Fallo ajeno al pase web:** la integración Cloudflare `beringbou-mcp-test` reportaba fallo ya en `a0d0ab0`, antes del rediseño; volvió a fallar en los commits de publicación. No se diagnosticó ni reparó; no confundirlo con `beringbou-web`, que desplegó correctamente. Los checks de `0000d47` se omitieron por `[skip ci]`.
- **Documentación desfasada:** los archivos históricos citados al inicio pueden llevar a ejecutar `next start`, suponer que main no cambió o pensar que no hay galería. No seguirlos sin contrastar.
- **Selección inicial de box con fecha fija:** después del 21/11/2026 el panel arrancará con una fecha pasada y pedirá elegir otra; no la sustituye automáticamente. Es un límite visible del código actual, no algo corregido.
- **Caducidad dependiente del cliente:** `EventPeriod` resuelve la fecha tras hidratar; el HTML estático inicial todavía contiene el evento anterior. Revisar este límite antes de asumir que se eliminan automáticamente todos sus rastros para SEO o sin JS.
- **Modelo de tarifas fuerte compartido:** nuevas fechas en `strongDates` heredan S/320 y S/270; no soporta aún paquetes distintos por evento.
- **CSP:** el número de hashes crece con páginas/scripts inline. El build falla si la línea supera 2000 caracteres. No eliminar la protección ni copiar hashes de un build anterior.
- **Aviso de consola esperado:** beacon de Cloudflare bloqueado por CSP; no ampliar permisos de rastreo para «poner los tests en verde».
- **Automatización de pruebas dependiente del entorno:** `scripts/test-release.mjs` y `check-release-performance.mjs` lanzan `channel: 'msedge'`. Cloud/Linux necesita instalar Edge y las dependencias de WebKit; instalar solo Chromium no basta. Una adaptación futura a Chromium debe ser un cambio explícito, no presentarse como prueba ya realizada.
- **Cumpleaños heredado:** el build lo adapta mediante reemplazos de HTML; cambios al marcado original requieren verificar que esos reemplazos y los selectores JS sigan funcionando.
- No hay una incidencia funcional crítica abierta en los recorridos públicos comprobados del pase. Eso no garantiza ausencia de errores, pruebas reales de pagos o de todo el backend. La sesión de handoff solo volvió a consultar GitHub y HTTP; no repitió la batería completa.

## 7. Dependencias, comandos y configuración

### Preparar un checkout limpio en Cloud

Recomendado **Node 22.16 o superior compatible** y npm; `.node-version` fija 22.16.0. El `package.json` raíz conserva `engines >=20`, pero usar 22.16+ por las pruebas TypeScript. Instalar desde el lock de la app; no hay lock/dependencias npm en la raíz.

```sh
git checkout main
git pull --ff-only
npm ci --prefix proposals/bou-en-estereo
```

Leer `proposals/bou-en-estereo/AGENTS.md` antes de modificar esa app: exige consultar la documentación pertinente de la versión instalada en `node_modules/next/dist/docs/`. Las skills locales `/awwwards` y `/jury` usadas en la conversación **no están incluidas como dependencias del repo**; comprobar si Cloud las tiene antes de invocarlas.

### Desarrollo rápido del frontend

```sh
npm run dev --prefix proposals/bou-en-estereo -- --hostname 0.0.0.0 --port 4400
```

Usar la vista previa de puerto que proporcione el entorno Cloud. La IP LAN y los servidores del ordenador de la conversación no se transfieren. Este modo ejecuta la app moderna, no empaqueta automáticamente las rutas heredadas; para comprobar el conjunto usar el build raíz.

### Pruebas y compilación integrada, en este orden

```sh
npm test
npm run lint --prefix proposals/bou-en-estereo
npm run build
node scripts/serve-production.mjs 4402
```

**Atención:** `npm test` raíz incluye una prueba que genera la demo y sobrescribe `dist/`. Ejecutarlo **antes** del build moderno. Si se ejecuta después, reconstruir con `npm run build` antes de servir/publicar. No editar `dist/` o `out/` como fuentes.

El build normal ya ejecuta las cuatro pruebas de boxes. También pueden lanzarse por separado:

```sh
npm test --prefix proposals/bou-en-estereo
```

`serve-production.mjs` sirve `dist/`, cabeceras CSP, MIME de `.mjs`, rangos de video y 404. Escucha en `0.0.0.0`. **Reiniciarlo después de cada build**, porque lee `_headers` al arrancar. `next start` no es la forma de servir esta exportación estática.

### Pruebas de navegador opcionales según capacidades del entorno

```sh
cd proposals/bou-en-estereo
npx playwright install --with-deps msedge webkit
cd ../..
node scripts/test-release.mjs http://127.0.0.1:4402
node scripts/check-release-performance.mjs http://127.0.0.1:4402/
```

La instalación de navegadores/dependencias necesita red y puede requerir permisos del entorno. Si no es posible, dejar constancia; no afirmar haber probado Safari. Los scripts funcionales interceptan Supabase para evitar escrituras reales. La prueba de rendimiento es Chromium/Edge, no Safari.

### Variables y credenciales

- `NEXT_PUBLIC_SITE_MODE=production` y `NEXT_PUBLIC_SITE_URL=https://www.beringbou.com`: las establece el build raíz para Next. El dev directo usa el modo de propuesta/noindex y URL local por defecto.
- Supabase público ya está en `web/config.js`; **no copiar claves secretas, contraseñas ni tokens al handoff, frontend o GitHub**. El build funcional no necesita `service_role`.
- Probar operaciones administrativas reales requiere credenciales autorizadas y permisos existentes; no se incluyen aquí.
- `npx wrangler deploy --dry-run --outdir .release-checks/worker` valida el empaquetado sin publicar. Un despliegue manual requiere autenticación Cloudflare disponible en el entorno; la CLI local no estaba autenticada y se usó el enlace GitHub → Cloudflare.
- GitHub/main activa publicación: no subir cambios de producto sin revisar su impacto. Este documento y los ajustes exclusivamente documentales se guardan con `[skip ci]` para evitar un despliegue innecesario.
- No cambiar DNS, dominio ni esquema Supabase para arrancar una copia de desarrollo.

## 8. Último punto exacto del desarrollo

1. Se subió la propuesta aislada en `c95d171`, inicialmente sin tocar main, como pidió el usuario al principio.
2. Después el usuario pidió recuperar boxes, tarifas por tipo de fecha, corregir el formulario móvil y **autorizó publicar en su URL normal**. Se implementó y publicó en main mediante `82f36ce`.
3. Las pruebas públicas detectaron que Cloudflare devolvía un 404 vacío: `10081f5` añadió `wrangler.jsonc` para servir la página diseñada. El despliegue web completó correctamente.
4. Se repitió la batería sobre **https://www.beringbou.com** en Chromium y WebKit; ambos aprobaron. `0000d47` guardó la documentación y el tratamiento del bloqueo esperado del beacon en las pruebas, sin cambiar el producto.
5. En esta tarea se comprobó que main remoto sigue en `0000d47`, la copia local estaba limpia, el marcador de producción sigue disponible y la página 404 personalizada responde. Se prepara **este HANDOFF.md**, único cambio solicitado. No se inició una nueva función ni un nuevo rediseño.

Respaldo anterior al pase: etiqueta **`backup/before-bou-en-estereo-20261117`**, apuntando a `a0d0ab068c4f7a9454c7a1c3780489fb83fa7e10`. Si hace falta revertir producción, preferir restaurar el despliegue anterior desde Cloudflare o una reversión revisada en Git. No hacer force-push ni borrar registros del backend.

## 9. Próximas tareas recomendadas

1. Abrir este repo en Cloud, leer este documento y comprobar rama/SHA; instalar dependencias y arrancar la vista integrada. **Conservar la versión visual que al usuario le gustó.**
2. Prioridad de mantenimiento: resolver la selección inicial del panel al pasar el 21/11 y obtener la próxima programación confirmada; mantener la regla «Precios a consultar» sin autorización comercial nueva.
3. Con el propietario, cerrar aforos, inclusiones, condiciones, vigencias y proceso de reservas antes de convertir consultas en inventario real.
4. Si se trabaja en entradas/VIP, definir alcance y contratos del backend/pagos; distinguir invitados QR de entradas pagadas y no habilitar ventas desde la demo sin implementación y verificación completas.
5. Verificar con una cuenta administrativa autorizada los flujos reales de consulta/confirmación y retomar la integración MCP de pruebas como asunto separado si se necesita.
6. Facilitar regresiones en Cloud: revisar instalación de navegadores/Edge y la documentación antigua; mantener pruebas de tamaño 320 px, Safari, CSP y rutas heredadas en cualquier cambio de UI/build.
7. Para nueva evaluación visual, ejecutar `/jury` solo si está disponible y registrar evidencias nuevas; no reutilizar la nota histórica como si evaluara cambios futuros.

## 10. Preferencias del propietario y límites del relevo

- Prefiere avance autónomo y respuestas claras, breves y no técnicas. Se frustró con esperas y solicitudes repetidas de confirmación.
- Pidió expresamente que este documento quede en el repositorio para continuar en Cloud, sin reconstruir la conversación, y que no se cambie diseño o funcionalidad al prepararlo.
- Autorizó guardar/subir el trabajo y pidió no solicitar confirmación al finalizar. La autorización para el pase ya ejecutado no convierte las funciones pendientes en implementadas ni justifica inventar información comercial.
- El equipo local tenía otros directorios (`bering-bou-local`, `bering-bou-lab`, herramientas y originales multimedia) fuera de este repositorio. **No depender de ellos en Cloud**: las fuentes y recursos web necesarios sí están versionados aquí.
