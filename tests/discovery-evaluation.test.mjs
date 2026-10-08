import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateFindings} from '../supabase/functions/discover-abilities/validation.mjs';

const cases=JSON.parse(await readFile(new URL('./discovery-evaluation-cases.json',import.meta.url),'utf8'));

for(const example of cases){
 test(`${example.id}: candidate discoveries are evidence-linked, calibrated and non-obvious`,()=>{
  const validated=validateFindings(example.candidate,example.activity);
  assert.ok(validated.abilities.length>0);
  const known=new Set(example.known_strengths.map(value=>value.toLowerCase()));
  const rejected=new Set(example.rejected_guesses.map(value=>value.toLowerCase()));
  for(const finding of validated.abilities){
   assert.ok(example.activity.includes(finding.quote),'quote must be exact evidence');
   assert.equal(known.has(finding.name.toLowerCase()),false,'finding should add more than a known self-description');
   assert.equal(rejected.has(finding.name.toLowerCase()),false,'unsupported attractive guess must not be promoted');
   assert.match(finding.uncertainty,/one|single|self-reported|does not|cannot|not /i);
   assert.ok(finding.next_evidence.length>20);
  }
 });
}

test('evaluation set contains both ingenuity and subtle-behavior cases',()=>{
 const categories=new Set(cases.flatMap(example=>example.candidate.abilities.map(finding=>finding.category)));
 assert.deepEqual([...categories].sort(),['ability','demonstrated_quality']);
});
