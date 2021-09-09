export const toPathnameFromUrl = (url) => {
  const { pathname } = new URL(url);
  if (pathname.match(/^[/][A-Z]:[/]/)) {
    // This looks like a windows file url.
    // Unfortunately it has a leading slash that we need to get rid of.
    return pathname.substring(1);
  } else {
    return pathname;
  }
};
