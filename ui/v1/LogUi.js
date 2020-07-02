import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Pane from './Pane.js';
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';

export class LogUi extends Pane {
  static get propTypes() {
    return {
      id: PropTypes.string,
      log: PropTypes.array,
    };
  }

  renderPane() {
    const { id } = this.props;
    return (
      <Container
        key={id}
        style={{
          height: '100%',
          display: 'flex',
          flexFlow: 'column',
          padding: '4px',
          border: '1px solid rgba(0,0,0,.125)',
          borderRadius: '.25rem',
        }}
      >
        <Row style={{ flex: '1 1 auto', height: '100%', overflow: 'auto' }}>
          <Col>
            {this.props.log
              .filter((entry) => entry.op === 'text')
              .map((entry, index) => (
                <div
                  key={index}
                  style={{
                    padding: '4px',
                    border: '1px solid rgba(0,0,0,.125)',
                    borderRadius: '.25rem',
                  }}
                >
                  {entry.text}
                </div>
              ))}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LogUi;
