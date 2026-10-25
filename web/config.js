// Solo URL y clave PUBLICABLE (o anon). Nunca service_role ni claves sb_secret_.
export const config = Object.freeze({
  demo: false,
  supabaseUrl: 'https://gowitycgqmywvtxzdrdu.supabase.co',
  supabasePublishableKey: 'sb_publishable_IyMjiDWoOVdjiwjwTNDIJA_4kB5JfK2',
  whatsapp: '51930776652', // Número comercial publicado en el flyer.
  event: {
    slug: 'halloween-2026', date: '2026-10-31',
    title: 'Los cuentos de la cripta', artist: 'El Chombo',
    generalPrice: 15, vipPrice: 30,
    packages: {
      red: { name: 'Box Red', price: 270, bottle: 'Red Label' },
      black: { name: 'Box Black', price: 320, bottle: 'Black Label' }
    }
  }
});
