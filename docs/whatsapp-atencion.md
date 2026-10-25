# Atención de Bering Bou por WhatsApp

## Estado real

La web incluye accesos al 930776652 publicado en el flyer. El visitante encuentra un mensaje preparado y debe enviarlo personalmente. Esto no configura la cuenta de WhatsApp, no permite leer chats ni activa respuestas automáticas. Pages conserva modo demostración: no guarda métricas ni formularios. Para la prueba completa falta publicar el build funcional en el alojamiento elegido y verificar Supabase desde ese origen.

## Configuración gratuita en la app WhatsApp Business

En Herramientas para la empresa, configurar mensaje de bienvenida, ausencia y respuestas rápidas. Verificar el horario real antes de programar la ausencia. Las respuestas rápidas requieren intervención humana: no son un bot que interpreta números.

### Bienvenida

¡Hola! Bienvenido a Bering Bou Huaycán 🎉 ¿Buscas información de Viernes Chelero, celebrar tu cumpleaños o un evento? Cuéntanos qué te interesa y para qué fecha. Puedes ver nuestras promociones en https://azaerodiego.github.io/beringbou/

### Ausencia

¡Gracias por escribir a Bering Bou! Ahora no estamos atendiendo el chat. Déjanos el motivo de tu consulta, la fecha y cuántas personas vendrían. Te responderemos al retomar la atención. Tu mensaje todavía no confirma una reserva.

### /viernes

🍻 Viernes Chelero: 2 Pilsen por S/15 hasta medianoche. ¿Para qué viernes quieres venir? Te confirmamos las condiciones de la promoción. Solo mayores de 18 años con DNI. Consumo responsable.

### /cumple

🎂 ¡Celebremos tu cumpleaños! Tenemos copa de margarita por tu asistencia, botella de whisky con grupo mínimo de 10 personas y promoción de box cumpleañero + torta. Cuéntanos fecha y cantidad de personas para confirmar disponibilidad y las condiciones exactas de cada beneficio. Esta consulta no separa un box.

### /halloween

🎃 Halloween con El Chombo: sábado 31 de octubre de 2026. General S/15 y VIP S/30. Box Red S/270 o Black S/320; incluyen botella según paquete, 2 guaranás, hielo ilimitado y 4 pulseras VIP. ¿Buscas entradas o un box? La disponibilidad se confirma al atenderte. Solo mayores de 18 años con DNI.

### /ubicacion

📍 Av. 15 de Julio, Zona A, lote 29, Huaycán. Segundo piso del Banco Confianza.

### /reserva

Para revisar tu solicitud necesitamos fecha, cantidad de personas y box o promoción que te interesa. Todavía no está confirmada. Te indicaremos disponibilidad y condiciones antes de pedir cualquier adelanto.

## Organización

Etiquetas sugeridas: Nuevo, Pendiente de respuesta, Falta información, Por confirmar, Confirmado, No concretó. Definir una persona responsable por turno. No prometer una reserva confirmada ni un plazo de respuesta que no puedan cumplir.

## Prueba de dos fines de semana

Enlaces sugeridos (el formulario y la medición requieren primero un despliegue funcional):
- Facebook: ?utm_source=facebook&utm_campaign=prueba_bering
- Instagram: ?utm_source=instagram&utm_campaign=prueba_bering
- WhatsApp: ?utm_source=whatsapp&utm_campaign=prueba_bering

Comparar sesiones con consentimiento, clics a WhatsApp, solicitudes, reservas confirmadas y asistentes. Un clic no prueba que el mensaje se haya enviado. La web no puede medir respuestas ni cierre de ventas dentro de la app sin integración adicional. La medición con consentimiento no representa a todos los visitantes.

## Automatización posterior con n8n

Usar la integración oficial WhatsApp Business Cloud con sus credenciales de Meta. Antes de conectar el número actual, revisar elegibilidad para coexistencia con la app y conservar su operación. No migrar ni desconectar el número sin revisar el impacto. No guardar tokens en GitHub, HTML ni capturas.

Flujo propuesto: mensaje recibido → comprobar duplicados por ID → clasificar consulta → responder información vigente → derivar a una persona cuando haya reserva, precio no definido o petición de asesor → registrar estado y tiempo de atención. Pausar respuestas automáticas durante atención humana. Evitar que un reintento genere múltiples respuestas. No iniciar campañas a contactos por haber consultado.

n8n Community no cobra licencia, pero necesita servidor disponible. n8n Cloud es un servicio de pago. WhatsApp API tiene sus propias tarifas, ventanas y plantillas; verificar la tarifa vigente de la cuenta de Perú antes de activar. No asumir gratuidad ilimitada: hay cambios de precios de Meta vigentes desde octubre de 2026.

Fuentes: https://whatsappbusiness.com/products/business-app-features/ ; https://docs.n8n.io/integrations/builtin/credentials/whatsapp/ ; https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
