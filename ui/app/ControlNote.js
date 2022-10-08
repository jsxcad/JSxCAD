import * as PropTypes from 'prop-types';

import React, { createRef } from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useEffect } from 'preact/hooks';

export class ControlNote extends React.PureComponent {
  static get propTypes() {
    return {
      note: PropTypes.object,
      selected: PropTypes.boolean,
    };
  }

  render() {
    const { note, selected } = this.props;
    const { label, value } = note.control;
    const ref = selected && createRef();
    if (selected) {
      useEffect(() => ref.current.scrollIntoView(true));
    }
    const border = selected ? '1px dashed dodgerblue' : '0px';
    return (
      <InputGroup ref={ref} style={{ border }}>
        <InputGroup.Text>{label}</InputGroup.Text>
        <Form.Control
          className="note control input"
          value={value}
          name={label}
        />
      </InputGroup>
    );
  }
}

export default ControlNote;
