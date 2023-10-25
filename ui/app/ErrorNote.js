import * as PropTypes from 'prop-types';

import React from 'react';

export class ErrorNote extends React.Component {
  static get propTypes() {
    return {
      note: PropTypes.string,
      notebookPath: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  async componentWillUnmount() {}

  render() {
    const { note } = this.props;
    const { error } = note;
    const { text } = error;
    return (
      <div class="note error">
        <p>{text}</p>
      </div>
    );
  }
}

export default ErrorNote;
