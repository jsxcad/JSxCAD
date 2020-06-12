// import * as api from '@jsxcad/api-v1';

import { log, read, unwatchFiles, watchFile, write } from "@jsxcad/sys";
// import { toSignature, toSnippet } from './signature';

import AceEditor from "react-ace";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Pane from "./Pane";
import PrismJS from "prismjs/components/prism-core";
import PropTypes from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

import { aceEditorAuxiliary } from "./AceEditorAuxiliary";
import { aceEditorCompleter } from "./AceEditorCompleter";
import { aceEditorSnippetManager } from "./AceEditorSnippetManager";

import { prismJsAuxiliary } from "./PrismJSAuxiliary";

if (!aceEditorAuxiliary) throw Error("die");
if (!prismJsAuxiliary) throw Error("die");

const snippetCompleter = {
  getCompletions: function (editor, session, position, prefix, callback) {
    const { row, column } = position;
    var scopes = ["JSxCAD"];
    var token = session.getTokenAt(row, column);
    var snippetMap = aceEditorSnippetManager.snippetMap;
    var completions = [];
    let isMethod = false;
    {
      const { start } = token;
      const previous = session.getTokenAt(row, start);
      if (previous !== null && previous.value === ".") {
        isMethod = true;
      }
    }
    scopes.forEach(function (scope) {
      var snippets = snippetMap[scope] || [];
      for (var i = snippets.length; i--; ) {
        var s = snippets[i];
        if (s.isMethod) {
          if (!isMethod) {
            continue;
          }
        }
        var caption = s.name;
        if (!caption) {
          continue;
        }
        completions.push({
          caption: caption,
          snippet: s.content,
          meta: s.meta,
          docHTML: s.docHTML,
          type: s.type,
        });
      }
    }, this);
    callback(null, completions);
  },
};

/*
const getSignatures = (api) => {
  const signatures = [];
  for (const name of Object.keys(api)) {
    const value = api[name];
    const string = value.signature;
    if (string !== undefined) {
      signatures.push(toSignature(string));
    }
    for (const name of Object.keys(value)) {
      const property = value[name];
      const string = property.signature;
      if (string !== undefined) {
        signatures.push(toSignature(string));
      }
    }
    if (value.prototype !== undefined) {
      for (const name of Object.keys(value.prototype)) {
        const property = value.prototype[name];
        const string = property.signature;
        if (string !== undefined) {
          signatures.push(toSignature(string));
        }
      }
    }
  }
  return signatures;
};
*/

// const snippets = getSignatures(api).map(toSnippet);

aceEditorCompleter.setCompleters([snippetCompleter]);
// aceEditorSnippetManager.register(snippets, 'JSxCAD');

export class JsEditorUi extends Pane {
  static get propTypes() {
    return {
      ask: PropTypes.func,
      file: PropTypes.string,
      id: PropTypes.string,
      workspace: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.run = this.run.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);
  }

  saveShortcut() {
    return {
      name: "save",
      bindKey: { win: "Ctrl-S", mac: "Command-S" },
      exec: () => this.save(),
    };
  }

  runShortcut() {
    return {
      name: "run",
      bindKey: { win: "Shift-Enter", mac: "Shift-Enter" },
      exec: () => this.run(),
    };
  }

  async run() {
    const { ask, file, workspace } = this.props;
    await this.save();
    await log({ op: "open" });
    await log({ op: "text", text: "Running", level: "serious" });
    let script = await read(file);
    if (script.buffer) {
      script = new TextDecoder("utf8").decode(script);
    }
    await ask({ evaluate: script, workspace, path: file });
  }

  async save() {
    const { file } = this.props;
    const { code = "" } = this.state;
    await write(file, code);
    await log({ op: "text", text: "Saved", level: "serious" });
  }

  async componentDidMount() {
    const { file } = this.props;
    if (file !== undefined) {
      const watcher = await watchFile(`source/${file}`, this.update);
      this.setState({ watcher });
      await this.update();
    }
  }

  async update() {
    const { file } = this.props;
    if (file !== undefined) {
      let code = await read(file);
      if (code.buffer) {
        code = new TextDecoder("utf8").decode(code);
      }
      this.setState({ code });
    }
  }

  async componentWillUnmount() {
    const { watcher } = this.state;

    if (watcher) {
      await unwatchFiles(watcher);
    }
  }

  onValueChange(code) {
    this.setState({ code });
  }

  highlight(code) {
    return PrismJS.highlight(code, PrismJS.languages.js);
  }

  stop(e) {
    e.stopPropagation();
  }

  preventDefault(e) {
    e.preventDefault();
    return false;
  }

  onKeyDown(e) {
    const ENTER = 13;
    const S = 83;
    const SHIFT = 16;
    const CONTROL = 17;

    const key = e.which || e.keyCode || 0;

    switch (key) {
      case CONTROL:
      case SHIFT:
        return true;
    }

    const { ctrlKey, shiftKey } = e;
    switch (key) {
      case ENTER: {
        if (shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          this.run();
          return false;
        }
        break;
      }
      case S: {
        if (ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          this.save();
          return false;
        }
        break;
      }
    }
  }

  renderToolbar() {
    return super.renderToolbar([
      <Nav.Item key="JsEditor/run">
        <Nav.Link onClick={this.run} style={{ color: "blue" }}>
          Run
        </Nav.Link>
      </Nav.Item>,
      <Nav.Item key="JsEditor/save">
        <Nav.Link onClick={this.save} style={{ color: "blue" }}>
          Save
        </Nav.Link>
      </Nav.Item>,
    ]);
  }

  renderPane() {
    const { id } = this.props;
    const { modal, code = "" } = this.state;

    return (
      <Container
        style={{ height: "100%", display: "flex", flexFlow: "column" }}
      >
        <Row style={{ width: "100%", height: "100%", flex: "1 1 auto" }}>
          <Col
            style={{ width: "100%", height: "100%", overflow: "auto" }}
            onKeyDown={this.onKeyDown}
          >
            {modal}
            <AceEditor
              commands={[this.runShortcut(), this.saveShortcut()]}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                // enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                useWorker: false,
              }}
              height="100%"
              highlightActiveLine={true}
              key={id}
              mode="javascript"
              name={id}
              onChange={this.onValueChange}
              showGutter={true}
              showPrintMargin={true}
              theme="github"
              value={code}
              width="100%"
            ></AceEditor>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default JsEditorUi;
