let typedefCache = {};

const getTypedefCache = () => typedefCache;
const setTypedefCache = (cache) => {
  typedefCache = cache;
};

export { getTypedefCache, setTypedefCache };
