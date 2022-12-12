import Shape from './Shape.js';

export const byType = (args) => {
  let shapes = [];
  let arrays = [];
  let functions = [];
  let objects = [];
  let others = [];
  let shapesAndFunctions = [];

  // An attempt to make view less annoying by assigning the arguments based on type.
  for (const arg of args) {
    if (arg instanceof Shape) {
      shapes.push(arg);
      shapesAndFunctions.push(arg);
    } else if (arg instanceof Array) {
      arrays.push(arg);
    } else if (arg instanceof Function) {
      functions.push(arg);
      shapesAndFunctions.push(arg);
    } else if (arg instanceof Object) {
      objects.push(arg);
    } else if (arg !== undefined) {
      others.push(arg);
    }
  }
  return { shapes, arrays, functions, objects, shapesAndFunctions, others };
};
