import AceEditor from 'react-ace';
import ExtractUrls from 'extract-urls';
import PrismJS from 'prismjs/components/prism-core';
import PropTypes from 'prop-types';
import React from 'react';

import { aceEditorAuxiliary } from './AceEditorAuxiliary';
import { aceEditorCompleter } from './AceEditorCompleter';
import { aceEditorLineWidgets } from './AceEditorLineWidgets';
import { aceEditorSnippetManager } from './AceEditorSnippetManager';
import { prismJsAuxiliary } from './PrismJSAuxiliary';
import { toDomElement } from '@jsxcad/ui-notebook';

if (!aceEditorAuxiliary) throw Error('die');
if (!prismJsAuxiliary) throw Error('die');

const snippetCompleter = {
  getCompletions: function (editor, session, position, prefix, callback) {
    const { row, column } = position;
    var scopes = ['JSxCAD'];
    var token = session.getTokenAt(row, column);
    var snippetMap = aceEditorSnippetManager.snippetMap;
    var completions = [];
    let isMethod = false;
    {
      const { start } = token;
      const previous = session.getTokenAt(row, start);
      if (previous !== null && previous.value === '.') {
        isMethod = true;
      }
    }
    scopes.forEach(function (scope) {
      var snippets = snippetMap[scope] || [];
      for (var i = snippets.length; i--; ) {
        var s = snippets[i];
        if (s.isMethod) {
          if (!isMethod) {
            continue;
          }
        }
        var caption = s.name;
        if (!caption) {
          continue;
        }
        completions.push({
          caption: caption,
          snippet: s.content,
          meta: s.meta,
          docHTML: s.docHTML,
          type: s.type,
        });
      }
    }, this);
    callback(null, completions);
  },
};

aceEditorCompleter.setCompleters([snippetCompleter]);

export class JsEditorUi extends React.PureComponent {
  static get propTypes() {
    return {
      ask: PropTypes.func,
      data: PropTypes.string,
      file: PropTypes.string,
      id: PropTypes.string,
      onRun: PropTypes.func,
      onSave: PropTypes.func,
      onChange: PropTypes.func,
      onClickLink: PropTypes.func,
      workspace: PropTypes.string,
      notebookData: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  saveShortcut() {
    return {
      name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: () => this.save(),
    };
  }

  runShortcut() {
    const { onRun } = this.props;
    return {
      name: 'run',
      bindKey: { win: 'Shift-Enter', mac: 'Shift-Enter' },
      exec: () => onRun(),
    };
  }

  async run() {
    this.props.onRun();
  }

  async save() {
    this.props.onSave();
  }

  async componentDidMount() {
    const { editor } = this.aceEditor;

    editor.on('linkClick', ({ token }) => {
      const { value = '' } = token;
      const [url = ''] = ExtractUrls(value);
      this.props.onClickLink(url);
    });

    editor.session.notebookElements = {};

    if (!editor.session.widgetManager) {
      editor.session.widgetManager = new aceEditorLineWidgets.LineWidgets(
        editor.session
      );
      editor.session.widgetManager.attach(editor);
    }

    const widgetManager = editor.session.widgetManager;
    const notebookData = this.props.notebookData;

    if (!notebookData.listeners) {
      notebookData.listeners = [];
    }

    const domElementByHash = new Map();

    const hashNotes = (notes) => notes.map((note) => note.hash || '').join('/');

    const widgets = [];

    const update = async () => {
      const usedHashes = new Set();

      for (const widget of widgets) {
        widgetManager.removeLineWidget(widget);
      }

      let context = {};
      const notesByLine = [];
      const definitions = [];

      for (let note of notebookData) {
        if (!note) {
          continue;
        }
        if (note.setContext) {
          context = Object.assign(context, note.setContext);
        }
        note = Object.assign({}, note, { context });
        if (note.define) {
          definitions.push(note);
        }
        if (note.context && note.context.sourceLocation) {
          const line = note.context.sourceLocation.line || 0;
          if (!notesByLine[line]) {
            notesByLine[line] = [...definitions];
          }
          notesByLine[line].push(note);
        }
      }

      for (const line of Object.keys(notesByLine)) {
        const notes = notesByLine[line];
        const hash = hashNotes(notes);
        usedHashes.add(hash);
        let el;
        if (!domElementByHash.has(hash)) {
          el = await toDomElement(notes);
          domElementByHash.set(hash, el);
        } else {
          el = domElementByHash.get(hash);
        }
        const widget = {
          row: parseInt(line),
          coverLine: true,
          fixedWidth: true,
          el,
        };
        widgets.push(widget);
        widgetManager.addLineWidget(widget);
      }

      for (const hash of domElementByHash.keys()) {
        if (!usedHashes.has(hash)) {
          domElementByHash.delete(hash);
        }
      }
    };

    notebookData.listeners = [update];
  }

  async update() {}

  async componentWillUnmount() {}

  onValueChange(data) {
    this.props.onChange(data);
  }

  highlight(data) {
    return PrismJS.highlight(data, PrismJS.languages.js);
  }

  stop(e) {
    e.stopPropagation();
  }

  preventDefault(e) {
    e.preventDefault();
    return false;
  }

  onKeyDown(e) {
    const ENTER = 13;
    const S = 83;
    const SHIFT = 16;
    const CONTROL = 17;

    const key = e.which || e.keyCode || 0;

    switch (key) {
      case CONTROL:
      case SHIFT:
        return true;
    }

    const { ctrlKey, shiftKey } = e;
    switch (key) {
      case ENTER: {
        if (shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          this.run();
          return false;
        }
        break;
      }
      case S: {
        if (ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          this.save();
          return false;
        }
        break;
      }
    }
  }

  render() {
    const { id } = this.props;
    const { data = '' } = this.props;

    return (
      <div onKeyDown={this.onKeyDown}>
        <AceEditor
          ref={(ref) => {
            this.aceEditor = ref;
          }}
          commands={[this.runShortcut(), this.saveShortcut()]}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            // enableBasicAutocompletion: true,
            // enableLiveAutocompletion: true,
            // enableSnippets: true,
            enableLinking: true,
            useWorker: false,
          }}
          height="100%"
          highlightActiveLine={true}
          key={id}
          mode="javascript"
          name={id}
          onChange={this.onValueChange}
          showGutter={true}
          showPrintMargin={true}
          theme="github"
          fontSize={18}
          value={data}
          width="100%"
          wrapEnabled={true}
        />
      </div>
    );
  }
}

export default JsEditorUi;
