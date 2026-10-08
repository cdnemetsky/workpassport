import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DISCOVERY_PROMPT} from '../supabase/functions/discover-abilities/prompt.mjs';

const participants=JSON.parse(await readFile(new URL('./blind-discovery-inputs.json',import.meta.url),'utf8'));

test('blind inputs contain ordinary activities but no target ability labels or expected answers',()=>{
 assert.ok(participants.length>=2);
 for(const participant of participants){
  assert.ok(participant.activities.length>=3);
  assert.deepEqual(Object.keys(participant).sort(),['activities','known_self_description','participant_id']);
  for(const activity of participant.activities){
   assert.deepEqual(Object.keys(activity).sort(),['context','id','sample']);
   assert.ok(activity.sample.length>=120);
  }
 }
});

test('production prompt explicitly performs blind discovery and permits no forced finding',()=>{
 assert.match(DISCOVERY_PROMPT,/No target abilities are supplied/i);
 assert.match(DISCOVERY_PROMPT,/zero if evidence is insufficient/i);
 assert.match(DISCOVERY_PROMPT,/adds something beyond the obvious/i);
 assert.doesNotMatch(DISCOVERY_PROMPT,/p01|p02|aisles|announcement/i);
});
