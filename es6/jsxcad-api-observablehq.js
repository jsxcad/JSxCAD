import { staticView, dataUrl, image, orbitView } from './jsxcad-ui-threejs.js';
import Shape from './jsxcad-api-v1-shape.js';
import * as v1 from './jsxcad-api-v1.js';
import { qualifyPath, boot } from './jsxcad-sys.js';
import { toZipFromFilesystem } from './jsxcad-convert-zip.js';

const bigViewMethod = async function ({ width = 512, height = 256, position = [100, -100, 100] } = {}) { return staticView(this, { width, height, position }); };
const bigTopViewMethod = async function ({ width = 512, height = 256, position = [0, 0, 100] } = {}) { return staticView(this, { width, height, position }); };
const viewMethod = async function ({ width = 256, height = 128, position = [100, -100, 100] } = {}) { return staticView(this, { width, height, position }); };
const topViewMethod = async function ({ width = 256, height = 128, position = [0, 0, 100] } = {}) { return staticView(this, { width, height, position }); };
const frontViewMethod = async function ({ width = 256, height = 128, position = [0, -100, 0] } = {}) { return staticView(this, { width, height, position }); };

Shape.prototype.view = viewMethod;
Shape.prototype.bigView = bigViewMethod;
Shape.prototype.topView = topViewMethod;
Shape.prototype.bigTopView = bigTopViewMethod;
Shape.prototype.frontView = frontViewMethod;

const bigDataUrlMethod = async function ({ width = 512, height = 256, position = [100, -100, 100] } = {}) { return dataUrl(this, { width, height, position }); };
const bigTopDataUrlMethod = async function ({ width = 512, height = 256, position = [0, 0, 100] } = {}) { return dataUrl(this, { width, height, position }); };
const dataUrlMethod = async function ({ width = 256, height = 128, position = [100, -100, 100] } = {}) { return dataUrl(this, { width, height, position }); };
const topDataUrlMethod = async function ({ width = 256, height = 128, position = [0, 0, 100] } = {}) { return dataUrl(this, { width, height, position }); };
const frontDataUrlMethod = async function ({ width = 256, height = 128, position = [0, -100, 0] } = {}) { return dataUrl(this, { width, height, position }); };

Shape.prototype.dataUrl = dataUrlMethod;
Shape.prototype.bigDataUrl = bigDataUrlMethod;
Shape.prototype.topDataUrl = topDataUrlMethod;
Shape.prototype.bigTopDataUrl = bigTopDataUrlMethod;
Shape.prototype.frontDataUrl = frontDataUrlMethod;

const bigImageMethod = async function ({ width = 512, height = 256, position = [100, -100, 100] } = {}) { return image(this, { width, height, position }); };
const bigTopImageMethod = async function ({ width = 512, height = 256, position = [0, 0, 100] } = {}) { return image(this, { width, height, position }); };
const imageMethod = async function ({ width = 256, height = 128, position = [100, -100, 100] } = {}) { return image(this, { width, height, position }); };
const topImageMethod = async function ({ width = 256, height = 128, position = [0, 0, 100] } = {}) { return image(this, { width, height, position }); };
const frontImageMethod = async function ({ width = 256, height = 128, position = [0, -100, 0] } = {}) { return image(this, { width, height, position }); };

Shape.prototype.image = imageMethod;
Shape.prototype.bigImage = bigImageMethod;
Shape.prototype.topImage = topImageMethod;
Shape.prototype.bigTopImage = bigTopImageMethod;
Shape.prototype.frontImage = frontImageMethod;

const orbitViewMethod = async function ({ width = 512, height = 512, position = [0, -100, 0] } = {}) { return orbitView(this, { width, height, position }); };
const bigOrbitViewMethod = async function ({ width = 1024, height = 1024, position = [0, -100, 0] } = {}) { return orbitView(this, { width, height, position }); };

Shape.prototype.orbitView = orbitViewMethod;
Shape.prototype.bigOrbitView = bigOrbitViewMethod;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var FileSaver_min = createCommonjsModule(function (module, exports) {
(function(a,b){b();})(commonjsGlobal,function(){function b(a,b){return "undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d);},e.onerror=function(){console.error("could not download file");},e.send();}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send();}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"));}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b);}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof commonjsGlobal&&commonjsGlobal.global===commonjsGlobal?commonjsGlobal:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href);},4E4),setTimeout(function(){e(j);},0));}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else {var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i);});}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null;},j.readAsDataURL(a);}else {var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l);},4E4);}});f.saveAs=a.saveAs=a,(module.exports=a);});


});

/* global Blob, document */

const doDownload = async (filename) => {
  const prefix = `${qualifyPath('output')}/`;
  const filterPath = path => path.startsWith(prefix);
  const transformPath = path => `${filename}/${path.substring(prefix.length)}`;
  const zip = await toZipFromFilesystem({ filterPath, transformPath });
  const blob = new Blob([zip.buffer], { type: 'application/zip' });
  FileSaver_min(blob, `${filename}.zip`);
};

const downloadAsZip = (filename = 'project.zip', { title = 'Download' } = {}) => {
  const button = document.createElement('button');
  button.textContent = title;
  button.onclick = () => doDownload(filename);
  return button;
};

/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

const api = async () => {
  await boot();
  return { ...v1, downloadAsZip };
};

export { api };
