import './Notebook.css';

import * as PropTypes from 'prop-types';

import React from 'react';
import Section from './Section.js';

export class Notebook extends React.PureComponent {
  static get propTypes() {
    return {
      sections: PropTypes.object,
      onChange: PropTypes.func,
      onClickView: PropTypes.func,
      onKeyDown: PropTypes.func,
      notebookPath: PropTypes.string,
      notebookText: PropTypes.string,
      runGcode: PropTypes.func,
      state: PropTypes.string,
      version: PropTypes.number,
      workspace: PropTypes.string,
    };
  }

  render() {
    try {
      const {
        notebookPath,
        onChange,
        onClickView,
        onKeyDown,
        runGcode,
        sections,
        workspace,
      } = this.props;

      const children = [];
      for (const id of [...sections.keys()].sort()) {
        const section = sections.get(id);
        children.push(
          <Section
            id={id}
            path={notebookPath}
            onChange={onChange}
            onClickView={onClickView}
            onKeyDown={onKeyDown}
            runGcode={runGcode}
            section={section}
            workspace={workspace}
          />
        );
      }

      return (
        <div
          id={notebookPath}
          classList="notebook notes"
          style={{ overflow: 'auto' }}
        >
          {children}
        </div>
      );
    } catch (error) {
      console.log(error.stack);
      throw error;
    }
  }
}

export default Notebook;
