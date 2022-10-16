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
    const { label, options, type, value } = note.control;
    const ref = selected && createRef();
    if (selected) {
      useEffect(() => ref.current.scrollIntoView(true));
    }
    const border = selected ? '1px dashed dodgerblue' : '0px';
    // TODO: Slider.
    switch (type) {
      case 'check':
        return (
          <InputGroup ref={ref} style={{ border }}>
            <Form.Check label={label} type='checkbox' name={label} checked={value} className="note control check"/>
          </InputGroup>
        );
      case 'input':
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
      case 'select':
        return (
          <InputGroup ref={ref} style={{ border }}>
            <InputGroup.Text>{label}</InputGroup.Text>
            <Form.Control as="select" className="note control select" name={label}>
              {options.map((option, nth) => (<option key={nth} value={option}>{option}</option>))}
            </Form.Control>
          </InputGroup>
        );
      default:
        return (<div ref={ref} style={{ border }}>Unsupported control type</div>);
    }
  }
}

export default ControlNote;
