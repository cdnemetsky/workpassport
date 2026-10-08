import {createClient} from 'npm:@supabase/supabase-js@2.95.3';
import {validateFindings} from './validation.mjs';
import {DISCOVERY_PROMPT} from './prompt.mjs';
const cors={'Access-Control-Allow-Origin':'https://cdnemetsky.github.io','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
 if(req.method!=='POST') return reply(405,{error:'Use POST'});
 try{
  const authorization=req.headers.get('Authorization')||'';
  if(!authorization.startsWith('Bearer ')) return reply(401,{error:'Sign in to assess work'});
  const userClient=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!,{global:{headers:{Authorization:authorization}},auth:{persistSession:false}});
  const {data:{user},error:authError}=await userClient.auth.getUser(authorization.slice(7));
  if(authError||!user) return reply(401,{error:'Your session expired. Sign in again.'});
  const body=await req.json();
  if(typeof body.sample_id!=='string'||!/^[0-9a-f-]{36}$/i.test(body.sample_id)) return reply(400,{error:'Select a saved sample'});
  const {data:sample,error}=await userClient.from('work_samples').select('*').eq('id',body.sample_id).eq('user_id',user.id).single();
  if(error||!sample) return reply(404,{error:'Sample not found'});
  const apiKey=Deno.env.get('OPENAI_API_KEY');
  if(!apiKey) return reply(503,{error:'AI assessment is not connected yet. Your private sample is saved; no abilities have been invented.'});
  const {count,error:countError}=await userClient.from('ability_assessments').select('id',{count:'exact',head:true}).gte('created_at',new Date(Date.now()-86400000).toISOString());
  if(countError) return reply(500,{error:'Could not check assessment limit'});
  if((count||0)>=10) return reply(429,{error:'Daily assessment limit reached. Try tomorrow.'});
  const model=Deno.env.get('OPENAI_MODEL')||'gpt-4.1-mini';
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',signal:AbortSignal.timeout(45000),headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,temperature:0.2,max_tokens:2500,response_format:{type:'json_object'},messages:[{role:'system',content:DISCOVERY_PROMPT},{role:'user',content:JSON.stringify({sample:sample.content,context:sample.context})}]})});
  if(!response.ok) return reply(502,{error:'AI provider could not complete the assessment. Your sample is still saved.'});
  const completion=await response.json();
  const findings=validateFindings(JSON.parse(completion.choices[0].message.content),sample.content);
  const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  // The service writes only a sample verified above to belong to the authenticated user.
  const {data:assessment,error:saveError}=await admin.from('ability_assessments').insert({user_id:user.id,sample_id:sample.id,findings,model,prompt_version:'blind-discovery-v3'}).select('id').single();
  if(saveError) return reply(500,{error:'Assessment could not be saved. Try again.'});
  return reply(200,{assessment_id:assessment.id});
 }catch{ return reply(500,{error:'Assessment could not be completed safely. No unsupported findings were saved.'}); }
});
