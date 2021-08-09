import Ace from 'ace-builds/src-noconflict/ace';

const JavascriptMode = Ace.acequire('ace/mode/javascript').Mode;
const LineWidgets = Ace.acequire('ace/line_widgets').LineWidgets;
const Range = Ace.acequire('ace/range').Range;

export const aceEditorLineWidgets = { JavascriptMode, LineWidgets, Range };
