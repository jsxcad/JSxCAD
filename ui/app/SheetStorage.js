/* global google */

import {
  onBoot,
  read,
  unwatchFileChange,
  unwatchFileDeletion,
  watchFileChange,
  watchFileDeletion,
  write,
} from '@jsxcad/sys';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { signal } from '@preact/signals';

const isSourcePath = (path) => path.startsWith('source/');
const utf8Decoder = new TextDecoder('utf8');

export class SheetStorage {
  constructor(id) {
    const [spreadsheetId, sheetName] = id.split(':');
    this.accessToken = null;
    this.clientId =
      '532457183798-jsvfmkqg8bo4p6evpus34mnij9ac3v9i.apps.googleusercontent.com';
    this.fileChangeWatcher = null;
    this.filedDeletionWatcher = null;
    this.index = null;
    this.scope = 'https://www.googleapis.com/auth/spreadsheets';
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
    this.tokenClient = null;

    this.setupWatchers();
  }

  destroy() {
    if (this.fileChangeWatcher) {
      unwatchFileChange(this.fileChangeWatcher);
      this.fileChangeWatcher = null;
    }
    if (this.fileDeletionWatcher) {
      unwatchFileDeletion(this.fileDeletionWatcher);
      this.filedDeletionWatcher = null;
    }
  }

  async setupWatchers() {
    this.fileChangeWatcher = await watchFileChange(async (path, workspace) => {
      if (!isSourcePath(path)) {
        return;
      }
      const data = await read(path, { workspace });
      return this.setPath(path, utf8Decoder.decode(data));
    });

    this.fileDeletionWatcher = await watchFileDeletion(
      async (path, workspace) => {
        if (!isSourcePath(path)) {
          return;
        }
        return this.deletePath(path);
      }
    );
  }

