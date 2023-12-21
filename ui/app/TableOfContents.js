/* global CSS */

import './Notebook.css';

import * as PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import React from 'react';

export class TableOfContents extends React.PureComponent {
  static get propTypes() {
    return {
      path: PropTypes.string,
      sections: PropTypes.object,
      state: PropTypes.object,
      version: PropTypes.string,
    };
  }

  render() {
    try {
      const { path, sections, state } = this.props;
      const contents = [];
      for (const id of [...sections.keys()].sort()) {
        const color = state[`${path}/${id}`] === 'running' ? 'red' : 'black';
        const fontWeight =
          state[`${path}/${id}`] === 'running' ? 'bold' : undefined;
        contents.push(
          <Button
            variant="light"
            onClick={() =>
              document
                .querySelector(`#note-id-${CSS.escape(id)}`)
                .scrollIntoView({ behavior: 'smooth' })
            }
          >
            <span style={{ color, fontWeight }}> {id} </span>
          </Button>
        );
      }
      return (
        <ButtonGroup vertical style={{ width: '100%', overflow: 'auto' }}>
          {contents}
        </ButtonGroup>
      );
    } catch (error) {
      console.log(error.stack);
      throw error;
    }
  }
}

export default TableOfContents;
