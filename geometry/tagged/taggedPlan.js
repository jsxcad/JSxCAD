export const taggedPlan = ({ tags = [], matrix }, plan) => ({
  type: 'plan',
  tags,
  matrix,
  plan,
  content: [],
});
