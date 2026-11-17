# Bering Bou: evaluación de la propuesta local

Estimación independiente, no afiliada con Awwwards. Cuatro tipos de página revisados el 16 de noviembre de 2026 (Lima/Bogotá): inicio, entradas, conceptos y error 404. El crítico no consultó el código, la web en vivo, las notas de diseño ni la evaluación anterior.

**La idea leída por el crítico:** una salida con tu grupo en Huaycán se convierte en dos canales de luz, con flyers, coordinación por WhatsApp y un adelanto de entradas digitales. La lectura coincide con la intención de Bou en estéreo.

**Nota independiente: 7,54/10.** Cálculo: 0,4 × 7,7 + 0,3 × 7,8 + 0,2 × 7,2 + 0,1 × 6,8.

**Estimación orientativa de jurado: aproximadamente 8,6.** Es la nota del crítico + 1,1, según la calibración de la skill con solo dos sitios premiados. Banda de referencia: rango de puntuación Site of the Day. Esta extrapolación tiene evidencia limitada; no predice un premio ni sustituye una evaluación real. No se extrapolan las notas técnicas.

| Criterio | Nota | Evidencia |
|---|---:|---|
| Diseño (40%) | 7,7 | `final-desktop.png`, `shots/home/d-01-hero.png`, `vip-state.png`: tipografía monumental, doble B y sistema coherente; las composiciones inferiores son más convencionales. |
| Usabilidad (30%) | 7,8 | `final-mobile.png`, informes de cuatro páginas e `../interactions.json`: acciones claras, foco, filtros, formulario y tamaños. La información comercial aún requiere consulta. |
| Creatividad (20%) | 7,2 | Hero y pase llevan la doble B; los paneles interiores y la cortina amarilla podrían expresar más el concepto estéreo. |
| Contenido (10%) | 6,8 | Flyers, voz local y ubicación específicos; `gallery-photo.png` y `gallery-video.png` evidencian la falta de material documental. Faltan detalles comerciales confirmados. |

| Área técnica | Nota | Evidencia |
|---|---:|---|
| Semántica y SEO | 7,5 | `audit.txt`: 0 fallos. Encabezados y títulos propios en rutas principales; 404 real. El título del 404, observado por el crítico, fue corregido después y consta en `final-recheck.json`. Se conserva la nota sin recalcularla. |
| Animaciones y transiciones | 8,0 | Informes `hover.noHoverChange` y `colorOnly` vacíos; pares de hover, transiciones y 60–61 fps medidos. Las imágenes fijas no permiten juzgar subjetivamente toda la animación. |
| Accesibilidad | 8,0 | Último `final-recheck.json`: 0 infracciones en cuatro rutas. Salto al contenido con foco visible. Informes completos: 0 texto oculto y 0 movimiento con movimiento reducido. |
| Rendimiento | 8,0 | LCP móvil: inicio 2000 ms, entradas 1160 ms, conceptos 1508 ms, 404 1048 ms. CLS 0. Página principal ~1242 KB; JS comprimido ~231 KB. |
| Responsive | 8,0 | Capturas móviles compuestas; 0 desbordamientos a 390, 768, 1024, 1440 y 1920 px. No se afirma una prueba física de todos los dispositivos. |
| Marcado y metadatos | 8,0 | Auditoría sin fallos, imagen de vista previa y favicon válidos. Comprobación final sin errores de ejecución. Indexación bloqueada intencionalmente para esta prueba local. |

## Correcciones realizadas

- La imagen ambiental dejó de descargarse en móvil. LCP del inicio: de 6,72 s a 2,00 s; CLS permanece en 0.
- Flyers convertidos a WebP, con alturas correctas para los carteles verticales. Peso aproximado del inicio: de 1845 KB a 1242 KB.
- Imagen de vista previa generada, nombres accesibles corregidos, frases móviles separadas y feedback de logo/enlaces completado.
- Etiqueta de evento finalizado sobre el flyer histórico, conservando la advertencia de condiciones caducadas.
- Título y descripción propios para el 404, verificados después de la evaluación independiente. Leyenda conceptual móvil con mayor contraste y tamaño.

La primera evaluación (7,0) cubría solo el inicio; la de 7,54 cubre las cuatro páginas. No se presenta su diferencia como una comparación equivalente. El crítico final conserva sus notas originales: no se han aumentado por las correcciones posteriores de metadatos y leyenda.

## Mejoras pendientes, por impacto

1. **Contenido:** incorporar una selección breve de fotografías y videos reales del local, con permiso de uso y contexto. No sustituirla por imágenes documentales inventadas.
2. **Usabilidad y contenido:** confirmar hora de apertura, ingreso, condiciones, vigencia de promociones y carta para mostrarlos junto a cada consulta. No inventar esos datos.
3. **Creatividad:** extender los dos canales de la identidad a una interacción adicional, como la confirmación de consulta o la transición. Es una mejora de dirección artística, no un fallo de funcionamiento.

La propuesta no alcanza 8 en todos los criterios. Las carencias de material real y datos confirmados son límites explícitos; no se elevaron las notas para ocultarlos.

## Alcance de las mediciones

Dos pasadas completas con escritorio, teléfono de 390 px con CPU 4x y 4G lenta, movimiento reducido, teclado, hover, navegación y 404. Después se ejecutó una comprobación dirigida en la compilación final para nombres accesibles, metadatos, foco y estados. Los datos de rendimiento y hover proceden de la segunda pasada completa; los pequeños cambios posteriores de etiqueta, metadatos y leyenda constan por separado.

- Auditoría: **0 FAIL, 1 WARN**. El aviso es la repetición deliberada de condiciones en tres visores de flyers.
- Última comprobación axe: **0 infracciones** en las cuatro páginas; errores de ejecución: **0**.
- Desbordamiento horizontal y objetivos pequeños: **0** en los informes completos.
- Movimiento reducido: texto oculto **0**, movimiento residual **no**.
- `hover.noHoverChange` y `hover.colorOnly`: **vacíos** en las cuatro páginas.
- El detector inglés marca `skipLinkFirst:false`, aunque el primer Tab es «Ir al contenido». Capturas y comprobación final verifican su `href="#main"` y contorno visible.
- La captura del 404 contiene una petición de icono abortada durante navegación; la auditoría comprueba que el icono carga. Se conserva esta observación sin confundirla con un error de ejecución.
- Las mediciones se obtuvieron en navegador automatizado. No se puntúan sonido ni sensaciones de movimiento que las capturas no demuestran.

Informe original del crítico: `critic.md`. Evidencias: `shots/`, `audit.txt`, `final-recheck.json`, imágenes finales e `../interactions.json`.

Cuando se incorporen los contenidos reales, `/jury` puede volver a evaluar la propuesta con un crítico nuevo.
