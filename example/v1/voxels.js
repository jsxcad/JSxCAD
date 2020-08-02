source('horse.stl', './horse.stl');

const horse = await readStl({ path: 'horse.stl', format: 'binary' });

horse.voxels({ resolution: 2.5 }).view().writeStl('voxelHorse.stl');
