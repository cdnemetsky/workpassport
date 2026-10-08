export function buildPulse(samples, assessments) {
  const sampleById = new Map(samples.map(sample => [sample.id, sample]));
  const approved = assessments.filter(assessment => assessment.review_status === 'approved');
  const approvedFindings = approved.flatMap(assessment =>
    (assessment.findings?.abilities || []).map(finding => ({assessment, finding}))
  );
  const patternMap = new Map();
  for (const {assessment, finding} of approvedFindings) {
    if (!finding?.name?.trim()) continue;
    const key = finding.name.trim().toLowerCase();
    const pattern = patternMap.get(key) || {
      name: finding.name.trim(),
      category: finding.category === 'demonstrated_quality' ? 'demonstrated_quality' : 'ability',
      samples: new Set(),
      latest: assessment.created_at,
    };
    pattern.samples.add(assessment.sample_id);
    if (new Date(assessment.created_at) > new Date(pattern.latest)) pattern.latest = assessment.created_at;
    patternMap.set(key, pattern);
  }
  const patterns = [...patternMap.values()]
    .map(pattern => ({...pattern, sample_count: pattern.samples.size, samples: undefined}))
    .sort((a, b) => b.sample_count - a.sample_count || new Date(b.latest) - new Date(a.latest));
  const timeline = assessments.map(assessment => ({
    assessment_id: assessment.id,
    date: assessment.created_at,
    title: sampleById.get(assessment.sample_id)?.title || 'Activity assessment',
    names: (assessment.findings?.abilities || []).map(finding => finding.name).filter(Boolean),
    review_status: assessment.review_status || 'pending',
  }));
  return {
    summary: {activities: samples.length, assessments: assessments.length, approved_discoveries: approvedFindings.length},
    patterns,
    timeline,
  };
}
