import React from 'react';
import "./Loading.css";

const Loading = ({loading}) => {

  if (!loading) {
    return (<div></div>);
  }

  return (
    <div className="loading">
      <div>
        <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
        <span className="sr-only">Loading...</span>
      </div>
    </div>);
};

export default Loading;
