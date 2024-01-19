import React, { useContext, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { AppContext } from '../../AppContext';
import { applyFilters } from '../../common/utils';

const Slice = ({ id, data, isConnectable }) => {
  const { state, dispatch } = useContext(AppContext);
  const doesExist = state?.connectedNodes?.some(
    (connectedNode) => connectedNode?.id === id,
  );

  const initialValues = state?.connectedNodes?.find((node) => node?.id === id);
  const [fromIndex, setFromIndex] = useState(
    initialValues?.value?.fromIndex || 0,
  );
  const [toIndex, setToIndex] = useState(
    initialValues?.value?.toIndex || state?.csvData?.length,
  );

  // eslint-disable-next-line no-console
  console.log(initialValues?.value?.fromIndex);

  useEffect(() => {
    if (doesExist && data?.connectedNodes) {
      setToIndex(state?.csvData?.length.toString());
    } else {
      setToIndex('0');
    }
  }, [data?.connectedNodes?.length]);

  const handleFromIndexChange = (e) => {
    const inputValue = e?.target?.value;
    setFromIndex(inputValue);

    if (state?.connectedNodes?.length > 0) {
      const idIndex = state?.connectedNodes?.findIndex(
        (node) => node?.id === id,
      );
      const filteredData = state?.connectedNodes?.slice(1, idIndex);
      let csvData = [...(state?.connectedNodes?.[0]?.value || [])];
      dispatch({
        type: 'SET_CONNECTED_NODES',
        data: state?.connectedNodes?.map((node) => {
          if (node?.id === id) {
            return {
              ...node,
              value: {
                fromIndex: parseInt(e?.target?.value || 0, 10),
                toIndex: parseInt(toIndex, 10),
              },
            };
          }
          return node;
        }),
      });

      csvData = applyFilters(filteredData, csvData);

      if (e?.target?.value) {
        csvData = csvData?.slice(
          parseInt(e?.target?.value || 0, 10),
          parseInt(toIndex, 10),
        );
      }

      dispatch({
        type: 'SET_CSV_DATA',
        data: csvData,
      });
    }
  };

  const handleToIndexChange = (e) => {
    const inputValue = e?.target?.value;
    setToIndex(inputValue);

    if (state?.connectedNodes?.length > 0) {
      const idIndex = state?.connectedNodes?.findIndex(
        (node) => node?.id === id,
      );
      const filteredData = state?.connectedNodes?.slice(1, idIndex);
      let csvData = [...(state?.connectedNodes?.[0]?.value || [])];
      dispatch({
        type: 'SET_CONNECTED_NODES',
        data: state?.connectedNodes?.map((node) => {
          if (node?.id === id) {
            return {
              ...node,
              value: {
                fromIndex: parseInt(fromIndex, 10),
                toIndex: parseInt(e?.target?.value || 0, 10),
              },
            };
          }
          return node;
        }),
      });

      csvData = applyFilters(filteredData, csvData);

      if (e?.target?.value) {
        csvData = csvData?.slice(
          parseInt(fromIndex, 10),
          parseInt(e?.target?.value || 0, 10),
        );
      }

      dispatch({
        type: 'SET_CSV_DATA',
        data: csvData || [],
      });
    }
  };

  return (
    <div className="node bg-gray-200 p-4 rounded min-w-[250px]">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <h3>Slice</h3>
      <div>
        <input
          type="number"
          className="border border-gray-300 p-2 mt-2 w-full"
          placeholder="Enter From Index"
          value={fromIndex}
          onChange={handleFromIndexChange}
        />
      </div>
      <div>
        <input
          type="number"
          className="border border-gray-300 p-2 mt-2 w-full"
          placeholder="Enter To Index"
          value={toIndex}
          onChange={handleToIndexChange}
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
    </div>
  );
};

export default Slice;
