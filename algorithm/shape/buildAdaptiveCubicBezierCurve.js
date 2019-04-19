import bezier from 'adaptive-bezier-curve';

export const buildAdaptiveCubicBezierCurve = ({ scale = 2 }, [start, c1, c2, end]) => bezier(start, c1, c2, end, scale);
