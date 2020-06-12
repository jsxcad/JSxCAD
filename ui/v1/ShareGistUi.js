import { getFilesystem, log } from "@jsxcad/sys";
import { readWorkspace, writeWorkspace } from "./gist";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import React from "react";
import SettingsUi from "./SettingsUi";

export class ShareGistUi extends SettingsUi {
  constructor(props) {
    super(props);
    this.state = {
      isPublic: true,
      url: "",
    };
  }

  async export() {
    const { isPublic = true } = this.state;
    const workspace = getFilesystem();
    const url = await writeWorkspace({ workspace, isPublic });
    if (url === undefined) {
      log({
        op: "text",
        text: `Failed to create gist`,
        level: "serious",
        duration: 1000,
      });
      return;
    }
    log({
      op: "text",
      text: `Created gist at ${url}`,
      level: "serious",
      duration: 1000,
    });
    this.setState({ url });
    this.save();
  }

  async import() {
    const { url } = this.state;
    const workspace = getFilesystem();
    // url = "https://gist.github.com/1d149ad00efd67c5b362b5cd97d2c86d"
    const match = url.match(/https:\/\/gist.github.com\/(.*)/);
    if (!match || !match[1]) {
      return;
    }
    const gistId = match[1];
    await readWorkspace(gistId, { workspace });
    log({
      op: "text",
      text: `Read gist from ${url}`,
      level: "serious",
      duration: 1000,
    });
  }

  render() {
    const { isPublic = true, url } = this.state;
    return (
      <Form>
        <Form.Group>
          <Form.Label>Gist Url</Form.Label>
          <Form.Control name="url" value={url} onChange={this.doUpdate} />
          <Form.Label>Gist is public?</Form.Label>
          <Form.Check
            name="isPublic"
            checked={isPublic}
            onChange={this.doUpdate}
          />
        </Form.Group>
        <ButtonGroup>
          <Button
            name="import"
            variant="outline-primary"
            disabled={url === ""}
            onClick={() => this.import()}
          >
            Import
          </Button>
          <Button
            name="export"
            variant="outline-primary"
            onClick={() => this.export()}
          >
            Export
          </Button>
        </ButtonGroup>
      </Form>
    );
  }
}

export default ShareGistUi;
