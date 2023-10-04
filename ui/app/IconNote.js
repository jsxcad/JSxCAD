import * as PropTypes from 'prop-types';

import React from 'react';

export class IconNote extends React.PureComponent {
  static get propTypes() {
    return {
      note: PropTypes.object,
    };
  }

  render() {
    const { note } = this.props;
    const { blur = false, view } = note;
    const { viewId } = view;
    const iconIdClass = viewId ? `iconId_${viewId}` : '';
    if (!note.url) {
      return <span></span>;
    }
    return (
      <img
        class={`note icon ${iconIdClass}`}
        style={{
          height: '32px',
          width: '32px',
          opacity: blur ? 0.5 : 1,
        }}
        src={note.url}
      />
    );
  }
}

export default IconNote;
