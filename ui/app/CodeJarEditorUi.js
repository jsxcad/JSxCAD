import './CodeJarEditorUi.css';

import * as PropTypes from 'prop-types';

import { CodeJar } from 'codejar';
import { Notebook } from './Notebook.js';
import React from 'react';

export class CodeJarEditorUi extends React.PureComponent {
  static get propTypes() {
    return {
      path: PropTypes.string,
      data: PropTypes.string,
      advice: PropTypes.object,
      onRun: PropTypes.func,
      onSave: PropTypes.func,
      onChange: PropTypes.func,
      onClickLink: PropTypes.func,
      onClickView: PropTypes.func,
      onClose: PropTypes.func,
      onSelectView: PropTypes.func,
      onCursorChange: PropTypes.func,
      notes: PropTypes.array,
      workspace: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // this.codeJar = CodeJar(this.editor);
  }

  async componentWillUnmount() {}

  onChange(id, text) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(text, id);
    }
  }

  getStatements() {
    try {
      const { notes = {} } = this.props;
      const byId = new Map();
      const statements = [];
      for (const key of Object.keys(notes)) {
        const note = notes[key];
        const { sourceText } = note;
        const { sourceLocation } = note;
        if (sourceLocation === undefined || sourceText === undefined) {
          continue;
        }
        const { id, line, nth } = sourceLocation;
        const statement = { id, line, nth, sourceText, notes: [] };
        byId.set(id, statement);
        statements.push(statement);
      }

      for (const key of Object.keys(notes)) {
        const note = notes[key];
        const { sourceLocation } = note;
        if (sourceLocation === undefined) {
          continue;
        }
        const entry = byId.get(sourceLocation.id);
        entry.notes.push(note);
      }

      statements.sort((a, b) => {
        const lineDiff = a.line - b.line;
        if (lineDiff !== 0) {
          return lineDiff;
        }
        return a.nth - b.nth;
      });

      return statements;
    } catch (error) {
      console.log(error.stack);
      throw error;
    }
  }

  render() {
    const { path, onClickView, workspace } = this.props;
    const tiles = [];
    for (const statement of this.getStatements()) {
      const { id = '', sourceText = '', notes = [] } = statement;
      tiles.push(
        <tr>
          <td>{id}</td>
        </tr>
      );
      const notebook = (
        <Notebook
          notebookPath={path}
          notes={notes}
          onClickView={onClickView}
          workspace={workspace}
        />
      );
      const editor = (
        <div
          class="CodeJarEditorUi"
          ref={(ref) => {
            if (ref) {
              CodeJar(ref, () => {}).onUpdate((text) =>
                this.onChange(id, text)
              );
            }
          }}
        >
          {sourceText}
        </div>
      );
      tiles.push(
        <tr>
          <td>{notebook}</td>
        </tr>
      );
      tiles.push(
        <tr>
          <td>{editor}</td>
        </tr>
      );
    }

    return (
      <div style={{ overflow: 'scroll' }}>
        <table>{tiles}</table>
      </div>
    );
  }
}

export default CodeJarEditorUi;
