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
      advice: PropTypes.object,
      file: PropTypes.string,
      id: PropTypes.string,
      onRun: PropTypes.func,
      onSave: PropTypes.func,
      onChange: PropTypes.func,
      onClickLink: PropTypes.func,
      onSelectView: PropTypes.func,
      workspace: PropTypes.string,
      notebookData: PropTypes.object,
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
    const { advice } = this.props;

    if (!advice.domElementByHash) {
      advice.domElementByHash = new Map();
    }
    if (!advice.domUsedElements) {
      advice.domUsedElements = new Set();
    }
    if (!advice.widgets) {
      advice.widgets = new Map();
    }

    const { domElementByHash, domUsedElements, widgets } = advice;

    editor.on('linkClick', ({ token }) => {
      const { value = '' } = token;
      const [url = ''] = ExtractUrls(value);
      this.props.onClickLink(url);
    });

    editor.session.notebookElements = {};

    // const { JavascriptMode, LineWidgets, Range } = aceEditorLineWidgets;
    const { JavascriptMode, LineWidgets } = aceEditorLineWidgets;

    const mode = new JavascriptMode();
    delete mode.foldingRules;

    session.setMode(mode);

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

    let lastUpdate;
    let marker;

    const doUpdate = async () => {
      if (advice) {
        if (advice.definitions) {
          for (const definition of advice.widgets.keys()) {
            const widget = advice.widgets.get(definition);
            widgetManager.removeLineWidget(widget);
            advice.widgets.delete(definition);
          }
        }
      }

      lastUpdate = new Date();

      // let context = {};
      const notesByDefinition = new Map();
      const definitions = [];
      let nthView = 0;

      for (let hash of Object.keys(notebookData)) {
        const note = notebookData[hash];
        if (!note) {
          continue;
        }
        // console.log(JSON.stringify({ ...note, data: undefined }));
        if (note.define) {
          definitions.push(note);
        }
        if (note.info) {
          // Filter out info.
          continue;
        }
        if (note.view) {
          note.nthView = nthView;
          note.openView = nthView === openView;
          nthView++;
        }
        if (note.context && note.context.recording) {
          const definition = note.context.recording.id;
          if (!notesByDefinition.has(definition)) {
            notesByDefinition.set(definition, [...definitions]);
          }
          notesByDefinition.get(definition).push(note);
          if (note.hash) {
            if (!domElementByHash.has(note.hash)) {
              // console.log(`QQ/dom/cache/miss: ${note.hash}`);
              const element = await toDomElement([note, ...definitions], {
                onClickView,
              });
              domElementByHash.set(note.hash, element);
            }
            note.domElement = domElementByHash.get(note.hash);
          }
        }
      }

      // Construct the LineWidgets
      for (const definition of notesByDefinition.keys()) {
        try {
          const entry = advice.definitions.get(definition);
          if (!entry) {
            console.log(`Missing definition: ${definition}`);
            continue;
          }
          const { initSourceLocation } = entry;
          const notes = notesByDefinition.get(definition);
          const el = document.createElement('div');
          for (const note of notes) {
            if (note.domElement) {
              el.appendChild(note.domElement);
              domUsedElements.add(note.domElement);
            }
          }
          const widget = {
            row: initSourceLocation.end.line - 1,
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
            // console.log( `QQ/Height not aligned: definition: ${definition} offsetHeight: ${el.offsetHeight} lineHeight: ${lineHeight}`);
          }

          widgets.set(definition, widget);
          widgetManager.addLineWidget(widget);

          // Make it visible now that it is in the right place.
          el.style.visibility = '';

          if (widget.pixelHeight !== lineHeight * widget.rowCount) {
            // console.log( `QQ/widget: definition ${definition} pixelHeight ${ widget.pixelHeight } vs ${lineHeight * widget.rowCount} rowCount ${ widget.rowCount } lineHeight ${lineHeight}`);
          }
        } catch (e) {
          console.log(e.stack);
          throw e;
        }
      }

      editor.resize();

      if (marker) {
        session.removeMarker(marker);
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
        const element = domElementByHash.get(hash);
        if (!domUsedElements.has(element)) {
          domElementByHash.delete(hash);
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
      }
      domUsedElements.clear();
    };

    advice.onUpdate = update;
    advice.onFinished = finished;
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
