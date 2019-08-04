import { drop } from './drop';
import test from 'ava';

test('Deep drop', t => {
  const assembly = { assembly: [{ solid: [],
                                  tags: [ 'plate' ] },
                                { assembly: [{ solid: [] },
                                             { assembly: [{ solid: [] },
                                                          { solid: [] },
                                                          { solid: [] }],
                                               tags: ['void'] }] }] };
  const dropped = drop(['void'], assembly);
  t.deepEqual(dropped,
              { assembly: [{ solid: [], tags: [ 'plate' ] },
                           { assembly: [{ solid: [] },
                                        { assembly: [{ solid: [] },
                                                     { solid: [] },
                                                     { solid: [] }],
                                          tags: ['@drop', 'void'] }] }] });
});
