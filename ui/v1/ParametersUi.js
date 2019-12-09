import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';

export class ParametersUi extends React.PureComponent {
  static get propTypes () {
    return {
      id: PropTypes.string,
      onChange: PropTypes.func,
      parameters: PropTypes.array,
      project: PropTypes.string
    };
  }

  constructor (props) {
    super(props);

    this.state = {};

    this.renderParameter = this.renderParameter.bind(this);
    this.updateParameterValue = this.updateParameterValue.bind(this);
  }

  updateParameterValue (newParameter, event) {
    const { onChange, parameters } = this.props;
    const value = (event.target.checked === undefined)
      ? event.target.value
      : event.target.checked;

    const updated = [];

    for (const oldParameter of parameters) {
      if (oldParameter.identifier === newParameter.identifier) {
        updated.push({ ...oldParameter, value });
      } else {
        updated.push(oldParameter);
      }
    }

    if (onChange) {
      onChange(updated);
    }
  }

  renderParameter (parameter) {
    const { identifier, prompt, value = '', options = {} } = parameter;
    const { choices } = options;
    const { project } = this.props;
    const label = (prompt || identifier);
    const id = `parameter/${project}/${identifier}`;

    const onChange = (event) => this.updateParameterValue(parameter, event);

    if (choices !== undefined) {
      if (choices.every(choice => [true, false].includes(choice))) {
        return (
          <InputGroup key={id}>
            <Form.Check type="checkbox" key={id} label={label} onChange={onChange}/>
          </InputGroup>
        );
      } else {
        return (
          <InputGroup key={id}>
            <InputGroup.Prepend>
              <InputGroup.Text>{label}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl key={id} as="select" defaultValue={choices[0]} onChange={onChange}>
              {choices.map((choice, index) => <option key={index}>{choice}</option>)}
            </FormControl>
          </InputGroup>
        );
      }
    } else {
      return (
        <InputGroup key={id}>
          <InputGroup.Prepend>
            <InputGroup.Text>{label}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl key={id} id={id} defaultValue={value} onChange={onChange}/>
        </InputGroup>
      );
    }
  }

  render () {
    const { id, parameters } = this.props;

    return (
      <Container
        key={id}
        style={{
          height: '100%',
          display: 'flex',
          flexFlow: 'column',
          padding: '4px',
          border: '1px solid rgba(0,0,0,.125)',
          borderRadius: '.25rem'
        }}
      >
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }}>
          <Col>
            <InputGroup>
              {parameters.map(this.renderParameter)}
            </InputGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ParametersUi;
