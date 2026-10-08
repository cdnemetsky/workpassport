import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPulse} from '../assets/pulse.mjs';

const samples=[{id:'s1',title:'First activity'},{id:'s2',title:'Second activity'}];
const finding=(name,category='ability')=>({name,category});
const assessments=[
 {id:'a2',sample_id:'s2',created_at:'2026-10-08T12:00:00Z',review_status:'approved',findings:{abilities:[finding('Problem solving'),finding('Careful communication','demonstrated_quality')]}},
 {id:'a1',sample_id:'s1',created_at:'2026-10-07T12:00:00Z',review_status:'approved',findings:{abilities:[finding('Problem solving')]}},
 {id:'a0',sample_id:'s1',created_at:'2026-10-06T12:00:00Z',review_status:'disputed',findings:{abilities:[finding('Leadership')]}},
];

test('pulse counts activities, assessments and only approved discoveries',()=>{
 const pulse=buildPulse(samples,assessments);
 assert.deepEqual(pulse.summary,{activities:2,assessments:3,approved_discoveries:3});
});

test('pulse treats recurrence across distinct activities as a developing pattern',()=>{
 const pulse=buildPulse(samples,assessments);
 assert.deepEqual(pulse.patterns.map(p=>[p.name,p.sample_count]),[['Problem solving',2],['Careful communication',1]]);
 assert.equal(pulse.patterns.some(p=>p.name==='Leadership'),false);
});

test('timeline preserves disputed assessments without presenting them as approved patterns',()=>{
 const pulse=buildPulse(samples,assessments);
 assert.equal(pulse.timeline.length,3);
 assert.equal(pulse.timeline.at(-1).review_status,'disputed');
 assert.equal(pulse.timeline[0].title,'Second activity');
});
