import {createClient} from 'npm:@supabase/supabase-js@2.95.3';
const cors={'Access-Control-Allow-Origin':'https://cdnemetsky.github.io','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return reply(405,{error:'Use POST'});
 try{
  const {token}=await req.json();
  if(typeof token!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token))return reply(404,{error:'Shared Passport unavailable'});
  // Public capability endpoint: the unguessable share token is the authorization credential.
  const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  const {data:share,error}=await admin.from('passport_shares').select('user_id,assessment_ids,expires_at').eq('token',token).is('revoked_at',null).gt('expires_at',new Date().toISOString()).single();
  if(error||!share)return reply(404,{error:'This share has expired, was revoked, or does not exist.'});
  const {data:items,error:itemsError}=await admin.from('ability_assessments').select('id,findings,created_at').eq('user_id',share.user_id).eq('review_status','approved').in('id',share.assessment_ids);
  if(itemsError)return reply(500,{error:'Shared Passport unavailable'});
  // Never return original sample bodies, account email, context, or any unselected assessment.
  return reply(200,{assessments:items||[],expires_at:share.expires_at});
 }catch{return reply(400,{error:'Shared Passport unavailable'});}
});
