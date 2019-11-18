import { fromSvg } from './fromSvg';
import fs from 'fs';
import test from 'ava';
import { toPdf } from '@jsxcad/convert-pdf';

const { readFile, writeFile } = fs.promises;

test('Rectangle', async t => {
  const assembly = await fromSvg({},
                                 `
                            <?xml version="1.0"?>
                            <svg width="12cm" height="4cm" viewBox="0 0 1200 400"
                                 xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                            <desc>Example rect01 - rectangle with sharp corners</desc>
                            <!-- Show outline of canvas using 'rect' element -->
                            <rect x="1" y="1" width="1198" height="398"
                                  fill="none" stroke="violet" stroke-width="2"/>
                            <rect x="400" y="100" width="400" height="200"
                                  fill="yellow" stroke="navy" stroke-width="10"  />
                            </svg>
                           `);
  const pdf = await toPdf({}, assembly);
  await writeFile('out.rectangle.pdf', pdf);
  t.is(pdf, await readFile('test.rectangle.pdf', { encoding: 'utf8' }));
});

test('Rounded Rectangle', async t => {
  const assembly = await fromSvg({},
                                 `
                            <?xml version="1.0"?>
                            <svg width="12cm" height="4cm" viewBox="0 0 1200 400"
                                 xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                              <desc>Example rect02 - rounded rectangles</desc>
                              <!-- Show outline of canvas using 'rect' element -->
                              <rect x="1" y="1" width="1198" height="398"
                                    fill="none" stroke="blue" stroke-width="2"/>
                              <rect x="100" y="100" width="400" height="200" rx="50"
                                    fill="green" />
                              <!--<g transform="translate(700 210) rotate(-30)">-->
                              <g transform="translate(700 210) rotate(-30)">
                                <rect x="0" y="0" width="400" height="200" rx="50"
                                      fill="none" stroke="purple" stroke-width="30" />
                              </g>
                              <g transform="translate(700 210) rotate(-60)">
                                <rect x="0" y="0" width="400" height="200" rx="50"
                                      fill="none" stroke="purple" stroke-width="30" />
                              </g>
                            </svg>
                           `);
  const pdf = await toPdf({}, assembly);
  await writeFile('out.rounded-rectangle.pdf', pdf);
  t.is(pdf, await readFile('test.rounded-rectangle.pdf', { encoding: 'utf8' }));
});

test('Polyline', async t => {
  const assembly = await fromSvg({},
                                 `
                            <?xml version="1.0"?>
                            <svg width="12cm" height="4cm" viewBox="0 0 1200 400"
                                 xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                              <desc>Example polyline01 - increasingly larger bars</desc>
                              <!-- Show outline of canvas using 'rect' element -->
                              <rect x="1" y="1" width="1198" height="398"
                                    fill="none" stroke="blue" stroke-width="2" />
                              <polyline fill="none" stroke="blue" stroke-width="10" 
                                        points="50,375
                                                150,375 150,325 250,325 250,375
                                                350,375 350,250 450,250 450,375
                                                550,375 550,175 650,175 650,375
                                                750,375 750,100 850,100 850,375
                                                950,375 950,25 1050,25 1050,375
                                                1150,375" />
                            </svg>
                           `);
  const pdf = await toPdf({}, assembly);
  await writeFile('out.polyline.pdf', pdf);
  t.is(pdf, await readFile('test.polyline.pdf', { encoding: 'utf8' }));
});

test('Circle', async t => {
  const assembly = await fromSvg({},
                                 `
                            <?xml version="1.0"?>
                            <svg width="12cm" height="4cm" viewBox="0 0 1200 400"
                                 xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                              <desc>Example circle01 - circle filled with red and stroked with blue</desc>
                              <!-- Show outline of canvas using 'rect' element -->
                              <rect x="1" y="1" width="1198" height="398"
                                    fill="none" stroke="blue" stroke-width="2"/>
                              <circle cx="600" cy="200" r="100"
                                    fill="red" stroke="blue" stroke-width="10"  />
                            </svg>
                           `);
  const pdf = await toPdf({}, assembly);
  await writeFile('out.circle.pdf', pdf);
  t.is(pdf, await readFile('test.circle.pdf', { encoding: 'utf8' }));
});

