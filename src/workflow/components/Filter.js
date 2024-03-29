import React, { useContext, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { AppContext } from '../../AppContext';
import { applyFilters } from '../../common/utils';
import CustomSelect from '../../components/CustomSelect';

const options = [
  'select condition',
  'is equal to',
  'is not equal to',
  'includes',
  'does not include',
];

const Filter = ({ id, data, isConnectable }) => {
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
  const [selectedFilter, setSelectedFilter] = useState(
    initialValues?.value?.filter || options?.[0],
  );
  const [userInput, setUserInput] = useState(initialValues?.value?.text || '');

  useEffect(() => {
    if (uniqueKeys?.[0]) {
      setSelectedColumn(uniqueKeys?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleColumnSelect = (selected) => {
    setSelectedColumn(selected);
  };

  const handleFilterSelect = (selected) => {
    setSelectedFilter(selected);
  };

  const handleUserInputChange = (e) => {
    const inputValue = e?.target?.value;
    setUserInput(inputValue);
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
                filter: selectedFilter,
                text: userInput,
              },
            };
          }
          return node;
        }),
      });

      csvData = applyFilters(filteredData, csvData);

      if (selectedColumn && userInput) {
        csvData = csvData?.filter((row) => {
          if (selectedColumn && row?.[selectedColumn]) {
            const value = row[selectedColumn];
            const filterText = userInput;
            switch (selectedFilter) {
              case 'is equal to':
                return value === filterText;
              case 'is not equal to':
                return value !== filterText;
              case 'includes':
                return value.includes(filterText);
              case 'does not include':
                return !value.includes(filterText);
              default:
                return true;
            }
          }
          return true;
        });
      }

      dispatch({
        type: 'SET_CSV_DATA',
        data: csvData,
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
      <h3>Filter</h3>
      <CustomSelect
        label="Column name:"
        options={uniqueKeys}
        selectedOption={selectedColumn}
        onSelect={handleColumnSelect}
      />
      <CustomSelect
        label="Condition:"
        options={options}
        selectedOption={selectedFilter}
        onSelect={handleFilterSelect}
      />
      {selectedFilter !== options?.[0] && (
        <input
          type="text"
          className="border border-gray-300 p-2 mt-2 w-full"
          placeholder="Enter value..."
          value={userInput}
          onChange={handleUserInputChange}
        />
      )}
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
        className="w-2 h-2"
      />
    </div>
  );
};

export default Filter;
