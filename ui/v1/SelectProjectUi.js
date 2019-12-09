import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import React from 'react';
import SettingsUi from './SettingsUi';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export class SelectProjectUi extends SettingsUi {
  constructor (props) {
    super(props);
    this.state = {};
  }

  // <Card.Img variant="top" src="holder.js/100px160" />
  render () {
    const { projects } = this.props;
    const rows = [];
    for (let i = 0; i < projects.length; i += 5) {
      rows.push(projects.slice(i, i + 5));
    }
    return (
      <Modal show={this.props.show} onHide={this.doHide} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Select Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="local" style={{ display: 'flex' }}>
            <Tab eventKey="local" title="Local">
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {projects.map((project, index) =>
                  <Card tag="a"
                    key={index} style={{ width: '196px', height: '128' }}
                    onClick={(e) => this.doSubmit(e, { action: 'selectProject', project })}>
                    <Card.Body>
                      <Card.Title>{project}</Card.Title>
                    </Card.Body>
                  </Card>)}
              </div>
            </Tab>
            <Tab eventKey="githubRepository" title="Github">
            </Tab>
            <Tab eventKey="newProject" title="New Project">
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  }
}

export default SelectProjectUi;