test('Ellipse', async t => {
  const assembly = await fromSvg({},
                                 `
                            <?xml version="1.0"?>
                            <svg width="12cm" height="4cm" viewBox="0 0 1200 400"
                                 xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                              <desc>Example ellipse01 - examples of ellipses</desc>
                              <!-- Show outline of canvas using 'rect' element -->
                              <rect x="1" y="1" width="1198" height="398"
                                    fill="none" stroke="blue" stroke-width="2" />
                              <g transform="translate(300 200)">
                                <ellipse rx="250" ry="100"
                                      fill="red"  />
                              </g>
                              <ellipse transform="translate(900 200) rotate(-30)" 
                                    rx="250" ry="100"
                                    fill="none" stroke="blue" stroke-width="20"  />
                            </svg>
                           `);
  const pdf = await toPdf({}, assembly);
  await writeFile('out.ellipse.pdf', pdf);
  t.is(pdf, await readFile('test.ellipse.pdf', { encoding: 'utf8' }));
});

test('Polygon', async t => {
  const assembly = await fromSvg({},
                                 `
                            <?xml version="1.0"?>
                            <svg width="12cm" height="4cm" viewBox="0 0 1200 400"
                                 xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                              <desc>Example polygon01 - star and hexagon</desc>
                              <!-- Show outline of canvas using 'rect' element -->
                              <rect x="1" y="1" width="1198" height="398"
                                    fill="none" stroke="blue" stroke-width="2" />
                              <polygon fill="red" stroke="blue" stroke-width="10" 
                                        points="350,75  379,161 469,161 397,215
                                                423,301 350,250 277,301 303,215
                                                231,161 321,161" />
                              <polygon fill="lime" stroke="blue" stroke-width="10" 
                                        points="850,75  958,137.5 958,262.5
                                                850,325 742,262.6 742,137.5" />
                            </svg>
                           `);
  const pdf = await toPdf({}, assembly);
  await writeFile('out.polygon.pdf', pdf);
  t.is(pdf, await readFile('test.polygon.pdf', { encoding: 'utf8' }));
});

test('Complex', async t => {
  const assembly = await fromSvg({},
                                 `
                            <?xml version="1.0"?>
                            <svg width="5cm" height="4cm" viewBox="0 0 500 400"
                                 xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny">
                              <title>Example cubic01- cubic Bézier commands in path data</title>
                              <desc>Picture showing a simple example of path data
                                    using both a "C" and an "S" command,
                                    along with annotations showing the control points
                                    and end points</desc>
                              <rect fill="none" stroke="blue" stroke-width="1" x="1" y="1" width="498" height="398" />
                              <polyline fill="none" stroke="#888888" stroke-width="1" points="100,200 100,100" />
                              <polyline fill="none" stroke="#888888" stroke-width="1" points="250,100 250,200" />
                              <polyline fill="none" stroke="#888888" stroke-width="1" points="250,200 250,300" />
                              <polyline fill="none" stroke="#888888" stroke-width="1" points="400,300 400,200" />
                              <path fill="none" stroke="red" stroke-width="5" d="M100,200 C100,100 250,100 250,200
                                                                   S400,300 400,200" />
                              <circle fill="#888888" stroke="none" stroke-width="2" cx="100" cy="200" r="10" />
                              <circle fill="#888888" stroke="none" stroke-width="2" cx="250" cy="200" r="10" />
                              <circle fill="#888888" stroke="none" stroke-width="2" cx="400" cy="200" r="10" />
                              <circle fill="#888888" stroke="none" cx="100" cy="100" r="10" />
                              <circle fill="#888888" stroke="none" cx="250" cy="100" r="10" />
                              <circle fill="#888888" stroke="none" cx="400" cy="300" r="10" />
                              <circle fill="none" stroke="blue" stroke-width="4" cx="250" cy="300" r="9" />
                              <text font-size="22" font-family="Verdana" x="25" y="70">M100,200 C100,100 250,100 250,200</text>
                              <text font-size="22" font-family="Verdana" x="325" y="350"
                                    text-anchor="middle">S400,300 400,200</text>
                            </svg>
                           `);
  const pdf = await toPdf({}, assembly);
  await writeFile('out.complex.pdf', pdf);
  t.is(pdf, await readFile('test.complex.pdf', { encoding: 'utf8' }));
});
