import * as PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import React from 'react';

export class EditNote extends React.Component {
  static get propTypes() {
    return {
      source: PropTypes.string,
      notebookPath: PropTypes.string,
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
    const { onChange, source } = this.props;
    if (onChange && this.ref && this.ref.innerText !== source) {
      onChange(this.ref.innerText);
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.ref === undefined || this.ref.innerText !== nextProps.source;
  }

  render() {
    const { source, onKeyDown } = this.props;
    return (
      <Card>
        <pre
          style={{ padding: '1em', outline: 'none' }}
          contenteditable
          onKeyDown={onKeyDown}
          onInput={(event) => this.onChange(event)}
          ref={(ref) => {
            if (this.ref === ref) {
              return;
            }
            this.ref = ref;
            if (ref !== null) {
              ref.innerText = source;
            }
          }}
        >
          {source}
        </pre>
      </Card>
    );
  }
}

export default EditNote;
