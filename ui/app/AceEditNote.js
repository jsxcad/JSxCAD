import * as PropTypes from 'prop-types';

import AceEditor from 'react-ace';
import ExtractUrls from 'extract-urls';
import PrismJS from 'prismjs/components/prism-core';
import React from 'react';

import { aceEditorAuxiliary } from './AceEditorAuxiliary';
import { prismJsAuxiliary } from './PrismJSAuxiliary';

if (!aceEditorAuxiliary) throw Error('die');
if (!prismJsAuxiliary) throw Error('die');

export class AceEditNote extends React.PureComponent {
  static get propTypes() {
    return {
      notebookPath: PropTypes.string,
      source: PropTypes.string,
      onChange: PropTypes.func,
      onClickLink: PropTypes.func,
      onKeyDown: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.onValueChange = this.onValueChange.bind(this);
  }

  async componentDidMount() {
    const { editor } = this.aceEditor;

    editor.on('linkClick', ({ token }) => {
      const { value = '' } = token;
      const [url = ''] = ExtractUrls(value) || [];
      if (url) {
        return this.props.onClickLink(url);
      }
      // Match './xxx' and '../xxx'.
      const match = value.match(/^'([.][.]?[/].*)'$/);
      if (match) {
        const uri = new URL(match[1], this.props.notebookPath);
        return this.props.onClickLink(uri.toString());
      }
    });
  }

  async update() {}

  async componentWillUnmount() {}

  onValueChange(data) {
    this.props.onChange(data);
  }

  highlight(data) {
    return PrismJS.highlight(data, PrismJS.languages.js);
  }

  render() {
    try {
      const { source = '' } = this.props;
      return (
        <AceEditor
          ref={(ref) => {
            this.aceEditor = ref;
          }}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableLinking: true,
            useWorker: false,
          }}
          style={{ minHeight: '30rem' }}
          highlightActiveLine={true}
          mode="javascript"
          onChange={this.onValueChange}
          showGutter={true}
          showPrintMargin={true}
          theme="github"
          fontSize={18}
          value={source}
          height="auto"
          width="100%"
          wrapEnabled={true}
        />
      );
    } catch (e) {
      console.log(e.stack);
      throw e;
    }
  }
}

export default AceEditNote;
