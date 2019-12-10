/* global Blob, FileReader, document */

import { fromZipToFilesystem, toZipFromFilesystem } from '@jsxcad/convert-zip';
import { getFilesystem, log } from '@jsxcad/sys';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import React from 'react';
import SettingsUi from './SettingsUi';
import saveAs from 'file-saver';

export class ShareFileUi extends SettingsUi {
  constructor (props) {
    super(props);
    this.state = {
      isPublic: true,
      url: ''
    };
  }

  async export () {
    const path = getFilesystem();
    const zip = await toZipFromFilesystem();
    const blob = new Blob([zip.buffer], { type: 'application/zip' });
    saveAs(blob, path);
    await log({ op: 'text', text: `Exporting ${path} to file`, level: 'serious' });
  }

  getImportId () {
    const { id } = this.props;
    return `ShareFileUi/${id}/import`;
  }

  clickImport () {
    document.getElementById(this.getImportId()).click();
  }

  async import () {
    const fileElement = document.getElementById(this.getImportId());
    const path = fileElement.value;
    const file = fileElement.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const zip = event.target.result;
      await fromZipToFilesystem({}, zip);
      await log({ op: 'text', text: `Imported ${path} from file`, level: 'serious' });
    };
    reader.readAsArrayBuffer(file);
  }

  render () {
    return (
      <Form>
        <Form.Group>
          <FormControl
            as="input"
            type="file"
            multiple={false}
            id={this.getImportId()}
            onChange={() => this.import()}
            style={{ display: 'none' }}
          />
        </Form.Group>
        <ButtonGroup>
          <Button name="import" variant="outline-primary" onClick={() => this.clickImport()}>
            Import
          </Button>
          <Button name="export" variant="outline-primary" onClick={() => this.export()}>
            Export
          </Button>
        </ButtonGroup>
      </Form>
    );
  }
}

export default ShareFileUi;
