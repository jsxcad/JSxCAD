import Modal from 'react-bootstrap/Modal';
import React from 'react';
import SettingsUi from './SettingsUi';
import ShareFileUi from './ShareFileUi';
import ShareGistUi from './ShareGistUi';
import ShareGithubUi from './ShareGithubUi';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export class ShareUi extends SettingsUi {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.doHide}>
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="repository">
            <Tab eventKey="repository" title="Github">
              <ShareGithubUi storage="share/github" />
            </Tab>
            <Tab eventKey="gist" title="Gist">
              <ShareGistUi storage="share/gist" />
            </Tab>
            <Tab eventKey="file" title="File">
              <ShareFileUi storage="share/file" />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ShareUi;
