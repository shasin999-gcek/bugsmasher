import React from 'react'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/solarized_light';
import 'brace/theme/xcode';


class Editor extends React.Component {
  render () {
    return (
      <div>
        <div className="editor-header">
          <code>Editor*</code>
        </div>
        <AceEditor
          mode="c"
          theme="solarized_light"
          name="blah2"
          onLoad={this.onLoad}
          onChange={(v) => console.log(v)}
          fontSize={18}
          width="852px"
          height="100px"
          minLines={20}
          maxLines={20}
          enableBasicAutocompletion= {false}
          enableLiveAutocompletion= {false}
          enableSnippets= {false}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            fontFamily:"Inconsolata",
            showLineNumbers: true,
            tabSize: 2
          }}
        />
        <div className="editor-footer">
          <div className="editor-buttons-container">
            <button className="btn btn-success">Submit</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
