/* global mermaid */
import * as PropTypes from 'prop-types';

import AceEditor from 'react-ace';
import ExtractUrls from 'extract-urls';
import PrismJS from 'prismjs/components/prism-core';
import React from 'react';

import { aceEditorAuxiliary } from './AceEditorAuxiliary';
import { aceEditorCompleter } from './AceEditorCompleter';
import { aceEditorLineWidgets } from './AceEditorLineWidgets';
import { aceEditorSnippetManager } from './AceEditorSnippetManager';
import { animationFrame } from './schedule.js';
import { prismJsAuxiliary } from './PrismJSAuxiliary';

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
      path: PropTypes.string,
      data: PropTypes.string,
      advice: PropTypes.object,
      onRun: PropTypes.func,
      onSave: PropTypes.func,
      onChange: PropTypes.func,
      onClickLink: PropTypes.func,
      onClose: PropTypes.func,
      onSelectView: PropTypes.func,
      onCursorChange: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.onValueChange = this.onValueChange.bind(this);
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
    const { advice, onCursorChange } = this.props;

    if (!advice) {
      return;
    }

    if (!advice.widgets) {
      advice.widgets = new Map();
    }

    const { notebookDefinitions, widgets } = advice;

    editor.on('linkClick', ({ token }) => {
      const { value = '' } = token;
      const [url = ''] = ExtractUrls(value) || [];
      if (url) {
        return this.props.onClickLink(url);
      }
      // Match './xxx' and '../xxx'.
      const match = value.match(/^'([.][.]?[/].*)'$/);
      if (match) {
        const uri = new URL(match[1], this.props.path);
        return this.props.onClickLink(uri.toString());
      }
    });

    let currentRow;

    editor.on('changeSelection', () => {
      if (onCursorChange && currentRow !== editor.selection.cursor.row) {
        currentRow = editor.selection.cursor.row;
        onCursorChange(currentRow + 1);
      }
    });

    editor.session.notebookElements = {};

    const { JavascriptMode, LineWidgets } = aceEditorLineWidgets;

    const mode = new JavascriptMode();
    delete mode.foldingRules;

    session.setMode(mode);

    if (!session.widgetManager) {
      session.widgetManager = new LineWidgets(session);
      session.widgetManager.attach(editor);
    }

    const widgetManager = session.widgetManager;

    let marker;
    let updating = false;

    const update = async () => {
      try {
        if (updating) {
          return;
        }
        updating = true;
        // Make sure everything is rendered, first.
        await animationFrame();
        mermaid.init(undefined, '.mermaid');
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
              }
            }
            for (const definition of Object.keys(notebookDefinitions)) {
              const notebookDefinition = notebookDefinitions[definition];
              const widget = widgets.get(definition);
              if (widget && widget.el !== notebookDefinition.widgetElement) {
                // Stash the elements for re-use.
                for (const domElement of notebookDefinition.domElements) {
                  notebookDefinition.wip.appendChild(domElement);
                }
                widgetManager.removeLineWidget(widget);
                widgets.delete(definition);
              }
              if (!widgets.has(definition)) {
                const entry = advice.definitions.get(definition);
                if (entry) {
                  const { initSourceLocation } = entry;
                  const { domElements } = notebookDefinition;
                  if (!domElements) {
                    continue;
                  }
                  const widgetElement = document.createElement('div');
                  let pixelHeight = 0;
                  for (const e of domElements) {
                    pixelHeight += e.offsetHeight;
                    widgetElement.appendChild(e);
                  }
                  if (!pixelHeight) {
                    continue;
                  }
                  const widget = {
                    row: initSourceLocation.end.line - 1,
                    coverLine: false,
                    fixedWidth: true,
                    el: widgetElement,
                  };
                  const lineHeight = editor.renderer.layerConfig.lineHeight;
                  const rowCount = Math.ceil(pixelHeight / lineHeight);
                  widgetElement.style.height = `${rowCount * lineHeight}px`;
                  widgetElement.style.zIndex = -1;

                  widgetManager.addLineWidget(widget);

                  if (widget.rowCount !== Math.floor(widget.rowCount)) {
                    throw Error(`Widget height is not a whole number of rows`);
                  }

                  widgetElement.classList.add(
                    `rowCount_${widget.rowCount}`,
                    `lineHeight_${lineHeight}`,
                    `pixelHeight_${pixelHeight}`
                  );
                  // Display the hidden element.
                  widgetElement.style.visibility = '';
                  widgets.set(definition, widget);
                  notebookDefinition.widgetElements = domElements;
                }
              }
            }
          }
        }

        editor.resize();

        if (marker) {
          session.removeMarker(marker);
        }
      } finally {
        updating = false;
      }
    };

    const finished = () => {};

    advice.onUpdate = update;
    advice.onFinished = finished;

    update();
  }

  async update() {}

  async componentWillUnmount() {
    const { onClose, advice = {} } = this.props;
    const { notebookNotes } = advice;
    if (notebookNotes) {
      notebookNotes.onUpdate = undefined;
      notebookNotes.onFinished = undefined;
    }
    if (onClose) {
      await onClose();
    }
  }

  onValueChange(data) {
    this.props.onChange(data);
  }

  highlight(data) {
    return PrismJS.highlight(data, PrismJS.languages.js);
  }

  render() {
    try {
      const { data = '' } = this.props;

      return (
        <AceEditor
          ref={(ref) => {
            this.aceEditor = ref;
          }}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableLinking: true,
            useWorker: false,
          }}
          height="100%"
          highlightActiveLine={true}
          mode="javascript"
          onChange={this.onValueChange}
          showGutter={true}
          showPrintMargin={true}
          theme="github"
          fontSize={18}
          value={data}
          width="100%"
          wrapEnabled={true}
        />
      );
    } catch (e) {
      console.log(e.stack);
      throw e;
    }
  }
}

export default JsEditorUi;
