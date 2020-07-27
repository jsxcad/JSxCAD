let typedefCache = {};

const getTypedefCache = () => typedefCache;
const setTypedefCache = (cache) => { typedefCache = cache; };

module.exports = { getTypedefCache, setTypedefCache };
