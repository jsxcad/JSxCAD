/*
From: https://www.fastenermart.com/wood-screws.html

DESIGNATION
Wood screws are typically described as follows:

Nominal Size (a number from #0 to #24; #0 is smallest)
Screw Length (in inches; see above for instructions on how to measure)
Drive Style (slotted, Phillips or square)
Head Type (flat or oval countersunk, or round)
Fastener Name (wood screw)
Material (steel, stainless steel, brass and silicon bronze)
Protective Finish (zinc plated if steel)
Examples:

#10 x 1 1/2" Slotted Round Head Wood Screw, Brass
#4 x 7/8" Phillips Flat Head Wood Screw, Zinc Plated (because zinc plating usually means that the fastener is made of steel, the word "steel" is often omitted in the description)
*/

import { foot, inch } from '@jsxcad/api-v1-units';

import { Cylinder } from '@jsxcad/api-v1-shapes';
import WoodScrewDesignator from './WoodScrewDesignator';
import { registerDesignator } from '@jsxcad/api-v1-item';

const decode = (designator) => {
  return WoodScrewDesignator
      .tryParse(designator.toLowerCase())
      .reduce((value, object) => ({ ...object, ...value, designator }), {});
};

export const WoodScrew = ({
  fastenerName = 'wood screw',
  headType,
  driveStyle,
  inchDiameter,
  feetLength,
  material = 'steel',
  mmDiameter,
  mmLength,
  protectiveFinish,
  designator
}) => {
  if (feetLength) { mmLength = feetLength * foot; }
  if (inchDiameter) { mmDiameter = inchDiameter * inch; }
  return Cylinder(mmDiameter, mmLength).material('thread').Item(designator);
};
export default WoodScrew;

registerDesignator(decode, WoodScrew);
