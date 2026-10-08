export function validateFindings(result, source) {
 if(!result || !Array.isArray(result.abilities) || result.abilities.length>5) throw new Error('Invalid assessment structure');
 const abilities=result.abilities.map(a=>{
  for(const key of ['name','observation','quote','rationale','uncertainty','next_evidence'])
   if(typeof a[key]!=='string'||!a[key].trim()||a[key].length>2000) throw new Error('Incomplete assessment');
  if(!source.includes(a.quote)) throw new Error('Assessment cited text outside the work sample');
  if(!['tentative','supported'].includes(a.confidence)) throw new Error('Invalid confidence');
  return Object.fromEntries(['name','observation','quote','rationale','uncertainty','next_evidence','confidence'].map(k=>[k,a[k]]));
 });
 if(typeof result.limitations!=='string'||result.limitations.length>3000) throw new Error('Missing limitations');
 return {abilities,limitations:result.limitations};
}
