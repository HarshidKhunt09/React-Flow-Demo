import React from 'react';
import Table from './Table';
import { CSVLink } from 'react-csv';

const DataTable = ({ csvData }) => {
  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(csvData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className='mt-4 flex space-x-4'>
        <CSVLink data={csvData} filename={'data.csv'}>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-8 rounded'>
            Export to CSV
          </button>
        </CSVLink>
        <button
          onClick={handleExportJSON}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Export to JSON
        </button>
      </div>
      <Table data={csvData} />
    </>
  );
};

export default DataTable;
