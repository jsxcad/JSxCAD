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
    const { blur, control } = note;
    const { label, options, type, value } = control;
    const ref = selected && createRef();
    if (selected) {
      useEffect(() => ref.current.scrollIntoView(true));
    }
    const border = selected ? '1px dashed dodgerblue' : '0px';
    // TODO: Slider.
    switch (type) {
      case 'check':
        return (
          <InputGroup ref={ref} style={{ border, opacity: blur ? 0.5 : 1 }}>
            <Form.Check
              label={label}
              type="checkbox"
              name={label}
              checked={value}
              className={`note control check ${blur ? 'disabled' : 'enabled'}`}
            />
          </InputGroup>
        );
      case 'input':
        return (
          <InputGroup ref={ref} style={{ border, opacity: blur ? 0.5 : 1 }}>
            <InputGroup.Text>{label}</InputGroup.Text>
            <Form.Control
              className={`note control input ${blur ? 'disabled' : 'enabled'}`}
              value={value}
              name={label}
            />
          </InputGroup>
        );
      case 'select':
        return (
          <InputGroup ref={ref} style={{ border, opacity: blur ? 0.5 : 1 }}>
            <InputGroup.Text>{label}</InputGroup.Text>
            <Form.Control
              as="select"
              className={`note control select ${blur ? 'disabled' : 'enabled'}`}
              name={label}
            >
              {options.map((option, nth) => (
                <option key={nth} value={option} selected={option === value}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </InputGroup>
        );
      default:
        return (
          <div ref={ref} style={{ border, opacity: blur ? 0.5 : 1 }}>
            Unsupported control type
          </div>
        );
    }
  }
}

export default ControlNote;
