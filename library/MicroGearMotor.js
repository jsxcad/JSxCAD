const FlatShaft = (
  diameter = 1,
  length = 1,
  { flatLength = 0.1, flatOffset = 0.1, play = 0.0 }
) =>
  Cylinder.ofDiameter(diameter + play, length + play * 2).cut(
    Cube(diameter + play * 2, diameter + play * 2, flatLength).move(
      diameter - 0.5,
      0,
      (length - flatLength) / -2 + flatOffset
    )
  );

const Motor = ({ play = 0.0, motorWidth = 12 }) =>
  Cylinder.ofDiameter(12 + play, 15 + play).clip(
    Cube(10 + play * 2, motorWidth + play * 2, 15)
  );

const Terminal = () => Cube(5, 12, 2);

const Gearbox = ({ play = 0, motorWidth = 12 }) =>
  Cube(10 + play * 2, motorWidth + play * 2, 10).moveZ((15 + 10) / 2);

export const MicroGearMotor = ({
  play = 0.2,
  shaftDiameter = 3.2,
  shaftPlay = 0,
  motorWidth = 12,
} = {}) =>
  Motor({ play, motorWidth })
    .with(Gearbox({ play, motorWidth }))
    .with(
      FlatShaft(shaftDiameter, 10 + play * 2, {
        flatLength: 7,
        flatOffset: 3,
        play: shaftPlay,
      }).moveZ((15 + 10) / 2 + 10)
    )
    .with(Terminal().moveZ((15 + 2) / -2));

export const main = () => MicroGearMotor();
