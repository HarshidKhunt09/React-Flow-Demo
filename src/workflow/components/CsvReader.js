import Papa from 'papaparse';
import React, { useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { AppContext } from '../../AppContext';

const CsvReader = ({ data }) => {
  const { dispatch } = useContext(AppContext);

  const handleFileChange = (event) => {
    const file = event?.target?.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          dispatch({
            type: 'SET_CSV_DATA',
            data: result?.data,
          });
          // eslint-disable-next-line no-param-reassign
          data.value = result?.data;
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <div className="node bg-gray-200 p-4 rounded">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable
        className="w-2 h-2"
      />
    </div>
  );
};

export default CsvReader;
