export const taggedPlan = ({ tags = [], matrix, provenance }, plan) => ({
  type: 'plan',
  tags,
  matrix, provenance,
  plan,
  content: [],
});
