/* global CSS */

import './Notebook.css';

import * as PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import React from 'react';

export class TableOfContents extends React.PureComponent {
  static get propTypes() {
    return {
      notes: PropTypes.object,
    };
  }

  render() {
    try {
      const { notes } = this.props;
      const uniqueIds = new Set();
      for (const note of Object.values(notes)) {
        if (!note.sourceLocation || !note.sourceLocation.id) {
          continue;
        }
        uniqueIds.add(note.sourceLocation.id);
      }
      const ids = [...uniqueIds];
      const compare = (a, b) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      };
      ids.sort(compare);
      const contents = [];
      for (const id of ids) {
        contents.push(
          <Button
            variant="light"
            onClick={() =>
              document
                .querySelector(`#note-id-${CSS.escape(id)}`)
                .scrollIntoView({ behavior: 'smooth' })
            }
          >
            {id}
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
