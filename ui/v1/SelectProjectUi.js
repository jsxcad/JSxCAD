import { listFilesystems, log, setupFilesystem, writeFile } from '@jsxcad/sys';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import React from 'react';
import SettingsUi from './SettingsUi';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const defaultPaneLayout = {
  direction: 'row',
  first: '0',
  second: { direction: 'column', first: '2', second: '3', splitPercentage: 75 }
};

const defaultPaneViews = [
  ['0', { view: 'editScript', file: 'source/script.jsxcad', title: 'Edit script.jsxcad' }],
  ['1', { view: 'geometry', file: 'geometry/preview', title: 'View preview' }],
  ['2', { view: 'notebook', title: 'Notebook' }],
  ['3', { view: 'log', title: 'Log' }]
];

const defaultScript = '// md`# Example`; Circle(10).topView();';

export class SelectProjectUi extends SettingsUi {
  constructor (props) {
    super(props);
    this.state = {};
  }

  async create () {
    const { onSubmit } = this.props;
    const { project } = this.state;

    if (project.length === 0) {
      await log({ op: 'text', text: `Project name is empty`, level: 'serious' });
      return;
    }

    const projects = await listFilesystems();

    if (projects.includes(project)) {
      await log({ op: 'text', text: `Project ${project} already exists`, level: 'serious' });
      return;
    }

    if (project.length > 0) {
      // FIX: Prevent this from overwriting existing filesystems.
      setupFilesystem({ fileBase: project });
      await writeFile({ project }, 'source/script.jsxcad', defaultScript);
      await writeFile({ project }, 'ui/paneLayout', defaultPaneLayout);
      await writeFile({ project }, 'ui/paneViews', defaultPaneViews);
      await log({ op: 'text', text: `Project ${project} created`, level: 'serious' });
      if (onSubmit) {
        onSubmit({ project });
      }
      this.doHide();
    }
  };

  render () {
    const { projects, toast } = this.props;
    const { project = '' } = this.state;

    const rows = [];
    for (let i = 0; i < projects.length; i += 5) {
      rows.push(projects.slice(i, i + 5));
    }
    return (
      <Modal show={this.props.show} onHide={this.doHide} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Project</Modal.Title>
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
            <Tab eventKey="search" title="Search">
            </Tab>
            <Tab eventKey="create" title="Create">
              <Form>
                <Form.Group>
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control name="project" value={project} onChange={this.doUpdate}/>
                </Form.Group>
                <ButtonGroup>
                  <Button name="create" variant="outline-primary" onClick={() => this.create()}>
                    Create Project
                  </Button>
                </ButtonGroup>
              </Form>
            </Tab>
          </Tabs>
          {toast}
        </Modal.Body>
      </Modal>
    );
  }
}

export default SelectProjectUi;
