let fileInfoCache = {};

const getFileInfoCache = () => fileInfoCache;
const setFileInfoCache = (cache) => {
  fileInfoCache = cache;
};

module.exports = { getFileInfoCache, setFileInfoCache };
