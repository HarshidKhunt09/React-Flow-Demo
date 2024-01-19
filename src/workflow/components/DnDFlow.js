import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactFlow, {
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AppContext } from '../../AppContext';
import Sidebar from '../../app/components/sidebar/Sidebar';
import { ROUTES } from '../../common/constant';
import CsvReader from './CsvReader';
import DataTable from './DataTable';
import Filter from './Filter';
import Slice from './Slice';
import Sort from './Sort';

const initialNodes = [];

const getId = () =>
  `dndnode_${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

const nodeTypes = {
  uploadCsv: CsvReader,
  filter: Filter,
  sort: Sort,
  slice: Slice,
};

const DnDFlow = ({ id }) => {
  const history = useHistory();
  const { state, dispatch } = useContext(AppContext);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const storedWorkflow = localStorage.getItem('workflows');
    const parsedWorkflow = JSON.parse(storedWorkflow);
    setWorkflows(storedWorkflow ? parsedWorkflow : []);
  }, []);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line no-undef
      const storedWorkflow = localStorage.getItem('workflows');
      const parsedWorkflow = JSON.parse(storedWorkflow);
      const workflowData = parsedWorkflow?.find(
        (workflow) => workflow?.name === id,
      );

      if (workflowData && workflowData?.nodes?.length > 0) {
        setNodes(workflowData?.nodes);
        setEdges(workflowData?.edges);
        dispatch({
          type: 'SET_CONNECTED_NODES',
          data: workflowData?.connectedNodes,
        });
        dispatch({
          type: 'SET_CSV_DATA',
          data: workflowData?.connectedNodes?.[0]?.value || [],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));

      const sourceNode = nodes?.find((node) => node?.id === connection?.source);
      const targetNode = nodes?.find((node) => node?.id === connection?.target);

      if (sourceNode || targetNode) {
        const connectedNodeData = {
          id: targetNode?.id,
          type: targetNode?.type,
          value: targetNode?.data?.value,
        };

        const sourceNodeData = {
          id: sourceNode?.id,
          type: sourceNode?.type,
          value: sourceNode?.data?.value,
        };

        if (state?.connectedNodes?.length === 0) {
          dispatch({
            type: 'SET_CONNECTED_NODES',
            data: [sourceNodeData, connectedNodeData],
          });
          setNodes((prevNodes) => {
            const updatedNodes = prevNodes?.map((node) => ({
              ...node,
              data: {
                ...node?.data,
                connectedNodes: [sourceNodeData, connectedNodeData],
              },
            }));

            return updatedNodes;
          });
        } else {
          dispatch({
            type: 'SET_CONNECTED_NODES',
            data: [...state?.connectedNodes, connectedNodeData],
          });
          setNodes((prevNodes) => {
            const updatedNodes = prevNodes?.map((node) => {
              if (node?.id === targetNode?.id) {
                return {
                  ...node,
                  data: {
                    ...node?.data,
                    connectedNodes: [
                      ...(node?.data?.connectedNodes || []),
                      connectedNodeData,
                    ],
                  },
                };
              }
              return node;
            });

            return updatedNodes;
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (type === 'uploadCsv') {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: getId(),
          type: 'uploadCsv',
          position,
          data: {
            label: <CsvReader />,
          },
        };

        setNodes((nds) => nds?.concat(newNode));
      } else if (type === 'filter') {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: getId(),
          type: 'filter',
          position,
          data: {
            label: <Filter />,
            value: {
              column: '',
              filter: '',
              text: '',
            },
          },
        };

        setNodes((nds) => nds?.concat(newNode));
      } else if (type === 'sort') {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: getId(),
          type: 'sort',
          position,
          data: {
            label: <Sort />,
            value: {
              column: '',
              order: '',
            },
          },
        };

        setNodes((nds) => nds?.concat(newNode));
      } else if (type === 'slice') {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: getId(),
          type: 'slice',
          position,
          data: {
            label: <Slice />,
            value: {
              fromIndex: '',
              toIndex: '',
            },
          },
        };

        setNodes((nds) => nds?.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes],
  );

  function generateUniqueWorkflowName() {
    const uniqueId = Math.floor(Math.random() * 1000000);
    const uniqueName = `Workflow_${uniqueId}`;
    return uniqueName;
  }

  return (
    <>
      <div className="d-flex justify-end mt-4 my-4 mx-4">
        {id && (
          <button
            type="submit"
            onClick={() => history.push(ROUTES?.WORKFLOWS)}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-4 rounded"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          onClick={() => {
            if (id) {
              const result = workflows?.map((workflow) => {
                if (workflow?.name === id) {
                  return {
                    name: workflow?.name,
                    nodes,
                    edges,
                    reactFlowInstance,
                    connectedNodes: state?.connectedNodes,
                  };
                }
                return workflow;
              });
              // eslint-disable-next-line no-undef
              localStorage.setItem('workflows', JSON.stringify(result));
            } else {
              // eslint-disable-next-line no-undef
              localStorage.setItem(
                'workflows',
                JSON.stringify([
                  ...workflows,
                  {
                    name: generateUniqueWorkflowName(),
                    nodes,
                    edges,
                    reactFlowInstance,
                    connectedNodes: state?.connectedNodes,
                  },
                ]),
              );
            }
            history.push(ROUTES?.WORKFLOWS);
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Workflow
        </button>
        <Link
          to={ROUTES?.WORKFLOWS}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mx-8 rounded-full"
        >
          View Workflows
        </Link>
      </div>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              className="bg-light-yellow"
            >
              <MiniMap />
              <Controls />
            </ReactFlow>
            <DataTable csvData={state?.csvData} />
          </div>
          <Sidebar />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default DnDFlow;
