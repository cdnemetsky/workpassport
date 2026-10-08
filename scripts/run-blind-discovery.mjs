import {readFile} from 'node:fs/promises';
import {DISCOVERY_PROMPT} from '../supabase/functions/discover-abilities/prompt.mjs';
import {validateFindings} from '../supabase/functions/discover-abilities/validation.mjs';

const apiKey=process.env.OPENAI_API_KEY;
if(!apiKey) throw new Error('OPENAI_API_KEY is required; no blind model run was performed.');
const model=process.env.OPENAI_MODEL||'gpt-4.1-mini';
const participants=JSON.parse(await readFile(new URL('../tests/blind-discovery-inputs.json',import.meta.url),'utf8'));
const results=[];
for(const participant of participants){
 const activities=[];
 for(const activity of participant.activities){
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,temperature:0.2,max_tokens:2500,response_format:{type:'json_object'},messages:[{role:'system',content:DISCOVERY_PROMPT},{role:'user',content:JSON.stringify({sample:activity.sample,context:activity.context})}]})});
  if(!response.ok) throw new Error(`Provider returned ${response.status} for ${activity.id}`);
  const completion=await response.json();
  activities.push({activity_id:activity.id,findings:validateFindings(JSON.parse(completion.choices[0].message.content),activity.sample)});
 }
 results.push({participant_id:participant.participant_id,known_self_description:participant.known_self_description,activities});
}
console.log(JSON.stringify({protocol:'blind-discovery-v3',model,generated_at:new Date().toISOString(),results},null,2));
