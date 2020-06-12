const registry = [];

// FIX: Need to clear out temporary registrations.

export const fromDesignator = (designator) => {
  for (const { parser, constructor } of registry) {
    const spec = parser(designator);
    if (spec !== undefined && spec !== null && spec !== false) {
      return constructor(spec);
    }
  }
  throw Error("die");
};

// Later definitions override earlier definitions.
export const registerDesignator = (parser, constructor) =>
  registry.unshift({ parser, constructor });
