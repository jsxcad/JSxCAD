import * as api from '@jsxcad/api-v1';

import { log, readFile, writeFile } from '@jsxcad/sys';
import { toSignature, toSnippet } from './signature';

import AceEditor from 'react-ace';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import PrismJS from 'prismjs/components/prism-core';
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';

import { aceEditorAuxiliary } from './AceEditorAuxiliary';
import { aceEditorCompleter } from './AceEditorCompleter';
import { aceEditorSnippetManager } from './AceEditorSnippetManager';

import { prismJsAuxiliary } from './PrismJSAuxiliary';

if (!aceEditorAuxiliary) throw Error('die');
if (!prismJsAuxiliary) throw Error('die');

const snippetCompleter = {
  getCompletions: function (editor, session, position, prefix, callback) {
    const { row, column } = position;
    var scopes = ['JSxCAD'];
    var token = session.getTokenAt(row, column);
    var snippetMap = aceEditorSnippetManager.snippetMap;
    var completions = [];
    let isMethod = false;
    {
      const { start } = token;
      const previous = session.getTokenAt(row, start);
      if (previous !== null && previous.value === '.') {
        isMethod = true;
      }
    }
    scopes.forEach(function (scope) {
      var snippets = snippetMap[scope] || [];
      for (var i = snippets.length; i--;) {
        var s = snippets[i];
        if (s.isMethod) {
          if (!isMethod) {
            continue;
          }
        }
        var caption = s.name;
        if (!caption) { continue; }
        completions.push({
          caption: caption,
          snippet: s.content,
          meta: s.meta,
          docHTML: s.docHTML,
          type: s.type
        });
      }
    }, this);
    callback(null, completions);
  }
};

/*
const scriptCompleter = {
  getCompletions: (editor, session, position, prefix, callback) => {
    const { row, column } = position;
    let isMethod = false;
    {
      const token = session.getTokenAt(row, column);
      const { type, value, index, start } = token;
      const previous = session.getTokenAt(row, start);
      if (previous.value === '.') {
        isMethod = true;
      }
    }
    if (prefix.length === 0) {
      callback(null, []);
    } else {
      callback(
        null,
        getCompletions(prefix, { isMethod })
            .map(({ completion, source }) =>
              ({
                name: `${completion}(`,
                value: `${completion}(`,
                score: 1,
                meta: source
              })));
    }
  }
};
*/

/*
  {
    guard,
    trigger,
    endTrigger,
    endGuard,
    tabTrigger,
    name
  }
*/

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

const snippets = getSignatures(api).map(toSnippet);

// aceEditorCompleter.setCompleters([scriptCompleter]);
aceEditorCompleter.setCompleters([snippetCompleter]);
aceEditorSnippetManager.register(
  [
    ...snippets
    /*
    {
      name: '.color',
      trigger: '.color',
      isMethod: true,
      content: "color('$" + "{1:name}')",
      meta: 'Shape Method',
      type: 'snippet',
      docHTML: "Shape:color(name)<br><br>Gives the shape the named color.<br><br><i>Circle().color('red')</i>"
    }
*/
  ],
  'JSxCAD');

export class JsEditorUi extends React.PureComponent {
  static get propTypes () {
    return {
      ask: PropTypes.func,
      file: PropTypes.string,
      id: PropTypes.string
    };
  }

  constructor (props) {
    super(props);

    this.state = {
      code: ''
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.run = this.run.bind(this);
    this.save = this.save.bind(this);
  }

  saveShortcut () {
    return {
      name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: () => this.save()
    };
  }

  runShortcut () {
    return {
      name: 'run',
      bindKey: { win: 'Shift-Enter', mac: 'Shift-Enter' },
      exec: () => this.run()
    };
  }

  async run () {
    const { ask, file } = this.props;
    await this.save();
    log({ op: 'open' });
    const script = await readFile({}, file);
    const geometry = await ask({ evaluate: script });
    if (geometry) {
      await writeFile({}, 'geometry/preview', JSON.stringify(geometry));
    }
  }

  async save () {
    const { code } = this.state;
    await writeFile({}, this.props.file, code);
  }

  async componentDidMount () {
    const code = await readFile({}, this.props.file);
    this.setState({ code });
  }

  onValueChange (code) {
    this.setState({ code });
  }

  highlight (code) {
    return PrismJS.highlight(code, PrismJS.languages.js);
  }

  stop (e) {
    e.stopPropagation();
  }

  preventDefault (e) {
    e.preventDefault();
    return false;
  }

  onKeyDown (e) {
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

  render () {
    const { id } = this.props;
    const { code } = this.state;

    return (
      <Container style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }}>
          <Col style={{ width: '100%', height: '100%', overflow: 'auto' }} onKeyDown={this.onKeyDown}>
            <AceEditor
              commands={[this.runShortcut(), this.saveShortcut()]}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                // enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                useWorker: false
              }}
              height='100%'
              highlightActiveLine={true}
              key={id}
              mode="javascript"
              name={id}
              onChange={this.onValueChange}
              showGutter={true}
              showPrintMargin={true}
              theme="github"
              value={code}
              width='100%'
            >
            </AceEditor>
          </Col>
        </Row>
        <Row style={{ flex: '0 0 auto' }}>
          <Col>
            <br/>
            <ButtonGroup>
              <Button size='sm'
                onClick={this.run}
                variant='outline-primary'>
                Run
              </Button>
              <Button size='sm'
                onClick={this.save}
                variant='outline-primary'>
                Save
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default JsEditorUi;
