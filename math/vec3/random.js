import { abs } from "./abs";

// find a vector that is somewhat perpendicular to this one
export const random = (vec) => {
  const temp = abs(vec);
  if (temp[0] <= temp[1] && temp[0] <= temp[2]) {
    return [1, 0, 0];
  } else if (temp[1] <= temp[0] && temp[1] <= temp[2]) {
    return [0, 1, 0];
  } else {
    return [0, 0, 1];
  }
};
