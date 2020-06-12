import { emit } from "@jsxcad/sys";

export const md = (strings, ...placeholders) => {
  const md = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  emit({ md });
  return md;
};
