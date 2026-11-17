# Bering Bou · propuesta local

Fecha de revisión: 16 de noviembre de 2026, America/Bogota. No se publica ni se conecta a servicios de escritura.

## Brief
Discoteca de Huaycán, Lima. Público adulto joven, móvil primero. Objetivo: descubrir programación, coordinar grupos por WhatsApp y explorar una futura experiencia de entradas. No se inventan eventos, precios, promociones ni disponibilidad. Prototipo en Next.js + TypeScript: HTML generado en servidor, componentes interactivos pequeños y una base que permite crecer hacia entradas sin implementar pagos ahora.

## Tres territorios
Puntuación de 1 a 5. Total = originalidad + afinidad + viabilidad menos portabilidad (menor portabilidad es mejor). Son valoraciones de selección del diseñador, no notas oficiales.

| Concepto | Territorio y ancla real | Originalidad | Afinidad | Viabilidad | Portabilidad | Total |
|---|---|---:|---:|---:|---:|---:|
| Bou en estéreo | Identidad: las dos B de Bering Bou se convierten en dos canales de luz | 4 | 5 | 5 | 2 | 12 |
| Huaycán de noche | Lugar: el recorrido por Av. 15 de Julio hasta el segundo piso del local | 4 | 5 | 4 | 3 | 10 |
| En primera fila | Material: señales y controles de una consola musical para explorar la agenda | 3 | 4 | 5 | 5 | 7 |

### A. Bou en estéreo (elegido)
Idea: dos B, dos canales de luz, una noche compartida en Huaycán.
Metáfora: estéreo visual que abre espacio entre la marca y el plan.
Firma: dos arcos B desplazados se abren con el puntero o al desplazarse en móvil; un mismo valor gobierna ambos. No sonido automático, no estrobos.
Emoción: anticipación, energía y pertenencia.
Verbo: abrir y amplificar. El mismo movimiento aparece en flechas, flyers y selección de pase.
Captura: BERING BOU monumental a la izquierda y las dos B iluminadas a la derecha.
Layout: pares desiguales y dos carriles, unidos por una línea central. Tipo: Big Shoulders Display y Host Grotesk. Paleta: negro de sala, blanco de luz, amarillo de señal y rosa de iluminación.

### B. Huaycán de noche
Idea: la web recorre la avenida y sube al local, del plan al encuentro.
Firma: una ruta vertical une cartel, reserva y destino.
Emoción: cercanía y descubrimiento. Captura: tipografía monumental HUAYCÁN sobre una ruta amarilla. Layout: columna de recorrido con paradas. Movimiento: avanzar y subir. Paleta: negro, blanco, amarillo vial y rojo. Ancla: dirección real. Evita inventar cartografía.

### C. En primera fila
Idea: la agenda se explora como canales de una consola.
Firma: seleccionar un canal amplifica su flyer sin ocultar los demás.
Emoción: control, curiosidad. Captura: tres canales verticales de distinta altura. Layout: tiras de consola. Movimiento: deslizar y amplificar. Paleta: negro, blanco, ámbar, cian. Ancla: entretenimiento musical, aunque su alta portabilidad reduce la nota.

## Sistema del elegido
ground #090909; ink #f3f0e8; muted #aaa9a3; line #353530; accent #f9e547; curtain #f9e547. Rosa #f491cd como luz decorativa secundaria, sin texto pequeño sobre rosa.
Big Shoulders Display 800 (Google Fonts, OFL) para titulares; Host Grotesk 400/600 (Google Fonts, OFL) para lectura. Autoalojadas woff2. Display fluido, tracking -0.035em, leading .9. Cuerpo 16–18 px, leading 1.55. Meta 12–14 px.
12 columnas escritorio / 4 móvil, margen 5vw con máximo de contenido 1440 px, gutter 24 px. Radio 8 px, controles pill solamente para botones y estados. Ritmos 64/96/144 px. Easing expo.out, .25s controles y .8s escenas. Un reloj GSAP, Lenis solamente en escritorio sin reduced-motion. Sin loader, WebGL, cursor personalizado ni audio automático. Contenido visible antes de JS. Movimiento conceptual pausado fuera de pantalla; reduced-motion estático.

