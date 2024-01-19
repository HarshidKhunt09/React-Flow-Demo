import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'uploadCsv')}
        draggable
      >
        Upload CSV
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'filter')}
        draggable
      >
        Filter
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'sort')}
        draggable
      >
        Sort
      </div>
    </aside>
  );
};

export default Sidebar;
