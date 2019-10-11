/* global Blob, FileReader, ResizeObserver */

import './codemirror-global';
import 'codemirror/mode/javascript/javascript.js';

import { buildGui, buildGuiControls, buildTrackballControls } from '@jsxcad/convert-threejs/controls';
import { buildMeshes, drawHud } from '@jsxcad/convert-threejs/mesh';
import { buildScene, createResizer } from '@jsxcad/convert-threejs/scene';
import { createService, deleteFile, getFilesystem, listFiles, listFilesystems, log, readFile, setupFilesystem, unwatchFileCreation, watchFile, watchLog, watchFileCreation, watchFileDeletion, writeFile } from '@jsxcad/sys';
import { fromZipToFilesystem, toZipFromFilesystem } from '@jsxcad/convert-zip';

// import CodeMirror from 'codemirror/src/codemirror.js';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import React from 'react';
import ReactDOM from 'react-dom';
import SvgPathEditor from './SvgPathEditor';
import { jsPanel } from 'jspanel4';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

import { Responsive, WidthProvider } from 'react-grid-layout-fabric';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Draggable from 'react-draggable';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import SplitButton from 'react-bootstrap/SplitButton';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

const ResponsiveGridLayout = WidthProvider(Responsive);

class UI extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      items: [],
      nextItem: 0,
    }

    this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onDropKeys = this.onDropKeys.bind(this);
    this.onKeepKeys = this.onKeepKeys.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  addItem (item, options = {}) {
    return this.onAddItem(item, options);
  }

  dropKeys (keys) {
    return this.onDropKeys(keys);
  }

  keepKeys (keys) {
    return this.onKeepKeys(keys);
  }

  onAddItem (item, { key, x = 0, y = 0, width = 3, height = 3, removeable = true } = {}) {
    if (key === undefined) {
      key = this.state.nextItem;
    }

    const removeItem = () => {
      this.dropKeys([key]);
    }

    const addItem = removeable
                    ?  <div key={key} style={{ display: 'block' }} data-grid={{ x, y, w: width, h: height }}>
                         {item}
                         <span style={{position: 'absolute', right: '2px', top: 0, cursor: 'pointer'}} onClick={removeItem}>
                           &#128473;
                         </span>
                       </div>
                    :  <div key={key} style={{ display: 'block' }} data-grid={{ x, y, w: width, h: height }}>
                         {item}
                       </div>;

    this.setState({
      items: [...this.state.items.filter(item => item.key !== key), addItem],
      nextItem: this.state.nextItem + 1
    });
  }

  onDropKeys (keys) {
    this.setState({
      items: [...this.state.items.filter(item => !keys.includes(item.key))],
    });
  }

  onKeepKeys (keys) {
    this.setState({
      items: [...this.state.items.filter(item => keys.includes(item.key))],
    });
  }

  onBreakpointChange (breakpoint, cols) {
    this.setState({ breakpoint, cols });
  }

  onLayoutChange (layout) {
    this.setState({ layout });
  }

  render () {
    return (
      <div>
        <ResponsiveGridLayout onLayoutChange={this.onLayoutChange}
                              onBreakpointChange={this.onBreakpointChange}
                              {...this.props}>
          {this.state.items}
        </ResponsiveGridLayout>
      </div>
    );
  }
}

let panels = new Set();

const buttonStyle = [
  `box-shadow:inset 0px 1px 0px 0px #ffffff;`,
  `background-color:#f9f9f9;`,
  `-moz-border-radius:6px;`,
  `-webkit-border-radius:6px;`,
  `border-radius:6px;`,
  `border:1px solid #dcdcdc;`,
  `display:inline-block;`,
  `cursor:pointer;`,
  `color:black;`,
  `font-family:Arial;`,
  `font-size:15px;`,
  `font-weight:bold;`,
  `padding:6px 24px;`,
  `margin:4px;`,
  `text-decoration:none;`,
  `text-shadow:0px 1px 0px #ffffff;`,
  `align-self: flex-end;`
].join(' ');

