import * as PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
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

  onChange(event) {
    const { onChange, note } = this.props;
    if (onChange && this.ref && this.ref.innerText !== note.sourceText) {
      onChange(this.ref.innerText, note);
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.ref === undefined || this.ref.innerText !== nextProps.note.sourceText;
  }

  render() {
    const { note, onKeyDown } = this.props;
    const { sourceText } = note;
    return (
          <Card>
          <pre style={{ padding: '1em', outline: 'none' }} contenteditable onKeyDown={onKeyDown} onInput={(event) => this.onChange(event)}
           ref={(ref) => {
                  if (this.ref === ref) {
                    return;
                  }
                  this.ref = ref;
                  if (ref !== null) {
                    ref.innerText = sourceText;
                  }
                }}>{sourceText}</pre>
                </Card>
    );
  }
}

export default EditNote;
