export default async (request) => {
  if(request.method!=='POST') return new Response(JSON.stringify({error:'Método não permitido'}),{status:405});
  try{
    const body=await request.json(); const key=process.env.GEMINI_API_KEY; const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
    if(!key) return new Response(JSON.stringify({error:'GEMINI_API_KEY não configurada'}),{status:500});
    const prompt=`Você é uma estilista brasileira. Monte um look usando SOMENTE nomes exatos das peças fornecidas. Ocasião: ${body.occasion}. Clima: ${body.weather}. Observações: ${body.note||'nenhuma'}. Peças: ${JSON.stringify(body.items)}. Responda SOMENTE JSON válido: {"title":"...","reason":"...","itemNames":["nome exato"],"tips":["...","..."]}`;
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json'}})});
    const j=await r.json(); if(!r.ok) throw new Error(j?.error?.message||'Falha no Gemini');
    const text=j?.candidates?.[0]?.content?.parts?.[0]?.text||'{}'; return new Response(text,{headers:{'content-type':'application/json; charset=utf-8'}});
  }catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'content-type':'application/json'}})}
};
