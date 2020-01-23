import Shape from './jsxcad-api-v1-shape.js';

const Plan = ({ plan, marks = [], planes = [], tags = [], visualization, content }, context) => {
  let visualizationGeometry = visualization === undefined ? { assembly: [] } : visualization.toKeptGeometry();
  let contentGeometry = content === undefined ? { assembly: [] } : content.toKeptGeometry();
  const shape = Shape.fromGeometry({
    plan,
    marks,
    planes,
    tags,
    content: contentGeometry,
    visualization: visualizationGeometry
  },
                                   context);
  return shape;
};

export default Plan;
export { Plan };
