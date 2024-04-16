import './Notebook.css';

import * as PropTypes from 'prop-types';

import Accordion from 'react-bootstrap/Accordion';
import AceEditNote from './AceEditNote.js';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ControlNote from './ControlNote.js';
import DownloadNote from './DownloadNote.js';
import ErrorNote from './ErrorNote.js';
import MdNote from './MdNote.js';
import React from 'react';
import Row from 'react-bootstrap/Row';
import ViewNote from './ViewNote.js';

export class Section extends React.PureComponent {
  static get propTypes() {
    return {
      id: PropTypes.string,
      onChange: PropTypes.func,
      onClickView: PropTypes.func,
      onKeyDown: PropTypes.func,
      path: PropTypes.string,
      runGcode: PropTypes.func,
      section: PropTypes.object,
      workspace: PropTypes.string,
    };
  }

  render() {
    try {
      const {
        id,
        path,
        onChange,
        onClickView,
        onKeyDown,
        runGcode,
        section,
        workspace,
      } = this.props;
      const controls = section.controls.map((note) => (
        <ControlNote key={note.hash} note={note} workspace={workspace} />
      ));
      const downloads = section.downloads.map((note) => (
        <DownloadNote
          key={note.hash}
          download={note.download}
          runGcode={runGcode}
          workspace={workspace}
        />
      ));
      const errors = section.errors.map((note, key) => (
        <Card.Body key={key} variant="danger">
          <Card.Text>
            <ErrorNote key={note.hash} note={note} />
          </Card.Text>
        </Card.Body>
      ));
      const mds = section.mds.map((note) => (
        <MdNote key={note.hash} note={note} />
      ));
      const views = section.views.map((note) => (
        <ViewNote
          key={note.hash}
          note={note}
          onClickView={onClickView}
          runGcode={runGcode}
          workspace={workspace}
        />
      ));
      const editor = (
        <AceEditNote
          key={id}
          source={section.source}
          onChange={(code) => {
            if (onChange) {
              return onChange(path, id, code);
            }
          }}
          onKeyDown={onKeyDown}
          workspace={workspace}
        />
      );

      return (
        <Card key={id} onKeyDown={onKeyDown}>
          <Card.Header id={`note-id-${id}`}>{id}</Card.Header>
          {errors}
          <Container>
            <Row>
              {views.map((view, nth) => (
                <Col key={nth}>{view}</Col>
              ))}
              {controls.length > 0 ? (
                <Card>
                  <Card.Body>{controls}</Card.Body>
                </Card>
              ) : (
                []
              )}
              {downloads.length > 0 ? (
                <Card>
                  <Card.Body>{downloads}</Card.Body>
                </Card>
              ) : (
                []
              )}
            </Row>
          </Container>
          <Card.Body>
            {mds}
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="1">
                <Accordion.Header>Code</Accordion.Header>
                <Accordion.Body>{editor}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
        </Card>
      );
    } catch (error) {
      console.log(error.stack);
      throw error;
    }
  }
}

export default Section;
