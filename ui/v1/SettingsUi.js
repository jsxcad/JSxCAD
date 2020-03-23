import { readFile, writeFile } from '@jsxcad/sys';

import PropTypes from 'prop-types';
import React from 'react';

export class SettingsUi extends React.PureComponent {
  static get propTypes () {
    return {
      onHide: PropTypes.func,
      onSubmit: PropTypes.func,
      storage: PropTypes.string
    };
  }

  constructor (props) {
    super(props);
    this.doHide = this.doHide.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.doUpdate = this.doUpdate.bind(this);
    this.state = {};
  }

  async componentDidMount () {
    const { storage } = this.props;
    const state = await readFile({}, `settings/${storage}`);
    if (state !== undefined) {
      if (state.buffer) {
        this.setState(JSON.parse(new TextDecoder('utf8').decode(state)));
      } else {
        this.setState(state);
      }
    }
  }

  doHide (event) {
    const { onHide } = this.props;
    if (onHide) {
      onHide(this.state);
    }
  }

  async doSubmit (event, payload = {}) {
    const { onSubmit } = this.props;
    this.setState(payload);
    await this.save();
    if (onSubmit) {
      onSubmit(this.state);
    }
    this.doHide();
  }

  doUpdate (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  async save () {
    const { storage } = this.props;
    if (storage) {
      await writeFile({}, `settings/${storage}`, this.state);
    }
  }
}

export default SettingsUi;
