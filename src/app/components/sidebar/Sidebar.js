import React from 'react';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className='description'>
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className='dndnode input'
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default Node
      </div>
      <div
        className='dndnode output'
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </div>
      <div
        className='dndnode input'
        onDragStart={(event) => onDragStart(event, 'uploadCsv')}
        draggable
      >
        Upload CSV
      </div>
      <div
        className='dndnode input'
        onDragStart={(event) => onDragStart(event, 'filter')}
        draggable
      >
        Filter
      </div>
    </aside>
  );
};
