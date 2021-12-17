export const hasNotShow = (geometry, show) =>
  isNotShow(geometry, show)
    ? geometry
    : { ...geometry, tags: geometry.tags.filter((tag) => tag !== show) };
export const hasShow = (geometry, show) =>
  isShow(geometry, show)
    ? geometry
    : { ...geometry, tags: [...geometry.tags, show] };
export const isNotShow = ({ tags }, show) => !tags.includes(show);
export const isShow = ({ tags }, show) => tags.includes(show);

export const showOutline = 'show:outline';
export const hasNotShowOutline = (geometry) =>
  hasNotShow(geometry, showOutline);
export const hasShowOutline = (geometry) => hasShow(geometry, showOutline);
export const isNotShowOutline = (geometry) => isNotShow(geometry, showOutline);
export const isShowOutline = (geometry) => isShow(geometry, showOutline);

export const showOverlay = 'show:overlay';
export const hasNotShowOverlay = (geometry) =>
  hasNotShow(geometry, showOutline);
export const hasShowOverlay = (geometry) => hasShow(geometry, showOverlay);
export const isNotShowOverlay = (geometry) => isNotShow(geometry, showOverlay);
export const isShowOverlay = (geometry) => isShow(geometry, showOverlay);

export const showSkin = 'show:skin';
export const hasNotShowSkin = (geometry) => hasNotShow(geometry, showSkin);
export const hasShowSkin = (geometry) => hasShow(geometry, showSkin);
export const isNotShowSkin = (geometry) => isNotShow(geometry, showSkin);
export const isShowSkin = (geometry) => isShow(geometry, showSkin);

export const showWireframe = 'show:wireframe';
export const hasNotShowWireframe = (geometry) =>
  hasNotShow(geometry, showWireframe);
export const hasShowWireframe = (geometry) => hasShow(geometry, showWireframe);
export const isNotShowWireframe = (geometry) =>
  isNotShow(geometry, showWireframe);
export const isShowWireframe = (geometry) => isShow(geometry, showWireframe);
