const { getFile } = require('./files');

const writeFileSync = (path, data, options) => {
  const file = getFile(path);
  const { translator } = options;
  
  file.data = data;
  
  if(translator){
    file.translator = translator;
  }
  
  for (const watcher of file.watchers) {
    watcher(file);
  }
  
};

module.exports.writeFileSync = writeFileSync;
