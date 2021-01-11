import { getRadius } from './getRadius.js';

export const getDiameter = (plan) => getRadius(plan).map((r) => r * 2);
