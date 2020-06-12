import { listFilesystems, log, setupFilesystem, write } from "@jsxcad/sys";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import React from "react";
import SettingsUi from "./SettingsUi";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const defaultPaneLayout = {
  direction: "row",
  first: "0",
  second: { direction: "column", first: "2", second: "3", splitPercentage: 75 },
};

const defaultPaneViews = [
  [
    "0",
    {
      view: "editScript",
      file: "source/script.jsxcad",
      title: "Edit script.jsxcad",
    },
  ],
  ["1", { view: "geometry", file: "geometry/preview", title: "View preview" }],
  ["2", { view: "notebook", title: "Notebook" }],
  ["3", { view: "log", title: "Log" }],
];

const defaultScript = "// md`# Example`; Circle(10).topView();";

export class SelectWorkspaceUi extends SettingsUi {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async create() {
    const { onSubmit } = this.props;
    const { workspace } = this.state;

    if (workspace.length === 0) {
      await log({
        op: "text",
        text: `Workspace name is empty`,
        level: "serious",
      });
      return;
    }

    const workspaces = await listFilesystems();

    if (workspaces.includes(workspace)) {
      await log({
        op: "text",
        text: `Workspace ${workspace} already exists`,
        level: "serious",
      });
      return;
    }

    if (workspace.length > 0) {
      // FIX: Prevent this from overwriting existing filesystems.
      setupFilesystem({ fileBase: workspace });
      await write("source/script.jsxcad", defaultScript);
      await write("ui/paneLayout", defaultPaneLayout);
      await write("ui/paneViews", defaultPaneViews);
      await log({
        op: "text",
        text: `Workspace ${workspace} created`,
        level: "serious",
      });
      if (onSubmit) {
        onSubmit({ workspace });
      }
      this.doHide();
    }
  }

  render() {
    const { workspaces, toast } = this.props;
    const { workspace = "" } = this.state;

    const rows = [];
    for (let i = 0; i < workspaces.length; i += 5) {
      rows.push(workspaces.slice(i, i + 5));
    }
    return (
      <Modal show={this.props.show} onHide={this.doHide} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="local" style={{ display: "flex" }}>
            <Tab eventKey="local" title="Local">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {workspaces.map((workspace, index) => (
                  <Card
                    tag="a"
                    key={index}
                    style={{ width: "196px", height: "128" }}
                    onClick={(e) =>
                      this.doSubmit(e, { action: "selectWorkspace", workspace })
                    }
                  >
                    <Card.Body>
                      <Card.Title>{workspace}</Card.Title>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>
            <Tab eventKey="search" title="Search"></Tab>
            <Tab eventKey="create" title="Create">
              <Form>
                <Form.Group>
                  <Form.Label>Workspace Name</Form.Label>
                  <Form.Control
                    name="workspace"
                    value={workspace}
                    onChange={this.doUpdate}
                  />
                </Form.Group>
                <ButtonGroup>
                  <Button
                    name="create"
                    variant="outline-primary"
                    onClick={() => this.create()}
                  >
                    Create Workspace
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

export default SelectWorkspaceUi;
