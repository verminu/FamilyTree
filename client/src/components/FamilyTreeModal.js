import {useUserFullName} from "../providers/UserProvider";
import ReactModal from "react-modal";
import {useUsers} from "../providers/UserProvider";
import {useEffect, useState, createContext, useRef, useContext} from "react";
import axios from "axios";
import Tree from "react-d3-tree";
import {RelationsModalContext} from "./RelationsModal";

export function FamilyTreeModal(props) {
    const userFullName = useUserFullName();
    const {users} = useUsers();
    const [nodes, setNodes] = useState({});
    const {openModal: openRelationsModal, isModalOpen: isRelationsModalOpen} = useContext(RelationsModalContext);
    const {isModalOpen} = useContext(FamilyTreeModalContext);

    const user = props.user;

    const fetchParents = async () => {
        const parents = await axios.get('/user/parents');

        function generateFamilyTreeData(users, parents, nameFn, userId) {
            const userMap = {};
            let treeData;

            // Populate userMap
            for (const user of users) {
                const fullName = nameFn(user); // Format the full name
                userMap[user.id] = {...user, name: fullName};
            }

            // Generate treeData
            const targetUser = userMap[userId]; // Get the target user
            treeData = {...targetUser, children: getChildrenRecursive(targetUser)};

            function getChildrenRecursive(user) {
                const userParents = parents[user.id];

                if (userParents) {
                    // Step 3: Add ancestors recursively
                    const parentObjects = userParents.map((parentId) => userMap[parentId]);

                    return parentObjects.map((parent) => ({
                        ...parent,
                        children: getChildrenRecursive(parent),
                    }));
                }

                return [];
            }

            return treeData;
        }

        const treeData = generateFamilyTreeData(users, parents.data, userFullName, user.id);

        setNodes(treeData);
    }

    useEffect(() => {
        if (props.isOpen) {
            fetchParents();
        }

        return () => {
            setNodes({});
        }
    }, [props.isOpen]);

    const treeRef = useRef(null);
    const [canvasWidth, setCanvasWidth] = useState(0);

    // position the Tree in the center of the modal
    useEffect(() => {
        if (!treeRef?.current) {
            return;
        }

        // Get the dimensions of the parent container
        const parentWidth = treeRef.current.parentElement.offsetWidth;

        // Calculate the canvas dimensions with some padding
        const padding = 20;
        const calculatedWidth = parentWidth - padding * 2;

        // Set the canvas dimensions
        setCanvasWidth(calculatedWidth);

    }, [nodes]);


    // update the tree when the relations modal is closed
    useEffect(() => {
        if (!isRelationsModalOpen && isModalOpen && props.isOpen) {
            fetchParents();
        }
    }, [isRelationsModalOpen, isModalOpen, props.isOpen]);

    function handleClose() {
        props.onRequestClose();
    }

    function handleNodeClick(nodeData, evt) {
        // open relations modal
        openRelationsModal(nodeData);
    }

    const renderSvgNode = ({nodeDatum}) => (
        <g onClick={() => handleNodeClick(nodeDatum)}>
            <circle r={30} fill={nodeDatum.gender === 1 ? "lightblue" : "pink"}/>
            <text style={{fontWeight: "normal", fontSize: "14px", textAnchor: "middle", dominantBaseline: "central"}}
                  strokeWidth="1">
                {nodeDatum.name}
            </text>
        </g>
    );

    return (!!nodes &&
        <ReactModal {...props} >
            <h3>Family tree of {userFullName(user)}</h3>
            <button className="close-button" onClick={handleClose}>Close</button>

            <div className="text-content">The tree displays the person and {user.gender === 1 ? 'his' : 'her'} ancestors
                from top to bottom. Click on a node to see or edit {user.gender === 1 ? 'his' : 'her'} relations.
            </div>

            <div ref={treeRef} style={{width: "100%", height: "100%"}}>
                <Tree
                    data={nodes}
                    orientation="vertical"
                    translate={{x: canvasWidth / 2, y: 100}}
                    collapsible={false}
                    renderCustomNodeElement={renderSvgNode}
                />
            </div>
        </ReactModal>
    )
}

export const FamilyTreeModalContext = createContext();

export function FamilyTreeModalProvider({children}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    const openModal = (user) => {
        setIsModalOpen(true);
        setUser(user);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <FamilyTreeModalContext.Provider value={{isModalOpen, openModal, closeModal}}>
            {!!user && <FamilyTreeModal isOpen={isModalOpen} onRequestClose={closeModal} user={user}/>}
            {children}
        </FamilyTreeModalContext.Provider>
    )
}