let ui;

const installUi = async () => {
  ui = ReactDOM.render(<UI width="100%" height="100%" cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}} breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}>
                       </UI>,
                       document.getElementById('top'));
  return ui;
}

const displayProjectsEntry = (project, index) => {
  const selectProject = async () => {
                          setupFilesystem({ fileBase: project });
                          ui.keepKeys(['console', 'projects', 'project']);
                          await displayProject(project);
                        };
  return (
    <tr key={index}>
      <td>
        {project}
      </td>
      <td>
        <SplitButton size="sm" id="dropdown-basic-button" title="Open" variant="outline-primary" onClick={selectProject}>
          <Dropdown.Item href="#/action-1">View</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Delete</Dropdown.Item>
        </SplitButton>
      </td>
    </tr>
  );
};

const displayProjects = async () => {
  const projects = await (
    <Container style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Projects</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '1 1 auto', overflow: 'auto' }}>
        <Col>
          <Table size='sm'>
            <tbody>
              {(await listFilesystems()).map(displayProjectsEntry)}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Actions</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '0 0 auto' }}>
        <Col onMouseDown={stop} onMouseMove={stop} onMouseUp={stop} style={{ height: '100%' }}>
          <InputGroup>
            <InputGroup.Prepend>
              <Button onClick={newProject} id="projects/new" variant='outline-primary'>New Project</Button>
            </InputGroup.Prepend>
            <FormControl id="projects/new/name" placeholder="Project Name" />
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );

  ui.addItem(projects, { key: 'projects', width: 2, height: 3, removeable: false });
};

let projectOpen = false;

const buildProject = async () => {
  const paths = new Set(await listFiles());

  const handler = (action, file) => {
    switch (action) {
      case 'Delete':
        return async () => deleteFile({}, `file/${file}`);
      case 'Download':
        return async () => downloadFile(`file/${file}`);
      case 'Edit Script':
        return async () => editScript(file);
      case 'Edit SvgPath':
        return async () => editSvgPath(file);
      case 'Run':
        return async () => runScript(file);
      case 'View':
        return async () => viewGeometry(file);
    }
  }

  const build = async () => {
    const buttons = [];
    for (const path of paths) {
      if (!path.startsWith('file/')) {
        continue;
      }
      const file = path.substring(5);
      const todo = [];

      if (paths.has(`geometry/${file}`)) {
        todo.push('View');
      }
      if (path.endsWith('.jsx')) {
        todo.push('Run');
        todo.push('Edit Script');
      }
      if (path.endsWith('.svp')) {
        todo.push('Edit SvgPath');
      }

      todo.push('Download');
      todo.push('Delete');

      const primary = todo.shift();
      const secondary = todo;

      const doPrimary = handler(primary, file);
      const doSecondary = secondary.map(action => handler(action, file));

      if (secondary.length > 0) {
        buttons.push(<tr key={buttons.length}>
                       <td>
                         {file}
                       </td>
                       <td>
                         <SplitButton size="sm" title={primary} variant="outline-primary" onClick={doPrimary}>
                           {secondary.map((label, index) => <Dropdown.Item key={index} onClick={doSecondary[index]}>{label}</Dropdown.Item>)}
                         </SplitButton>
                       </td>
                     </tr>);
      } else {
        buttons.push(<tr key={buttons.length}>
                       <td>
                         {file}
                       </td>
                       <td>
                         <Button size="sm" variant="outline-primary" onClick={doPrimary}>
                           {primary}
                         </Button>
                       </td>
                     </tr>);
      }
    }
    return buttons;
  }

  projectOpen = true;

  const stop = (e) => e.stopPropagation();

  const clickImportProject = () => {
    document.getElementById('project/import').click();
  }

  return await (
    <Container style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Project: {getFilesystem()}</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '1 1 auto', overflow: 'auto' }}>
        <Col>
          <Table size='sm'>
            <tbody>
              {await build()}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Actions</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '0 0 auto' }}>
        <Col onMouseDown={stop} onMouseMove={stop} onMouseUp={stop} style={{ height: '100%' }}>
          <InputGroup>
            <InputGroup.Prepend>
              <Button onClick={newFile} id="project/new" variant='outline-primary'>New File</Button>
            </InputGroup.Prepend>
            <FormControl id="project/new/name" placeholder="File Name" />
          </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <Button onClick={exportProject} variant='outline-primary'>Export</Button>
            </InputGroup.Prepend>
            <FormControl id="project/export/name" placeholder="Zip Name" />
          </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <Button onClick={clickImportProject} id="project/import/button" variant="outline-primary">Import</Button>
            </InputGroup.Prepend>
            <FormControl as="input" type="file" multiple={false} id="project/import" onChange={importProject} style={{ display: 'none' }} />
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
};

