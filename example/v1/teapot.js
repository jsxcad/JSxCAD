const teapot = await readStl({ path: 'teapot.stl', format: 'binary' });
await teapot.writeStl('tmp/teapot.stl');
