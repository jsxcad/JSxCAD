let fileInfoCache = {};

const getFileInfoCache = () => fileInfoCache;
const setFileInfoCache = (cache) => {
  fileInfoCache = cache;
};

export { getFileInfoCache, setFileInfoCache };
