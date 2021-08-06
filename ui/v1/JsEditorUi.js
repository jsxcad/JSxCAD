/* global mermaid, requestAnimationFrame */
import * as PropTypes from 'prop-types';

import AceEditor from 'react-ace';
import ExtractUrls from 'extract-urls';
import PrismJS from 'prismjs/components/prism-core';
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
      path: PropTypes.string,
      id: PropTypes.string,
      onRun: PropTypes.func,
      onSave: PropTypes.func,
      onChange: PropTypes.func,
      onClickLink: PropTypes.func,
      onSelectView: PropTypes.func,
      workspace: PropTypes.string,
      notebookDefinitions: PropTypes.object,
      notebookNotes: PropTypes.object,
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

    if (!advice.widgets) {
      advice.widgets = new Map();
    }

    const { domElementByHash, widgets } = advice;

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
    const { notebookDefinitions, notebookNotes } = this.props;

    let openView = -1;

    const onClickView = (event, note) => {
      openView = note.nthView;
    };

    // let lastUpdate;
    let marker;

    const update = async () => {
      // Make sure everything is rendered, first.
      await new Promise((resolve, reject) => {
        requestAnimationFrame(resolve);
      });
      mermaid.init(undefined, '.mermaid');
      console.log(`QQ/doUpdate`);
      if (advice) {
        if (advice.definitions) {
          for (const definition of widgets.keys()) {
            if (
              !notebookDefinitions[definition] ||
              !advice.definitions.get(definition)
            ) {
              const widget = widgets.get(definition);
              widgetManager.removeLineWidget(widget);
              widgets.delete(definition);
              console.log(`QQ/delete widget for: ${definition}`);
            }
          }
          for (const definition of Object.keys(notebookDefinitions)) {
            const notebookDefinition = notebookDefinitions[definition];
            if (
              widgets.has(definition) &&
              widgets.el !== notebookDefinition.domElement
            ) {
              widgetManager.removeLineWidget(widgets.get(definition));
              widgets.delete(definition);
            }
            if (!widgets.has(definition)) {
              const entry = advice.definitions.get(definition);
              if (entry) {
                const { initSourceLocation } = entry;
                const { domElement } = notebookDefinition;
                const widget = {
                  row: initSourceLocation.end.line - 1,
                  coverLine: false,
                  fixedWidth: true,
                  el: domElement,
                };
                widgetManager.addLineWidget(widget);
                widgets.set(definition, widget);
                // Display the hidden element.
                domElement.style.visibility = '';
              }
            }
          }
        }
      }

      // The widgets are created.

      // lastUpdate = new Date();

      // let context = {};
      const notesByDefinition = new Map();
      const definitions = [];
      let nthView = 0;

      for (let hash of Object.keys(notebookNotes)) {
        const note = notebookNotes[hash];
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
              console.log(`QQ/build dom for: ${definition}`);
              const element = toDomElement([note, ...definitions], {
                onClickView,
              });
              domElementByHash.set(note.hash, element);
            }
            note.domElement = domElementByHash.get(note.hash);
          }
        }
      }

      editor.resize();

      if (marker) {
        session.removeMarker(marker);
      }
    };

    const finished = () => {
      console.log(`QQ/finish`);
    };

    advice.onUpdate = update;
    advice.onFinished = finished;
  }

  async update() {}

  async componentWillUnmount() {
    const { notebookNotes } = this.props;
    notebookNotes.onUpdate = undefined;
    notebookNotes.onFinished = undefined;
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
