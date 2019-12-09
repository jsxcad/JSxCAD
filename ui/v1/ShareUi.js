import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import React from 'react';
import SettingsUi from './SettingsUi';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getFilesystem } from '@jsxcad/sys';

export class ShareUi extends SettingsUi {
  constructor (props) {
    super(props);
    this.state = {
      gistIsPublic: true,
      gistUrl: '',
      githubRepositoryOwner: '',
      githubRepositoryRepository: '',
      githubRepositoryPrefix: `jsxcad/${getFilesystem()}/`
    };
  }

  render () {
    const { githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix } = this.state;
    const { gistIsPublic = true, gistUrl } = this.state;
    return (
      <Modal show={this.props.show} onHide={this.doHide}>
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="repository">
            <Tab eventKey="repository" title="Github">
              <Form>
                <Form.Group>
                  <Form.Label>Owner</Form.Label>
                  <Form.Control name="githubRepositoryOwner" value={githubRepositoryOwner} onChange={this.doUpdate}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Repository</Form.Label>
                  <Form.Control
                    name="githubRepositoryRepository"
                    value={githubRepositoryRepository}
                    onChange={this.doUpdate}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Path Prefix</Form.Label>
                  <Form.Control name="githubRepositoryPrefix" value={githubRepositoryPrefix} onChange={this.doUpdate}/>
                </Form.Group>
                <ButtonGroup>
                  <Button
                    name="import"
                    variant="outline-primary"
                    onClick={(e) => this.doSubmit(e, { action: 'githubRepositoryImport' })}>
                    Import
                  </Button>
                  <Button
                    name="export"
                    variant="outline-primary"
                    onClick={(e) => this.doSubmit(e, { action: 'githubRepositoryExport' })}>
                    Export
                  </Button>
                </ButtonGroup>
              </Form>
            </Tab>
            <Tab eventKey="gist" title="Gist">
              <Form>
                <Form.Group>
                  <Form.Label>Gist Url</Form.Label>
                  <Form.Control name="gistUrl" value={gistUrl} onChange={this.doUpdate}/>
                  <Form.Label>Gist is public?</Form.Label>
                  <Form.Check checked={gistIsPublic} onChange={this.doUpdate}/>
                </Form.Group>
                <ButtonGroup>
                  <Button
                    name="import"
                    variant="outline-primary"
                    onClick={(e) => this.doSubmit(e, { action: 'gistImport' })}>
                    Import
                  </Button>
                  <Button
                    name="export"
                    variant="outline-primary"
                    onClick={(e) => this.doSubmit(e, { action: 'gistExport' })}>
                    Export
                  </Button>
                </ButtonGroup>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ShareUi;
