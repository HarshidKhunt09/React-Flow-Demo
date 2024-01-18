import React from 'react';
import DnDFlow from './DnDFlow';

const EditWorkflow = (props) => {
  const { match: { params: { id } = {} } = {} } = props;

  return <DnDFlow id={id} />;
};

export default EditWorkflow;
