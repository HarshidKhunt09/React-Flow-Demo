import React, { useContext } from 'react';
import Papa from 'papaparse';
import { Handle, Position } from 'reactflow';
import { AppContext } from '../../AppContext';

const CsvReader = ({ data }) => {
  const { dispatch } = useContext(AppContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          // data.setCsvData(result.data);
          dispatch({
            type: 'SET_CSV_DATA',
            data: result.data,
          });
          data.value = result.data;
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <div>
      <input type='file' accept='.csv' onChange={handleFileChange} />
      <Handle
        type='source'
        position={Position.Bottom}
        id='b'
        isConnectable={true}
      />
    </div>
  );
};

export default CsvReader;
