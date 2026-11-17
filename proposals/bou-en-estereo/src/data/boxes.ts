// Commercial authorization: owner confirmed Halloween box tariffs for ERROR on 2026-11-21.
// No weekday automatically becomes a strong date. Add only owner-confirmed dates here.
export const strongDates: Readonly<Record<string,{title:string}>> = Object.freeze({
 '2026-11-21': {title:'ERROR · TikToker invitado'},
});
export const boxPackages = {
 black:{name:'Box Black',price:320,bottle:'Black Label'},
 red:{name:'Box Red',price:270,bottle:'Red Label'},
} as const;
export function boxKind(id:number):'black'|'red'{
 if(!Number.isInteger(id)||id<1||id>10)throw new RangeError('Box inexistente');
 return [1,2,6,7].includes(id)?'black':'red';
}
export function validBoxDate(value:string,today:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<today)return false;
 const date=new Date(value+'T12:00:00Z');
 return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
export function boxOffer(date:string,id:number){
 const kind=boxKind(id),pkg=boxPackages[kind],strong=strongDates[date];
 return {kind,name:pkg.name,price:strong?pkg.price:null,bottle:strong?pkg.bottle:null,event:strong?.title??null};
}
export function boxMessage(date:string,id:number){
 const offer=boxOffer(date,id);
 const tariff=offer.price===null?'Precios a consultar':`Tarifa publicada: S/${offer.price}`;
 return `Hola Bering Bou, quiero separar el box ${String(id).padStart(2,'0')} (${offer.name}) para el ${date}. ${offer.event?offer.event+'. ':''}${tariff}. ¿Me confirman disponibilidad, capacidad y condiciones para reservar?`;
}
