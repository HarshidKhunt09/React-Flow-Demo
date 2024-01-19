import React, { useContext, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { AppContext } from '../../AppContext';
import { applyFilters } from '../../common/utils';
import CustomSelect from '../../components/CustomSelect';

const options = ['select condition', 'ascending', 'descending'];

const Sort = ({ id, data, isConnectable }) => {
  const { state, dispatch } = useContext(AppContext);
  const doesExist = state?.connectedNodes?.some(
    (connectedNode) => connectedNode?.id === id,
  );
  const keys =
    doesExist &&
    state?.connectedNodes?.[0]?.value &&
    Array.isArray(state?.connectedNodes?.[0]?.value)
      ? state?.connectedNodes?.[0]?.value?.reduce(
          (acc, obj) => acc?.concat(Object?.keys(obj)),
          [],
        )
      : [];

  const uniqueKeys = Array.from(new Set(keys));

  const initialValues = state?.connectedNodes?.find((node) => node?.id === id);
  const [selectedColumn, setSelectedColumn] = useState(
    initialValues?.value?.column || uniqueKeys?.[0],
  );
  const [selectedOrder, setSelectedOrder] = useState(
    initialValues?.value?.order || options?.[0],
  );

  useEffect(() => {
    if (uniqueKeys?.[0]) {
      setSelectedColumn(uniqueKeys?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleColumnSelect = (selected) => {
    setSelectedColumn(selected);
  };

  const handleSortSelect = (selected) => {
    setSelectedOrder(selected);
  };

  const handleFilter = () => {
    if (state?.connectedNodes?.length > 0 && selectedColumn) {
      const idIndex = state?.connectedNodes?.findIndex(
        (node) => node?.id === id,
      );
      const filteredData = state?.connectedNodes?.slice(1, idIndex);
      let csvData = [...state?.connectedNodes?.[0]?.value];

      dispatch({
        type: 'SET_CONNECTED_NODES',
        data: state?.connectedNodes?.map((node) => {
          if (node?.id === id) {
            return {
              ...node,
              value: {
                column: selectedColumn,
                order: selectedOrder,
              },
            };
          }
          return node;
        }),
      });

      csvData = applyFilters(filteredData, csvData);

      if (selectedColumn) {
        csvData = csvData?.sort((a, b) => {
          const valueA = a?.[selectedColumn];
          const valueB = b?.[selectedColumn];

          if (selectedOrder === 'ascending') {
            if (valueA < valueB) {
              return -1;
            }
            if (valueA > valueB) {
              return 1;
            }
            return 0;
          }
          if (selectedOrder === 'descending') {
            if (valueA > valueB) {
              return -1;
            }
            if (valueA < valueB) {
              return 1;
            }
            return 0;
          }

          return 0;
        });
      }

      dispatch({
        type: 'SET_CSV_DATA',
        data: csvData,
      });
    }
  };

  return (
    <div className="node bg-gray-200 p-4 rounded">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <h3>Sort</h3>
      <CustomSelect
        label="Column name:"
        options={uniqueKeys}
        selectedOption={selectedColumn}
        onSelect={handleColumnSelect}
      />
      <CustomSelect
        label="Condition:"
        options={options}
        selectedOption={selectedOrder}
        onSelect={handleSortSelect}
      />
      <div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-2 rounded"
          onClick={handleFilter}
        >
          Run
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default Sort;
