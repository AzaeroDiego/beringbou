const resourceUrl="https://beringbou-mcp-test.x202222552.workers.dev/mcp";
const issuerUrl="https://gowitycgqmywvtxzdrdu.supabase.co/auth/v1";
const resourceMetadata={resource:resourceUrl,authorization_servers:[issuerUrl],bearer_methods_supported:["header"]};
const authChallenge='Bearer resource_metadata="https://beringbou-mcp-test.x202222552.workers.dev/.well-known/oauth-protected-resource"';
// Bering Bou MCP: prueba de conectividad sin datos privados ni acciones de escritura.
// Streamable HTTP, JSON-RPC 2.0. OAuth obligatorio antes de agregar herramientas privadas.
const tool={name:"get_brand_context",description:"Devuelve información editorial pública de Bering Bou para preparar borradores; no programa ni publica.",annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},inputSchema:{type:"object",properties:{},additionalProperties:false}};
const templateTool={name:"get_campaign_template",description:"Obtiene una plantilla editorial pública para crear una campaña con IA; no consulta datos privados ni publica.",annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},inputSchema:{type:"object",properties:{campaign:{type:"string",enum:["viernes_chelero","cumpleanos","evento_general"]}},required:["campaign"],additionalProperties:false}};
const draftTestTool={name:"create_test_draft",description:"PRUEBA DE ESCRITURA SIMULADA: construye un borrador ficticio en memoria y lo devuelve. No guarda archivos, no modifica Supabase y no publica.",annotations:{readOnlyHint:false,destructiveHint:false,openWorldHint:false,idempotentHint:true},inputSchema:{type:"object",properties:{title:{type:"string",maxLength:100},test_marker:{type:"string",maxLength:80}},required:["title","test_marker"],additionalProperties:false}};
const savedDraftTool={name:"create_campaign_draft",description:"Guarda un borrador real en Supabase SOLO con autorización de administrador; nunca publica. Requiere Bearer JWT de sesión Supabase, verificado por Supabase Auth.",annotations:{readOnlyHint:false,destructiveHint:false,openWorldHint:false},inputSchema:{type:"object",properties:{title:{type:"string",maxLength:120},brief:{type:"string",maxLength:2000},test_marker:{type:"string",maxLength:80}},required:["title"],additionalProperties:false}};
const ok=(id,result)=>({jsonrpc:"2.0",id,result});
const err=(id,code,message)=>({jsonrpc:"2.0",id,error:{code,message}});
function response(obj,status=200){return new Response(JSON.stringify(obj),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","access-control-allow-origin":"*","access-control-allow-headers":"content-type,accept,mcp-protocol-version,mcp-session-id","access-control-allow-methods":"POST,GET,OPTIONS"}})}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==="/.well-known/oauth-protected-resource"||url.pathname==="/.well-known/oauth-protected-resource/mcp")return response(resourceMetadata);
 if(url.pathname==="/oauth/consent"&&!url.searchParams.has("authorization_id"))return new Response('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bering Bou OAuth</title><body style="background:#111827;color:white;font:16px system-ui;max-width:580px;margin:12vh auto;padding:24px"><h1>Autorizar Bering Bou</h1><p>Esta página funciona. No hay una solicitud de autorización activa.</p><p>Para continuar, el acceso debe comenzar desde ChatGPT mediante OAuth. No introduzcas tus credenciales aquí.</p></body></html>',{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
 if(url.pathname==="/oauth/consent")return new Response("<!doctype html><html lang=\"es\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Bering Bou — Autorizar</title><style>body{font:16px system-ui;background:#111827;color:#fff;max-width:440px;margin:9vh auto;padding:22px}input,button{display:block;box-sizing:border-box;width:100%;padding:12px;margin:12px 0}button{cursor:pointer}small{color:#ddd}</style><h2>Autorizar Bering Bou</h2><p id=\"status\">Comprobando solicitud…</p><form id=\"login\" hidden><label>Correo<input type=\"email\" name=\"email\" autocomplete=\"username\" required></label><label>Contraseña<input type=\"password\" name=\"password\" autocomplete=\"current-password\" required></label><button>Iniciar sesión</button></form><section id=\"approval\" hidden><p id=\"client\"></p><p id=\"scopes\"></p><button id=\"approve\">Autorizar</button><button id=\"deny\">Rechazar</button></section><p id=\"error\" role=\"alert\"></p><small>Autoriza únicamente clientes que reconozcas. No compartas contraseñas en ChatGPT.</small><script type=\"module\" src=\"/oauth/consent.js\"></script></html>",{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","content-security-policy":"default-src 'none'; script-src 'self' https://esm.sh; connect-src https://gowitycgqmywvtxzdrdu.supabase.co; style-src 'unsafe-inline'; base-uri 'none'; form-action 'self'"}});
 if(url.pathname==="/oauth/consent.js"){if(!env?.SUPABASE_PUBLISHABLE_KEY)return response({error:"Missing publishable key"},503);return new Response("window.__PUBLIC_KEY__="+JSON.stringify(env.SUPABASE_PUBLISHABLE_KEY)+";\n"+"let createClient;try{({createClient}=await import(\"https://esm.sh/@supabase/supabase-js@2.57.0\"));}catch(e){document.getElementById(\"status\").textContent=\"No se pudo cargar el módulo de Supabase.\";document.getElementById(\"error\").textContent=String(e);throw e;}\nconst api=\"https://gowitycgqmywvtxzdrdu.supabase.co\";const supabase=createClient(api,window.__PUBLIC_KEY__,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});\ndocument.getElementById(\"status\").textContent=\"Módulo cargado. Verificando sesión…\";\nconst id=new URL(location.href).searchParams.get(\"authorization_id\"), el=(x)=>document.getElementById(x),error=(e)=>el(\"error\").textContent=e?.message||String(e);\nasync function start(){if(!id){error(\"Falta authorization_id\");return}const {data:{user}}=await supabase.auth.getUser();if(!user){el(\"status\").textContent=\"Inicia sesión con la cuenta administradora de Bering Bou\";el(\"login\").hidden=false;return}const {data,error:err}=await supabase.auth.oauth.getAuthorizationDetails(id);if(err)return error(err);if(!(\"authorization_id\" in data)){location.assign(data.redirect_url);return}el(\"status\").textContent=\"Revisa los permisos de la aplicación\";el(\"client\").textContent=\"Cliente: \"+(data.client?.name||data.client?.client_name||\"Sin nombre\");el(\"scopes\").textContent=\"Permisos: \"+(data.scope||\"No especificados\");el(\"approval\").hidden=false;}\nel(\"login\").onsubmit=async(e)=>{e.preventDefault();const f=new FormData(e.target);const {error:err}=await supabase.auth.signInWithPassword({email:String(f.get(\"email\")),password:String(f.get(\"password\"))});if(err)error(err);else{el(\"login\").hidden=true;start()}};async function decide(yes){const{data,error:err}=yes?await supabase.auth.oauth.approveAuthorization(id):await supabase.auth.oauth.denyAuthorization(id);if(err)error(err);else if(data?.redirect_url)location.assign(data.redirect_url)}el(\"approve\").onclick=()=>decide(true);el(\"deny\").onclick=()=>decide(false);start().catch(e=>{document.getElementById(\"status\").textContent=\"No se pudo verificar la solicitud.\";error(e)});",{headers:{"content-type":"application/javascript; charset=utf-8","cache-control":"no-store","access-control-allow-origin":"*"}})}
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
 if(p.method==="tools/list")return response(ok(id,{tools:[tool,templateTool,draftTestTool,savedDraftTool]}));
 if(p.method==="tools/call"){
  if(p.params?.name==="create_campaign_draft"){
   const token=(request.headers.get("authorization")||"").match(/^Bearer\s+([^\s]+)$/i)?.[1];
   if(!token){const rejected=response(err(id,-32001,"OAuth sign-in required"),401);rejected.headers.set("WWW-Authenticate",authChallenge);return rejected;}
   if(!env?.SUPABASE_PUBLISHABLE_KEY)return response(err(id,-32000,"Server not configured for authenticated writes"),503);
   const args=p.params?.arguments||{};
   if(typeof args.title!=="string"||!args.title.trim()||args.title.length>120||typeof(args.brief??"")!=="string"||(args.brief??"").length>2000||typeof(args.test_marker??"")!=="string"||(args.test_marker??"").length>80)return response(err(id,-32602,"Invalid campaign arguments"));
   const base="https://gowitycgqmywvtxzdrdu.supabase.co";
   const headers={"apikey":env.SUPABASE_PUBLISHABLE_KEY,"authorization":"Bearer "+token};
   const identity=await fetch(base+"/auth/v1/user",{headers});
   if(!identity.ok)return response(err(id,-32001,"Invalid or expired Supabase session"),401);
   const save=await fetch(base+"/rest/v1/rpc/bering_create_campaign_draft",{method:"POST",headers:{...headers,"content-type":"application/json"},body:JSON.stringify({p_title:args.title,p_brief:args.brief??"",p_marker:args.test_marker??""})});
   if(!save.ok)return response(err(id,-32003,save.status===403?"Administrator access required":"Draft save rejected"),save.status===403?403:400);
   const campaignId=await save.json();
   return response(ok(id,{content:[{type:"text",text:JSON.stringify({id:campaignId,status:"draft",persisted:true,published:false})}],isError:false}));
  }
  if(p.params?.name==="create_test_draft"){
   const a=p.params?.arguments??{};
   if(typeof a.title!=="string"||typeof a.test_marker!=="string"||!a.title.trim()||!a.test_marker.trim()||a.title.length>100||a.test_marker.length>80)return response(err(id,-32602,"Invalid test arguments"));
   const result={title:a.title,test_marker:a.test_marker,status:"SIMULATED_ONLY",persisted:false,published:false,warning:"No changes to database, files or social networks. This probes availability of a tool declared as non-read-only."};
   return response(ok(id,{content:[{type:"text",text:JSON.stringify(result)}],isError:false}));
  }
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
