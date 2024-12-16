import React, { useState } from "react";
import "./FolderStructure.css";

function FolderStructure() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [treeData, setTreeData] = useState([
    {
      name: "Desktop",
      type: "folder",
      expanded: true,
      children: [
        { name: "Seetha", type: "file" },
        { name: "Dev", type: "file" },
      ],
    },
    {
      name: "Documents",
      type: "folder",
      expanded: false,
      children: [{ name: "Aadhar", type: "file" },
        { name: "PAN", type: "file" }],
    },
  ]);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  // Handle right-click to show the context menu
  const handleRightClick = (e, node) => {
    e.preventDefault();
    setSelectedNode(node);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      node: node,
    });
  };

  // Close the context menu if clicking outside
  const handleClick = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Toggle folder expansion
  const toggleFolder = (index) => {
    setTreeData((prevData) =>
      prevData.map((node, i) =>
        i === index ? { ...node, expanded: !node.expanded } : node
      )
    );
  };

  // Add a new node (file/folder)
  const handleAdd = (type) => {
    if (selectedNode && selectedNode.type === "folder") {
      const newName = prompt(`Enter the name of the new ${type}:`);
      if (newName) {
        const newNode = {
          name: newName,
          type: type,
        };
        setTreeData((prevData) =>
          prevData.map((node) =>
            node === selectedNode
              ? { ...node, children: [...node.children, newNode] }
              : node
          )
        );
      }
    }
  };

  // Delete selected node
  const handleDelete = () => {
    if (selectedNode) {
      const confirmDelete = window.confirm("Are you sure you want to delete this?");
      if (confirmDelete) {
        const deleteNode = (nodes) =>
          nodes
            .map((node) =>
              node === selectedNode
                ? null
                : {
                    ...node,
                    children: node.children ? deleteNode(node.children) : node.children,
                  }
            )
            .filter((node) => node !== null);

        setTreeData(deleteNode(treeData));
      }
    }
  };

  // Rename the selected node
  const handleRename = () => {
    if (selectedNode) {
      const newName = prompt("Enter the new name for the file/folder:", selectedNode.name);
      if (newName) {
        const renameNode = (nodes) =>
          nodes.map((node) =>
            node === selectedNode ? { ...node, name: newName } : { ...node, children: node.children ? renameNode(node.children) : node.children }
          );

        setTreeData(renameNode(treeData));
      }
    }
  };

  // File upload handler
  const handleFileUpload = (e) => {
    if (selectedNode && selectedNode.type === "folder") {
      const file = e.target.files[0];
      if (file) {
        const newFile = {
          name: file.name,
          type: "file",
        };
        setTreeData((prevData) =>
          prevData.map((node) =>
            node === selectedNode
              ? { ...node, children: [...node.children, newFile] }
              : node
          )
        );
      }
    }
  };

  // Render tree structure
  const renderTree = (nodes) => {
    return nodes.map((node, index) => (
      <div key={index}>
        <div
          style={{
            marginLeft: node.type === "folder" ? "20px" : "40px",
            display: "flex",
            alignItems: "center",
          }}
          onContextMenu={(e) => handleRightClick(e, node)}
        >
          {node.type === "folder" && (
            <span
              onClick={() => toggleFolder(index)}
              style={{ cursor: "pointer", marginRight: "8px" }}
            >
              {node.expanded ? "🔽" : "▶️"}
            </span>
          )}
          {node.type === "folder" ? "📁" : "📄"} {node.name}
        </div>
        {node.type === "folder" && node.expanded && node.children && renderTree(node.children)}
      </div>
    ));
  };

  // Trigger file input
  const triggerFileInput = () => {
    const fileInput = document.getElementById("fileUpload");
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div onClick={handleClick}>
      <div>{renderTree(treeData)}</div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "black",
            border: "1px solid #ccc",
            padding: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {contextMenu.node?.type === "folder" && (
              <>
                <li
                  style={{ padding: "5px 0", cursor: "pointer" }}
                  onClick={() => handleAdd("file")}
                >
                  New File...
                </li>
                <li
                  style={{ padding: "5px 0", cursor: "pointer" }}
                  onClick={() => handleAdd("folder")}
                >
                  New Folder...
                </li>
                <li
                  style={{ padding: "5px 0", cursor: "pointer" }}
                  onClick={triggerFileInput}
                >
                  Upload File...
                </li>
              </>
            )}
            <li style={{ padding: "5px 0", cursor: "pointer" }} onClick={handleRename}>
              Rename
            </li>
            <li style={{ padding: "5px 0", cursor: "pointer" }} onClick={handleDelete}>
              Delete
            </li>
          </ul>
        </div>
      )}

      {/* Hidden file input */}
      <input
        id="fileUpload"
        type="file"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
    </div>
  );
}

export default FolderStructure;
