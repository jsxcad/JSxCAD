const { getFile } = require('./files');

const writeFileSync = (path, data, options) => {
  const file = getFile(path);
  const { translator } = options;
  
  file.data = data;
  for (const watcher of file.watchers) {
    watcher(file);
  }
  
  if(translator){
    file.translator = translator;
  }
};

module.exports.writeFileSync = writeFileSync;
