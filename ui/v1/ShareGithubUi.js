import { getFilesystem, listFiles, log, read } from '@jsxcad/sys';
import { readWorkspace, writeWorkspace } from './github';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import React from 'react';
import SettingsUi from './SettingsUi';

export class ShareGithubUi extends SettingsUi {
  constructor (props) {
    super(props);
    this.state = {
      owner: '',
      repository: '',
      prefix: `jsxcad/${getFilesystem()}/`
    };

    this.doExport = this.doExport.bind(this);
    this.doImport = this.doImport.bind(this);
  }

  async doExport (event, payload) {
    const { owner, repository, prefix } = this.state;
    const files = [];
    for (const file of await listFiles()) {
      if (file.startsWith('source/')) {
        files.push([file, await read(file)]);
      }
    }
    if (await writeWorkspace(owner, repository, prefix, files, { overwrite: false })) {
      await log({ op: 'text', text: 'Successfully wrote to github repository', level: 'serious' });
    } else {
      await log({ op: 'text', text: 'Failed to write to github repository', level: 'serious' });
    }
    this.save();
  }

  async doImport (event, payload) {
    const { owner, repository, prefix } = this.state;
    if (await readWorkspace(owner, repository, prefix, { overwrite: false })) {
      await log({ op: 'text', text: 'Successfully read from github repository', level: 'serious' });
    } else {
      await log({ op: 'text', text: 'Failed to read from github repository', level: 'serious' });
    }
    this.save();
  }

  render () {
    const { owner, repository, prefix } = this.state;
    return (
      <Form>
        <Form.Group>
          <Form.Label>Owner</Form.Label>
          <Form.Control name="owner" value={owner} onChange={this.doUpdate}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Repository</Form.Label>
          <Form.Control
            name="repository"
            value={repository}
            onChange={this.doUpdate}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Path Prefix</Form.Label>
          <Form.Control name="prefix" value={prefix} onChange={this.doUpdate}/>
        </Form.Group>
        <ButtonGroup>
          <Button
            name="import"
            variant="outline-primary"
            onClick={(e) => this.doImport(e, { action: 'repositoryImport' })}>
            Import
          </Button>
          <Button
            name="export"
            variant="outline-primary"
            onClick={(e) => this.doExport(e, { action: 'repositoryExport' })}>
            Export
          </Button>
        </ButtonGroup>
      </Form>
    );
  }
}

export default ShareGithubUi;
