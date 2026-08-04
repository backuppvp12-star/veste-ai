export default async (request) => {
  if (request.method !== 'POST') return new Response(JSON.stringify({error:'Método não permitido'}),{status:405});
  try {
    const {image}=await request.json();
    if(!image) return new Response(JSON.stringify({error:'Imagem ausente'}),{status:400});
    const key=process.env.GEMINI_API_KEY; const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
    if(!key) return new Response(JSON.stringify({error:'GEMINI_API_KEY não configurada'}),{status:500});
    const [meta,data]=image.split(','); const mime=(meta.match(/data:(.*?);/)||[])[1]||'image/jpeg';
    const prompt='Analise esta peça de roupa. Responda SOMENTE JSON válido com: name (nome curto em pt-BR), category (uma de: Parte de cima, Parte de baixo, Vestido, Calçado, Roupa externa, Acessório), color (cor principal), style (array com 1 a 3 estilos entre Casual, Minimalista, Clássico, Old Money, Romântico, Streetwear).';
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt},{inline_data:{mime_type:mime,data}}]}],generationConfig:{responseMimeType:'application/json'}})});
    const j=await r.json(); if(!r.ok) throw new Error(j?.error?.message||'Falha no Gemini');
    const text=j?.candidates?.[0]?.content?.parts?.[0]?.text||'{}';
    return new Response(text,{headers:{'content-type':'application/json; charset=utf-8'}});
  } catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'content-type':'application/json'}})}
};
