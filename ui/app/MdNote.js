import * as PropTypes from 'prop-types';

import React, { createRef } from 'react';

import { marked } from 'marked';
import { useEffect } from 'preact/hooks';

marked.use({
  renderer: {
    code(code, language) {
      if (language === 'mermaid') {
        return '<div class="mermaid">' + code + '</div>';
      } else {
        return '<pre><code>' + code + '</code></pre>';
      }
    },
  },
});

export class MdNote extends React.PureComponent {
  static get propTypes() {
    return {
      note: PropTypes.object,
      selected: PropTypes.boolean,
    };
  }

  render() {
    const { note, selected } = this.props;
    const html = marked(note.md);
    const ref = selected && createRef();
    if (selected) {
      useEffect(() => ref.current.scrollIntoView(true));
    }
    const border = selected ? '1px dashed dodgerblue' : '0px';
    return (
      <div
        ref={ref}
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ border }}
      />
    );
  }
}

export default MdNote;
