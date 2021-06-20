import Ace from 'ace-builds/src-noconflict/ace';

const LineWidgets = Ace.acequire('ace/line_widgets').LineWidgets;
const Range = Ace.acequire('ace/range').Range;

export const aceEditorLineWidgets = { LineWidgets, Range };