const displayProject = async () => {
  const project = await buildProject();
  ui.addItem(project, { key: 'project', width: 2, height: 3 });
};

let console;

// FIX: Rename as log.
const viewConsole = async () => {
  if (console) {
    // Already set up.
    return;
  }

  const key = 'console';

  console = await (
    <Container style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Log</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '1 1 auto', height: '100%', overflow: 'auto' }}>
        <div id='console' style={{ paddingLeft: '20px', width: '100%' }}></div>
      </Row>
    </Container>
  );

  ui.addItem(console, { key, x: 2, width: 5, height: 1, removeable: false });

  const viewerElement = document.getElementById('console');
  watchLog((entry) => {
             const div = viewerElement.appendChild(document.createElement('div'));
             div.appendChild(document.createTextNode(entry));
             div.style.cssText = 'border: 1px solid black; border-radius: 4px; padding: 2px; width: 100%';
             viewerElement.parentNode.scrollTop = viewerElement.parentNode.scrollHeight;
           });
}

const viewGeometry = async (path) => {
  const key = `viewGeometry/${getFilesystem()}/${path}`;

  const viewer = await (
    <Card style={{ height: '100%', overflow: 'hidden', display: 'block'}}>
      <Card.Body style={{ height: '100%', width: '100%', overflow: 'hidden', display: 'block'}}>
        <Card.Title>View: {path}</Card.Title>
        <div id={key}></div>
      </Card.Body>
    </Card>
  );

  ui.addItem(viewer, { key, x: 7, width: 3, height: 3 });

  const container = document.getElementById(key);

  const view = { target: [0, 0, 0], position: [0, 0, 200], up: [0, 1, 0] };
  let datasets = [];
  let threejsGeometry;
  let width = container.offsetWidth;
  let height = container.offsetHeight;
  const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({ width, height, view });
  const { gui } = buildGui({ viewerElement });
  const hudContext = hudCanvas.getContext('2d');
  const render = () => renderer.render(scene, camera);
  const updateHud = () => {
    hudContext.clearRect(0, 0, width, height);
    drawHud({ camera, datasets, threejsGeometry, hudCanvas });
    hudContext.fillStyle = '#FF0000';
  };

  container.appendChild(viewerElement);

  const animate = () => {
    updateHud();
    render();
  };

  const { trackball } = buildTrackballControls({ camera, render: animate, view, viewerElement });

  const { resize } = createResizer({ camera, trackball, renderer, viewerElement });

  resize();
  new ResizeObserver(() => {
    ({ width, height } = resize());
    hudCanvas.width = width;
    hudCanvas.height = height;
  })
      .observe(container);

  const track = () => {
    animate();
    trackball.update();
    window.requestAnimationFrame(track);
  };

  track();

  const geometryPath = `geometry/${path}`;

  const updateGeometry = (geometry) => {
    if (geometry !== undefined) {
      // Delete any previous dataset in the window.
      const controllers = new Set();
      for (const { controller, mesh } of datasets) {
        if (controller) {
          controllers.add(controller);
        }
        scene.remove(mesh);
      }
      for (const controller of controllers) {
        gui.remove(controller.ui);
      }

      threejsGeometry = toThreejsGeometry(geometry);

      // Build new datasets from the written data, and display them.
      datasets = [];

      buildMeshes({ datasets, threejsGeometry, scene });
      buildGuiControls({ datasets, gui });
    }
  };

  const json = await readFile({}, geometryPath);
  updateGeometry(JSON.parse(json));

  watchFile(geometryPath,
            async () => updateGeometry(JSON.parse(await readFile({}, geometryPath))));
};

