import * as PropTypes from 'prop-types';

import {
  MosaicContext,
  MosaicWindow,
  MosaicWindowContext,
} from 'react-mosaic-component';

import React, { PureComponent } from 'react';

import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';

import { getFilesystem } from '@jsxcad/sys';

export class Pane extends PureComponent {
  static get propTypes() {
    return {
      createNode: PropTypes.func,
      file: PropTypes.string,
      fileTitle: PropTypes.string,
      id: PropTypes.string,
      onSelectView: PropTypes.func,
      path: PropTypes.array,
      view: PropTypes.string,
      viewChoices: PropTypes.array,
      viewTitle: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderToolbar(extra = []) {
    const { id, onSelectView, view, viewChoices, viewTitle } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <Navbar
          key="navbar"
          bg="light"
          expand="sm"
          style={{ flex: '0 0 auto', height: '30px' }}
        >
          <Nav key="select" className="mr-auto">
            {viewChoices.length > 0 ? (
              <NavDropdown
                title={
                  <span style={{ color: 'black' }}>
                    {view === undefined ? 'Select' : viewTitle}
                  </span>
                }
              >
                {viewChoices.map(({ view, viewTitle }, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={() => onSelectView(id, view)}
                  >
                    {viewTitle}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ) : view === undefined ? (
              viewTitle
            ) : (
              <Nav.Item>
                <Nav.Link style={{ color: 'black' }}>{viewTitle}</Nav.Link>
              </Nav.Item>
            )}
            {extra}
          </Nav>
          <Nav key="tools">
            <MosaicWindowContext.Consumer key={`${id}/toolbar`}>
              {({ mosaicWindowActions }) => (
                <Nav.Item>
                  <Nav.Link onClick={() => mosaicWindowActions.split()}>
                    Split
                  </Nav.Link>
                </Nav.Item>
              )}
            </MosaicWindowContext.Consumer>
            <MosaicContext.Consumer>
              {({ mosaicActions }) => (
                <MosaicWindowContext.Consumer>
                  {({ mosaicWindowActions }) => (
                    <Nav.Item>
                      <Nav.Link
                        onClick={() =>
                          mosaicActions.remove(mosaicWindowActions.getPath())
                        }
                      >
                        Close
                      </Nav.Link>
                    </Nav.Item>
                  )}
                </MosaicWindowContext.Consumer>
              )}
            </MosaicContext.Consumer>
          </Nav>
        </Navbar>
      </div>
    );
  }

  renderPane() {
    return [];
  }

  render() {
    const workspace = getFilesystem();
    const { createNode, id, path } = this.props;

    return (
      <MosaicWindow
        key={`window/${workspace}/${id}`}
        createNode={createNode}
        renderToolbar={() => this.renderToolbar()}
        path={path}
      >
        {this.renderPane()}
      </MosaicWindow>
    );
  }
}

export default Pane;
