// Bering Bou MCP: prueba de conectividad sin datos privados ni acciones de escritura.
// Streamable HTTP, JSON-RPC 2.0. OAuth obligatorio antes de agregar herramientas privadas.
const tool={name:"get_brand_context",description:"Devuelve información editorial pública de Bering Bou para preparar borradores; no programa ni publica.",annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},inputSchema:{type:"object",properties:{},additionalProperties:false}};
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
 if(p.method==="tools/list")return response(ok(id,{tools:[tool]}));
 if(p.method==="tools/call"){
  if(p.params?.name!=="get_brand_context")return response(err(id,-32602,"Unknown tool"));
  const context={name:"Bering Bou",location:"Huaycán, Lima, Perú",tone:"Alegre, capcioso y coloquial peruano",brand_guidelines:"No inventar promociones, fechas, precios ni disponibilidad. Mostrar propuesta al usuario antes de solicitar programación.",integration_status:"Solo consulta editorial pública. Sin acceso a Supabase ni programación de redes."};
  return response(ok(id,{content:[{type:"text",text:JSON.stringify(context)}],isError:false}));
 }
 return response(err(id,-32601,"Method not found"));
}};
