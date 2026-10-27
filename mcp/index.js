// Bering Bou MCP: prueba de conectividad sin datos privados ni acciones de escritura.
// Streamable HTTP, JSON-RPC 2.0. OAuth obligatorio antes de agregar herramientas privadas.
const tool={name:"get_brand_context",description:"Devuelve información editorial pública de Bering Bou para preparar borradores; no programa ni publica.",annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},inputSchema:{type:"object",properties:{},additionalProperties:false}};
const templateTool={name:"get_campaign_template",description:"Obtiene una plantilla editorial pública para crear una campaña con IA; no consulta datos privados ni publica.",annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},inputSchema:{type:"object",properties:{campaign:{type:"string",enum:["viernes_chelero","cumpleanos","evento_general"]}},required:["campaign"],additionalProperties:false}};
const ok=(id,result)=>({jsonrpc:"2.0",id,result});
const err=(id,code,message)=>({jsonrpc:"2.0",id,error:{code,message}});
function response(obj,status=200){return new Response(JSON.stringify(obj),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","access-control-allow-origin":"*","access-control-allow-headers":"content-type,accept,mcp-protocol-version,mcp-session-id","access-control-allow-methods":"POST,GET,OPTIONS"}})}
export default {async fetch(request){
 const url=new URL(request.url);
 if(url.pathname==="/")return response({service:"Bering Bou MCP",endpoint:"/mcp",mode:"read-only connectivity test"});
 if(url.pathname!=="/mcp")return response({error:"Not found"},404);
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{"access-control-allow-origin":"*","access-control-allow-methods":"POST,GET,OPTIONS","access-control-allow-headers":"content-type,accept,mcp-protocol-version,mcp-session-id"}});
 if(request.method==="GET")return new Response(null,{status:405,headers:{Allow:"POST, OPTIONS"}});
 if(request.method!=="POST")return response({error:"Method not allowed"},405);
 let p;try{p=await request.json()}catch{return response(err(null,-32700,"Parse error"),400)}
 if(!p||p.jsonrpc!=="2.0"||typeof p.method!=="string")return response(err(p?.id??null,-32600,"Invalid request"),400);
 if(!Object.prototype.hasOwnProperty.call(p,"id"))return new Response(null,{status:202});
 const id=p.id;
 if(p.method==="initialize")return response(ok(id,{protocolVersion:"2025-06-18",capabilities:{tools:{listChanged:false}},serverInfo:{name:"beringbou-mcp",version:"0.1.0"}}));
 if(p.method==="ping")return response(ok(id,{}));
 if(p.method==="tools/list")return response(ok(id,{tools:[tool,templateTool]}));
 if(p.method==="tools/call"){
  if(p.params?.name==="get_campaign_template"){
   const key=p.params?.arguments?.campaign;
   const templates={
     viernes_chelero:{name:"Viernes Chelero",source:"Contexto editorial de pruebas",verified_offer:"2 Pilsen por S/15 hasta medianoche (verificar vigencia antes de publicar)",formats:["feed 1:1","story 9:16","video vertical 9:16"],tone:"Capcioso, directo, peruano",required_approval:["Fecha efectiva","Promoción vigente","Condiciones","Flyer final"]},
     cumpleanos:{name:"Cumpleaños",formats:["feed 1:1","story 9:16"],tone:"Festivo, local",required_approval:["Nombre","Fecha","Foto autorizada","Promociones vigentes"]},
     evento_general:{name:"Evento",formats:["feed 1:1","story 9:16","video vertical"],tone:"Energético, coloquial",required_approval:["Artistas confirmados","Fecha","Dirección","Precio","Flyers"]},
   };
   if(typeof key!=="string"||!templates[key])return response(err(id,-32602,"Invalid campaign"));
   return response(ok(id,{content:[{type:"text",text:JSON.stringify({template:templates[key],publication_status:"Not scheduled",generation_status:"Template only"})}]}));
  }
  if(p.params?.name!=="get_brand_context")return response(err(id,-32602,"Unknown tool"));
  const context={name:"Bering Bou",location:"Huaycán, Lima, Perú",tone:"Alegre, capcioso y coloquial peruano",brand_guidelines:"No inventar promociones, fechas, precios ni disponibilidad. Mostrar propuesta al usuario antes de solicitar programación.",integration_status:"Solo consulta editorial pública. Sin acceso a Supabase ni programación de redes."};
  return response(ok(id,{content:[{type:"text",text:JSON.stringify(context)}],isError:false}));
 }
 return response(err(id,-32601,"Method not found"));
}};
