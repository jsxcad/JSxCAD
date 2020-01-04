import Random from './Random';
import test from 'ava';

test('Produce base sequence', t => {
  const rng = Random();
  const sequence = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(_ => rng());
  t.deepEqual(sequence,
              [0.500062950304724,
               0.5157397988987481,
               0.9226656041393675,
               0.3155057489209589,
               0.1551597700815554,
               0.9486529105223372,
               0.3748853226133821,
               0.3723766031610725,
               0.48958173894546503,
               0.6052440010489067]);
});
