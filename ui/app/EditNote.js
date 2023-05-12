import * as PropTypes from 'prop-types';

import { CodeJar } from 'codejar';
import React from 'react';

export class EditNote extends React.Component {
  static get propTypes() {
    return {
      note: PropTypes.string,
      notebookPath: PropTypes.string,
      workspace: PropTypes.string,
      onChange: PropTypes.func,
      onKeyDown: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  async componentWillUnmount() {}

  onChange(id, text) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(text, id);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { note, onKeyDown } = this.props;
    const { sourceText } = note;
    return (
      <div
        class="note edit"
        onkeydown={onKeyDown}
        ref={(ref) => {
          if (ref) {
            CodeJar(ref, () => {}).onUpdate((text) =>
              this.onChange(note, text)
            );
          }
        }}
      >
        {sourceText}
      </div>
    );
  }
}

export default EditNote;
