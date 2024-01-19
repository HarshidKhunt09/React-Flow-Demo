import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../common/constant';

const Workflows = () => {
  const history = useHistory();
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const storedWorkflows = localStorage.getItem('workflows');

    if (storedWorkflows) {
      setWorkflows(JSON.parse(storedWorkflows));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex">
        <h1 className="text-2xl font-bold mb-4 inline-block mr-8">Workflows</h1>
        <button
          type="submit"
          onClick={() => history.push(ROUTES?.MAIN)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Add Workflow
        </button>
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-r">Name</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {workflows?.map((workflow) => (
            <tr key={workflow?.name}>
              <td className="py-2 px-4 border-r">{workflow?.name}</td>
              <td className="py-2 px-4">
                <button
                  type="submit"
                  onClick={() => history.push(`/edit/${workflow?.name}`)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Workflows;
