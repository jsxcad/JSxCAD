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
      domElementByHash: PropTypes.object,
      file: PropTypes.string,
      id: PropTypes.string,
      onRun: PropTypes.func,
      onSave: PropTypes.func,
      onChange: PropTypes.func,
      onClickLink: PropTypes.func,
      onSelectView: PropTypes.func,
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
    const { session } = editor;
    const { domElementByHash } = this.props;

    editor.on('linkClick', ({ token }) => {
      const { value = '' } = token;
      const [url = ''] = ExtractUrls(value);
      this.props.onClickLink(url);
    });

    editor.session.notebookElements = {};

    const { LineWidgets, Range } = aceEditorLineWidgets;

    if (!session.widgetManager) {
      session.widgetManager = new LineWidgets(session);
      session.widgetManager.attach(editor);
    }

    const widgetManager = session.widgetManager;
    const notebookData = this.props.notebookData;

    let openView = -1;

    const onClickView = (event, note) => {
      openView = note.nthView;
    };

    // const domElementByHash = new Map();

    const hashNotes = (notes) => notes.map((note) => note.hash || '').join('/');

    const widgets = [];

    let usedHashes = new Set();
    let lastUpdate;
    let marker;

    const doUpdate = async () => {
      lastUpdate = new Date();

      for (const widget of widgets) {
        widgetManager.removeLineWidget(widget);
      }

      let context = {};
      const notesByLine = [];
      const definitions = [];
      let nthView = 0;

      let sourceLocation;

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
        if (note.view) {
          note.nthView = nthView;
          note.openView = nthView === openView;
          nthView++;
        }
        if (note.context && note.context.sourceLocation && !note.info) {
          const line = note.context.sourceLocation.line || 0;
          if (!notesByLine[line]) {
            notesByLine[line] = [...definitions];
          }
          notesByLine[line].push(note);
          if (note.hash) {
            if (!domElementByHash.has(note.hash)) {
              console.log(`QQ/dom/cache/miss: ${note.hash}`);
              const el = await toDomElement([note, ...definitions], {
                onClickView,
              });
              domElementByHash.set(note.hash, el);
            }
          }
        }
        if (note.context && note.context.sourceLocation) {
          sourceLocation = note.context.sourceLocation;
        }
      }

      for (const line of Object.keys(notesByLine)) {
        const notes = notesByLine[line];
        const hash = hashNotes(notes);
        usedHashes.add(hash);
        const el = document.createElement('div');
        for (const note of notes) {
          if (note.hash) {
            const dom = domElementByHash.get(note.hash);
            if (dom) {
              el.appendChild(dom);
            }
          }
        }
        const widget = {
          row: parseInt(line) - 1,
          coverLine: false,
          fixedWidth: true,
          el,
        };

        el.style.overflow = 'hidden';
        el.style.padding = 0;
        el.style.border = 0;
        el.style.margin = 0;

        // Add to the dom, so we can calculate the height.
        el.style.visibility = 'hidden';
        document.body.appendChild(el);

        // Adjust the widget height to be a multiple of line height, otherwise line selection is thrown off.
        const lineHeight = editor.renderer.layerConfig.lineHeight;
        let elHeight;
        if (el.offsetHeight % lineHeight === 0) {
          elHeight = Math.ceil(el.offsetHeight / lineHeight) * lineHeight;
        } else {
          elHeight = Math.ceil(el.offsetHeight / lineHeight) * lineHeight;
        }
        el.style.height = `${elHeight}px`;
        if (el.offsetHeight % lineHeight !== 0) {
          console.log(
            `QQ/Height not aligned: line: ${line} offsetHeight: ${el.offsetHeight} lineHeight: ${lineHeight}`
          );
        }

        widgets.push(widget);
        widgetManager.addLineWidget(widget);

        // Make it visible now that it is in the right place.
        el.style.visibility = '';

        if (widget.pixelHeight !== lineHeight * widget.rowCount) {
          console.log(
            `QQ/widget: line ${line} pixelHeight ${widget.pixelHeight} vs ${
              lineHeight * widget.rowCount
            } rowCount ${widget.rowCount} lineHeight ${lineHeight}`
          );
        }
      }

      editor.resize();

      if (marker) {
        session.removeMarker(marker);
      }
      if (sourceLocation) {
        const { line, column } = sourceLocation;
        marker = session.addMarker(
          new Range(0, 0, line - 1, column),
          'progress-marker',
          'text'
        );
      }
    };

    let updateScheduled = false;

    const update = () => {
      if (updateScheduled) {
        return;
      }
      const now = new Date();
      if (lastUpdate && now < lastUpdate + 5000) {
        updateScheduled = true;
        setTimeout(() => {
          doUpdate();
          updateScheduled = false;
        }, 1000);
      } else {
        doUpdate();
      }
    };

    const finished = () => {
      for (const hash of domElementByHash.keys()) {
        if (!usedHashes.has(hash)) {
          domElementByHash.delete(hash);
        }
      }
      usedHashes.clear();
    };

    notebookData.onUpdate = update;
    notebookData.onFinished = finished;
  }

  async update() {}

  async componentWillUnmount() {
    const notebookData = this.props.notebookData;
    notebookData.onUpdate = undefined;
    notebookData.onFinished = undefined;
  }

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
