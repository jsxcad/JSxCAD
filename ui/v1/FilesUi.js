/* global FileReader */

import {
  deleteFile,
  listFiles,
  unwatchFileCreation,
  unwatchFileDeletion,
  watchFileCreation,
  watchFileDeletion,
  write,
} from "@jsxcad/sys";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Pane from "./Pane";
import PropTypes from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

export class FilesUi extends Pane {
  static get propTypes() {
    return {
      id: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.addFile = this.addFile.bind(this);
    this.clickImportFile = this.clickImportFile.bind(this);
    this.importFile = this.importFile.bind(this);
  }

  async componentDidMount() {
    const files = await listFiles();
    const fileUpdater = async () => this.setState({ files: await listFiles() });
    const creationWatcher = await watchFileCreation(fileUpdater);
    const deletionWatcher = await watchFileDeletion(fileUpdater);
    this.setState({ files, creationWatcher, deletionWatcher });
  }

  async componentWillUnmount() {
    const { creationWatcher, deletionWatcher } = this.state;

    await unwatchFileCreation(creationWatcher);
    await unwatchFileDeletion(deletionWatcher);
  }

  async addFile() {
    const file = document.getElementById("source/add/name").value;
    if (file.length > 0) {
      // FIX: Prevent this from overwriting existing files.
      await write(`source/${file}`, "");
    }
  }

  async importFile(e) {
    const { id } = this.props;

    const file = document.getElementById(`source/${id}/import`).files[0];
    const name = document.getElementById(`source/${id}/name`).value;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      write(`source/${name}`, new Uint8Array(data));
    };
    reader.readAsArrayBuffer(file);
  }

  clickImportFile() {
    const { id } = this.props;

    document.getElementById(`source/${id}/import`).click();
  }

  buildFiles() {
    const { files = [] } = this.state;
    return files.map((file) => (
      <InputGroup key={file}>
        <FormControl disabled placeholder={file} />
        <InputGroup.Append>
          <Button
            onClick={() => deleteFile({}, file)}
            variant="outline-primary"
          >
            Delete
          </Button>
        </InputGroup.Append>
      </InputGroup>
    ));
  }

  renderPane() {
    const { id } = this.props;

    return (
      <Container
        key={id}
        style={{
          height: "100%",
          display: "flex",
          flexFlow: "column",
          padding: "4px",
          border: "1px solid rgba(0,0,0,.125)",
          borderRadius: ".25rem",
        }}
      >
        <Row style={{ flex: "1 1 auto", overflow: "auto" }}>
          <Col>
            <InputGroup>
              <FormControl id="source/add/name" placeholder="File Name" />
              <InputGroup.Append>
                <Button onClick={this.addFile} variant="outline-primary">
                  Add
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl
                as="input"
                type="file"
                id={`source/${id}/import`}
                multiple={false}
                onChange={this.importFile}
                style={{ display: "none" }}
              />
              <FormControl id={`source/${id}/name`} placeholder="" />
              <InputGroup.Append>
                <Button
                  onClick={this.clickImportFile}
                  variant="outline-primary"
                >
                  Import
                </Button>
              </InputGroup.Append>
            </InputGroup>
            {this.buildFiles()}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default FilesUi;