const downloadFile = async (path) => {
  const data = await readFile({ as: 'bytes' }, path);
  const blob = new Blob([data.buffer], { type: 'application/zip' });
  saveAs(blob, path.split('/').pop());
};

const newFile = async () => {
  const file = document.getElementById('project/new/name').value;
  if (file.length > 0) {
    // FIX: Prevent this from overwriting existing files.
    await writeFile({}, `file/${file}`, '').then(_ => _).catch(_ => _);
  }
};

const newProject = async () => {
  const filesystem = document.getElementById('fs/filesystem/add').value;
  if (filesystem.length > 0) {
    // FIX: Prevent this from overwriting existing filesystems.
    setupFilesystem({ fileBase: filesystem });
    await writeFile({}, 'file/script.jsx', defaultScript);
    ui.dropKeys(['projects']);
    await displayProjects();
    await switchFilesystemview(filesystem);
  }
};

const exportProject = async (path) => {
  const file = document.getElementById('project/export/name').value;
  const data = await toZipFromFilesystem();
  const blob = new Blob([data.buffer], { type: 'application/zip' });
  saveAs(blob, getFilesystem());
};

const importProject = async (e) => {
  const file = document.getElementById('project/import').files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const zip = e.target.result;
    fromZipToFilesystem({}, zip)
      .then(_ => ui.dropKeys(['project']))
      .then(_ => displayProject());
  };
  reader.readAsArrayBuffer(file);
};

let ask;

const getAsk = async () => {
  if (ask === undefined) {
    const agent = async ({ ask, question }) => {
      if (question.readFile) {
        const { options, path } = question.readFile;
        return readFile(options, path);
      } else if (question.writeFile) {
        const { options, path, data } = question.writeFile;
        return writeFile(options, path, data);
      } else if (question.deleteFile) {
        const { options, path } = question.deleteFile;
        return deleteFile(options, path);
      } else if (question.log) {
        const { entry } = question.log;
        return log(entry);
      }
    };

    ({ ask } = await createService({ webWorker: './webworker.js', agent }));
  }

  return ask;
}

const runScript = async (path) => {
  await viewConsole();
  const ask = await getAsk();
  const script = await readFile({}, `file/${path}`);
  const geometry = await ask({ evaluate: script });
  if (geometry) {
    await writeFile({}, 'file/preview', 'preview');
    await writeFile({}, 'geometry/preview', JSON.stringify(geometry));
  }
}

