export const taggedPlan = ({ tags }, plan) => ({
  type: 'plan',
  tags,
  plan,
});