## Composición
Hero:      [ marca 7 col ][ doble B 5 col ] / [acciones][lugar]
Agenda:    [título][estado] / [flyer 5][fecha + invitado 7]
Reservas:  [frase 5][formulario 7]
Barra:     [flyer viernes 4][texto 5][nota 3] + cumpleaños desplegable
Galería:   [archivo 7][zona fotografía/video 5] con fuentes y estados claros
Entradas:  [pase 5][propuesta futura 7]
Ubicación: [HUAYCÁN 7][dirección 5] / footer tipográfico
Móvil: una columna con arcos B detrás de la marca, flyer completo antes del texto, reserva persistente al pie con espacio reservado y safe area.

Genericness test: se descartaron gradientes azul-violeta, tarjetas de beneficios iguales y un falso video de público. La doble B, el lenguaje peruano moderado y la referencia explícita a Huaycán llevan la identidad. La atmósfera heredada de la web es conceptual y está rotulada; no es fotografía documental.

## Contenido y límites
Fuentes: https://www.beringbou.com/ (HTML descargado el 16/11/2026) y consulta editorial pública del conector Bering Bou.
El HTML actual anuncia ERROR como TikToker invitado el 21/11/2026. No se le atribuye rol de DJ o músico. La versión cacheada del buscador conserva Kike Mouse del 7/11: no se usa como próximo.
Flyers oficiales: ERROR, Viernes Chelero, cumpleaños, Halloween 31/10/2026. Este último es histórico, con precios caducados visibles en el original, acompañado siempre de aviso.
No se encontró una galería documental ni videos originales accesibles en el sitio consultado. Los estados de foto/video se muestran como pendientes y no se sustituyen por imágenes de otra discoteca. La atmósfera es un recurso conceptual existente, no un registro del establecimiento.
Los precios impresos en flyers son los de los originales; vigencia y condiciones deben confirmarse con el local. La carta de bebidas y precios no está verificada: no se inventa.
WhatsApp oficial enlazado por el HTML: +51 930 776 652. No se envían mensajes automáticamente. El formulario solo prepara un texto para que la persona lo envíe en WhatsApp; no almacena datos.
Dirección: Av. 15 de Julio, Zona A, Lote 29, segundo piso del Banco Confianza. La búsqueda de Maps es una referencia, no un pin verificado.
Entradas/VIP: maqueta interactiva sin venta, QR válido, disponibilidad ni reserva. Toda apariencia de pase está marcada DEMO.
Prueba privada: noindex y robots disallow deliberados; URL local en metadata. Activar indexación y dominio solo si se autoriza publicación.

## Criterios de revisión
Dos pasadas de producción. Verificar 390/768/1024/1440/1920, reduced-motion, teclado, contraste, hover, rutas, formularios y 404. /jury utiliza evidencias reales y un crítico separado sin acceso al código o esta intención. Registrar límites medidos sin elevar notas artificialmente.

## Revisión 1 y pulido
El primer reporte midió LCP móvil de 6.72 s por el fondo conceptual. Se eliminó esa descarga en móvil, conservando las dos B vectoriales. Se corrigió el nombre accesible del logo, el feedback de logo y enlaces de regreso, el alto reservado de flyers verticales, y se convirtió el material JPG a WebP. Se añadió una etiqueta visible sobre el flyer histórico. El enlace de salto es el primer Tab y tiene foco visible; la heurística inglesa del script da un falso negativo porque serializa solo el texto español, sin href. Se mantiene el texto de usuario natural. Se retiró el asterisco de la portada como accesorio más débil. Las páginas interiores permanecen quietas al reposo deliberadamente para dar prioridad a la lectura; los cambios de estado y navegación sí responden al mismo verbo. La composición principal conserva su doble B en movimiento solo cuando es visible.

## Actualización con material del propietario, 16/11/2026
Se sustituyeron los estados vacíos por tres fotografías del ZIP Photos-1-001.zip y un clip real de ambiente de aproximadamente siete segundos. No se identifican personas ni se atribuye una fecha al registro. Se excluye el video identificado como generado. La portada sigue usando la composición vectorial para cuidar la carga móvil. El material web seleccionado y su procedencia constan en docs/MEDIA.md. La evaluación de 7.54/10 se conserva como revisión anterior a este material, sin atribuirle una nota nueva.
