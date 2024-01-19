import React from 'react';
import { CSVLink } from 'react-csv';
import Table from './Table';

const DataTable = ({ csvData }) => {
  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(csvData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    // eslint-disable-next-line no-undef
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    // eslint-disable-next-line no-undef
    document.body.appendChild(a);
    a.click();
    // eslint-disable-next-line no-undef
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="mt-4 flex space-x-4">
        <CSVLink data={csvData} filename="data.csv">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 mx-8 rounded"
          >
            Export to CSV
          </button>
        </CSVLink>
        <button
          type="submit"
          onClick={handleExportJSON}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
        >
          Export to JSON
        </button>
      </div>
      <div className="pb-24">
        <Table data={csvData} />
      </div>
    </>
  );
};

export default DataTable;
