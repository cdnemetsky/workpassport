import test from 'node:test';
import assert from 'node:assert/strict';
import {validateFindings} from '../supabase/functions/discover-abilities/validation.mjs';
const source='I compared three failed runs and added a validation check.';
const finding={name:'Problem solving',observation:'Compared failed runs',quote:'compared three failed runs',rationale:'Systematic comparison',uncertainty:'Authorship is not established',next_evidence:'An independently attributable example',confidence:'tentative'};
test('only exact source quotations are accepted',()=>{assert.equal(validateFindings({abilities:[finding],limitations:'Single sample'},source).abilities.length,1);assert.throws(()=>validateFindings({abilities:[{...finding,quote:'Led a successful team'}],limitations:'Single sample'},source));});
test('inadequate evidence can produce no abilities',()=>assert.deepEqual(validateFindings({abilities:[],limitations:'Insufficient evidence'},source).abilities,[]));
test('unvalidated numeric confidence and excessive findings are rejected',()=>{assert.throws(()=>validateFindings({abilities:[{...finding,confidence:'99%'}],limitations:'Single sample'},source));assert.throws(()=>validateFindings({abilities:Array(6).fill(finding),limitations:'Single sample'},source));});
test('unexpected model fields cannot grant verification',()=>{const result=validateFindings({abilities:[{...finding,verified:true}],limitations:'Single sample'},source);assert.equal('verified' in result.abilities[0],false);});
