import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
} from 'reactflow';
import { Link } from 'react-router-dom';
import 'reactflow/dist/style.css';

import Sidebar from '../../app/components/sidebar/Sidebar';
import CsvReader from '../../app/components/CsvReader';
import DataTable from './DataTable';
import Filter from './Filter';
import { AppContext } from '../../AppContext';
import { ROUTES } from '../../common/constant';

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const initialNodes = [];

const getId = () =>
  `dndnode_${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

const nodeTypes = { filter: Filter, uploadCsv: CsvReader };

const DnDFlow = ({ id }) => {
  const { state, dispatch } = useContext(AppContext);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // const [csvData, setCsvData] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  // const [connectedNodes, setConnectedNodes] = useState([]);

  useEffect(() => {
    const storedWorkflow = localStorage.getItem('workflows');
    const parsedWorkflow = JSON.parse(storedWorkflow);
    setWorkflows(storedWorkflow ? parsedWorkflow : []);
  }, []);

  useEffect(() => {
    if (id) {
      const storedWorkflow = localStorage.getItem('workflows');
      const parsedWorkflow = JSON.parse(storedWorkflow);
      const workflowData = parsedWorkflow?.find(
        (workflow) => workflow?.name === id
      );

      if (workflowData) {
        setNodes(workflowData?.nodes);
        setEdges(workflowData?.edges);
        dispatch({
          type: 'SET_CONNECTED_NODES',
          data: workflowData?.connectedNodes,
        });
        dispatch({
          type: 'SET_CSV_DATA',
          data: workflowData?.connectedNodes?.[0]?.value,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (sourceNode || targetNode) {
        const connectedNodeData = {
          id: targetNode.id,
          type: targetNode.type,
          value: targetNode.data.value,
        };

        const sourceNodeData = {
          id: sourceNode.id,
          type: sourceNode.type,
          value: sourceNode.data.value,
        };

        if (state?.connectedNodes.length === 0) {
          dispatch({
            type: 'SET_CONNECTED_NODES',
            data: [sourceNodeData, connectedNodeData],
          });
          // setConnectedNodes([sourceNodeData, connectedNodeData]);
          setNodes((prevNodes) => {
            const updatedNodes = prevNodes.map((node) => {
              return {
                ...node,
                data: {
                  ...node.data,
                  connectedNodes: [sourceNodeData, connectedNodeData],
                },
              };
            });

            return updatedNodes;
          });
        } else {
          // setConnectedNodes((prevConnectedNodes) => [
          //   ...prevConnectedNodes,
          //   connectedNodeData,
          // ]);
          dispatch({
            type: 'SET_CONNECTED_NODES',
            data: [...state.connectedNodes, connectedNodeData],
          });
          setNodes((prevNodes) => {
            const updatedNodes = prevNodes.map((node) => {
              if (node.id === targetNode.id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    connectedNodes: [
                      ...(node.data.connectedNodes || []),
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
    [nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (type === 'input' || type === 'output' || type === 'default') {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode = {
          id: getId(),
          type,
          position,
          data: { label: `${type} node` },
        };
        setNodes((nds) => nds.concat(newNode));
      } else if (type === 'uploadCsv') {
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
            // setCsvData: setCsvData,
          },
        };

        setNodes((nds) => nds.concat(newNode));
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
            // connectedNodes,
            // setConnectedNodes,
            // setCsvData,
            value: {
              column: '',
              filter: '',
              text: '',
            },
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes]
  );

  function generateUniqueWorkflowName() {
    const uniqueId = Math.floor(Math.random() * 1000000);
    const uniqueName = `Workflow_${uniqueId}`;
    return uniqueName;
  }

  return (
    <>
      <div className='d-flex justify-end mt-4 my-4 mx-4'>
        <button
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
              localStorage.setItem('workflows', JSON.stringify(result));
            } else {
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
                ])
              );
            }
          }}
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        >
          Save Workflow
        </button>
        <Link
          to={ROUTES?.WORKFLOWS}
          className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mx-8 rounded-full'
        >
          View Workflow
        </Link>
      </div>
      <div className='dndflow'>
        <ReactFlowProvider>
          <div className='reactflow-wrapper' ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              style={rfStyle}
              nodeTypes={nodeTypes}
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