  getTokenClient() {
    if (!this.tokenClient) {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: this.scope,
      });
    }
    return this.tokenClient;
  }

  noteAccessTokenExpiry() {
    this.accessToken = null;
  }

  getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }
    return new Promise((resolve, reject) => {
      const client = this.getTokenClient();
      client.callback = (response) => {
        if (response.access_token) {
          this.accessToken = response.access_token;
          resolve(this.accessToken);
        } else {
          reject(new Error(`getAccessToken: failed`));
        }
      };
      client.requestAccessToken();
    });
  }

  toValueRangeFromRow(row) {
    return `${this.sheetName}!B${row}:B${row}`;
  }

  toKeyValueRangeFromRow(row) {
    return `${this.sheetName}!A${row}:B${row}`;
  }

  async toRowFromPath(path) {
    return (await this.getIndex()).get(path);
  }

  async toRangeFromPath(path) {
    return this.toValueRangeFromRow(await this.toRowFromPath(path));
  }

  async getIndex() {
    if (!this.index) {
      const { values } = await this.getRange(`${this.sheetName}!A:A`);
      this.index = new Map();
      for (let nth = 0; nth < values.length; nth++) {
        if (values[nth][0].length === 0) {
          // Deleted entries have an empty path.
          continue;
        }
        // Note that sheets are 1 based.
        this.index.set(values[nth][0], nth + 1);
      }
    }
    return this.index;
  }

  async addIndexValue(path, value) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.sheetName}!A:B:append?valueInputOption=RAW`;
    const values = [[path, value]];
    const body = JSON.stringify({ values });
    for (let attempt = 0; attempt < 10; attempt++) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      if (response.ok) {
        const { updates } = await response.json();
        const { updatedRange } = updates;
        // Extract the last number from updatedRange.
        const regex = /\d+$/;
        const match = updatedRange.match(regex);
        const row = match ? parseInt(match[0], 10) : null;
        // Update the index.
        this.index.set(path, row);
        // And we are done.
        return value;
      }
      if (response.status === 401) {
        this.noteAccessTokenExpiry();
        continue;
      }
      throw new Error(`getRange: ${response.statusText}`);
    }
    throw new Error(`getRange: too many attempts`);
  }

  async getRange(range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}`;
    for (let attempt = 0; attempt < 10; attempt++) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      });
      if (response.ok) {
        return response.json();
      }
      if (response.status === 401) {
        this.noteAccessTokenExpiry();
        continue;
      }
      throw new Error(`getRange: ${response.statusText}`);
    }
    throw new Error(`getRange: too many attempts`);
  }

  async getPath(path) {
    return this.getRange(await this.toRangeFromPath(path));
  }

  getRow(row) {
    return this.getRange(this.toValueRangeFromRow(row));
  }

  async setRange(range, values) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?valueInputOption=RAW`;

    const body = JSON.stringify({ range, values });

    for (let attempt = 0; attempt < 10; attempt++) {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      if (response.ok) {
        return response.json();
      }
      if (response.status === 401) {
        this.noteAccessTokenExpiry();
        continue;
      }
      throw new Error(`setRow: ${response.statusText}`);
    }
    throw new Error(`setRow: too many attempts`);
  }

  async setRow(row, values) {
    return this.setRange(this.toValueRangeFromRow(row), [values]);
  }

  async setPath(path, value) {
    const row = await this.toRowFromPath(path);
    if (row) {
      return this.setRange(this.toValueRangeFromRow(row), [[value]]);
    } else {
      // The path isn't in the index -- we'll need to append it.
      return this.addIndexValue(path, value);
    }
  }

  async deletePath(path, value) {
    const row = await this.toRowFromPath(path);
    if (row) {
      this.index.delete(path);
      return this.setRange(this.toKeyValueRangeFromRow(row), [['', '']]);
    }
  }
}

class Config {
  constructor(path, defaultValue = '') {
    this.defaultValue = defaultValue;
    this.path = path;
    this.signal = signal(defaultValue);
    if (this.path) {
      onBoot(async () => {
        this.signal.value = await read(this.path);
      });
    }
  }

  get() {
    return this.signal.value;
  }

  set(value) {
    if (this.path) {
      write(this.path, value);
    }
    this.signal.value = value;
  }
}

const id = new Config('config/SheetStorage:id', '');

const sheetStorageRegistry = new Map();

export const getSheetStorage = (spreadsheetId) => {
  if (!spreadsheetId || spreadsheetId === '') {
    return;
  }
  if (!sheetStorageRegistry.has(spreadsheetId)) {
    sheetStorageRegistry.set(spreadsheetId, new SheetStorage(spreadsheetId));
  }
  return sheetStorageRegistry.get(spreadsheetId);
};

export const removeSheetStorage = async (spreadsheetId) => {
  if (!spreadsheetId || spreadsheetId === '') {
    return;
  }
  await getSheetStorage(spreadsheetId).destroy();
  sheetStorageRegistry.delete(spreadsheetId);
};

export const updateSheetStorage = async (newId) => {
  const oldId = await id.get();
  if (oldId === newId) {
    return;
  }
  removeSheetStorage(oldId);
  id.set(newId);
  return getSheetStorage(newId);
};

export const render = () => (
  <Card>
    <Card.Body>
      <Card.Title>Sheet Filesystem</Card.Title>
      <Card.Text>
        Select a google sheets spreadsheet to backup and share source data.
        e.g., to access a sheet named &quot;Jot&quot; in
        &quot;https://docs.google.com/spreadsheets/d/10VT5U3JR28We0WTtIIzccGnMdF4zIcdLqGZwEv2A5Hg/edit?gid=0&quot;.
        use &quot;0VT5U3JR28We0WTtIIzccGnMdF4zIcdLqGZwEv2A5Hg:Jot&quot;
      </Card.Text>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="SheetStorageId">
              <Form.Control
                placeholder="Google-Spreadsheet-Id:SheetName"
                value={id.get()}
              />
            </Form.Group>
          </Col>
          <Col>
            <Button
              variant="primary"
              onClick={() => {
                const { value } = document.getElementById('SheetStorageId');
                updateSheetStorage(value);
              }}
            >
              Update Sheet Storage
            </Button>
          </Col>
        </Row>
      </Form>
    </Card.Body>
  </Card>
);
