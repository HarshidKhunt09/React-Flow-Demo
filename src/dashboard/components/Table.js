import React, { useState } from 'react';

const Table = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed);
  };

  return (
    <div className='max-w-screen-lg mx-auto mt-8'>
      <div className='mb-4'>
        <button
          onClick={toggleCollapse}
          className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'
        >
          {isCollapsed ? 'Expand Table' : 'Collapse Table'}
        </button>
      </div>
      {!isCollapsed && (
        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              {data?.[0] &&
                Object.keys(data[0])?.map((key) => (
                  <th key={key} className='py-2 px-4 border-b'>
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                {item &&
                  Object.values(item)?.map((value, idx) => (
                    <td key={idx} className='py-2 px-4 border-b'>
                      {value}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
