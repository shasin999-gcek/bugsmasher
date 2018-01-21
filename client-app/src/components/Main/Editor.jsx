import React from 'react'

import AceEditor from 'react-ace';

import 'brace/mode/csharp';
import 'brace/theme/solarized_light';
import 'brace/theme/monokai';


class Editor extends React.Component {
  render () {
    const { problems, selectedLevel } = this.props;
    if(problems && selectedLevel > 0) {
      var selectedProblem = problems.find(problem => {
        return problem.info.level === selectedLevel
      });
    }
    var splitPath = selectedProblem.info.file_path.split('/');
    var file_name = splitPath[splitPath.length - 1]

    return (
      <div>
        <div className="editor-header">
          <code>{ file_name }</code>
        </div>
        <AceEditor
          mode="csharp"
          theme="monokai"
          name="blah2"
          onLoad={this.onLoad}
          onChange={(v) => console.log(v)}
          fontSize={18}
          width="803.25px"
          height="100px"
          minLines={20}
          maxLines={23}
          editorProps={{$blockScrolling: true}}
          value={selectedProblem.contents}
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