const editScript = async (path) => {
  const key = `editScript/${getFilesystem()}/${path}`;
  const clockId = `${key}/clock`;
  const ask = await getAsk();

  const evaluator = async (script) => {
    // FIX: Use runScript.
    await viewConsole();
    let start = new Date().getTime();
    let runClock = true;
    const clockElement = document.getElementById(clockId);
    const tick = () => {
      if (runClock) {
        setTimeout(tick, 100);
        const duration = new Date().getTime() - start;
        clockElement.textContent = `${(duration / 1000).toFixed(2)}`;
      }
    };
    tick();
    const geometry = await ask({ evaluate: script });
    if (geometry) {
      await writeFile({}, 'file/preview', 'preview');
      await writeFile({}, 'geometry/preview', JSON.stringify(geometry));
    }
    runClock = false;
  };

  const content = await readFile({}, `file/${path}`);
  let updated = content;

  const saveScript = async () => {
    // Save any changes.
    await writeFile({}, `file/${path}`, updated);
    return updated;
  };

  const runScript = async () => {
    const script = await saveScript();
    return evaluator(script);
  };

  const options = {
    // autoRefresh: true,
    autofocus: true,
    mode: 'javascript',
    // theme: 'default',
    // fullScreen: true,
    lineNumbers: true,
    gutter: true,
    lineWrapping: true,
    extraKeys: { 'Shift-Enter': runScript, 'Control-S': saveScript }
  };

  const update = (editor, data, value) => { updated = value; }

  const stop = (e) => e.stopPropagation();

  const editor = await (
    <Container style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Edit Script: {path}</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '1 1 auto', height: '100%' }}>
        <Col onMouseDown={stop} onMouseMove={stop} onMouseUp={stop} style={{ height: '100%' }}>
          <CodeMirror value={content} onChange={update} options={options} style={{ height: '100%' }}>
          </CodeMirror>
        </Col>
      </Row>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <ButtonGroup>
            <Button onClick={runScript} variant='outline-primary'>
              Run <span id={clockId}></span>
            </Button>
            <Button onClick={saveScript} variant='outline-primary'>
              Save
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  );

  ui.addItem(editor, { x: 2, key, width: 5, height: 5 });
};

const editSvgPath = async (path) => {
  const key = `editSvgPath/${getFilesystem()}/${path}`;
  const data = await readFile({}, `file/${path}`);

  const save = async (svgpath) => writeFile({}, `file/${path}`, svgpath);

  const stop = (e) => e.stopPropagation();

  const editor = await (
    <Container style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Edit SvgPath: {path}</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '1 1 auto', overflow: 'auto' }}>
        <Col onMouseDown={stop} onMouseMove={stop} onMouseUp={stop}>
          <SvgPathEditor path={data} onsave={save}/>,
        </Col>
      </Row>
    </Container>
  );

  ui.addItem(editor, { key, x: 2, width: 7, height: 5 });
};

const addFile = () => {
  const file = document.getElementById('fs/file/add').value;
  if (file.length > 0) {
    // FIX: Prevent this from overwriting existing files.
    writeFile({}, `file/${file}`, '').then(_ => _).catch(_ => _);
  }
};

const exportFilesystem = () => {
  toZipFromFilesystem()
      .then(data => new Blob([data.buffer], { type: 'application/zip' }))
      .then(blob => saveAs(blob, getFilesystem()));
};

const importFilesystem = (e) => {
  const file = document.getElementById('fs/filesystem/import').files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const zip = e.target.result;
    fromZipToFilesystem({}, zip).then(_ => _);
  };
  reader.readAsArrayBuffer(file);
};

const defaultScript = `// Circle(10);`;

const addFilesystem = () => {
  const filesystem = document.getElementById('fs/filesystem/add').value;
  if (filesystem.length > 0) {
    // FIX: Prevent this from overwriting existing filesystems.
    setupFilesystem({ fileBase: filesystem });
    writeFile({}, 'file/script.jsx', defaultScript)
        .then(_ => switchFilesystemview(filesystem))
        .catch(_ => _);
  }
};

const editFile = (file) => {
  displayTextEditor(file).then(_ => _).catch(_ => _);
};

export const installFilesystemview = async ({ document, project }) => {
  if (project !== '') {
    await setupFilesystem({ fileBase: project });
  }
  await installUi();
  await displayProjects();
  watchFileCreation(async () => { if (projectOpen) { ui.dropKeys(['project']); await displayProject(); } });
  watchFileDeletion(async () => { if (projectOpen) { ui.dropKeys(['project']); await displayProject(); } });
};
