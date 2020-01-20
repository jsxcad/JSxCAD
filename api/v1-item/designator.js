const registry = [];

export const fromDesignator = (designator) => {
  for (const { parser, constructor } of registry) {
    const spec = parser(designator);
    if (spec !== undefined) {
      return constructor(spec);
    }
  }
  throw Error('die');
};

export const registerDesignator = (parser, constructor) =>
  registry.push({ parser, constructor });
