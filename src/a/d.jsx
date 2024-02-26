import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        const updatedUsers = response.data.map((user) => ({
          ...user,
          editable: false,
        }));
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  // Log selected rows whenever it changes
  useEffect(() => {
    console.log("Selected Rows:", selectedRows);
  }, [selectedRows]);

  const handleEdit = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, editable: true } : user
    );
    setUsers(updatedUsers);
  };

  const handleSave = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, editable: false } : user
    );
    setUsers(updatedUsers);
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  const handleCheckboxChange = (userId) => {
    const selectedIndex = selectedRows.indexOf(userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, userId];
    } else {
      newSelected = selectedRows.filter((id) => id !== userId);
    }
    setSelectedRows(newSelected);
  };

  const handleRowClick = (userId) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter((id) => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  const handleSelectAllClick = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const newSelectedRows = users.map((user) => user.id);
      setSelectedRows(newSelectedRows);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div>
      <TextField
        label="Filter by name"
        variant="outlined"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox checked={selectAll} onChange={handleSelectAllClick} />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Website</TableCell>
              <TableCell align="right">Company</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter((user) => {
                const searchKey = filterText.toLowerCase();
                return (
                  user.name.toLowerCase().includes(searchKey) ||
                  user.username.toLowerCase().includes(searchKey) ||
                  user.email.toLowerCase().includes(searchKey) ||
                  user.phone.toLowerCase().includes(searchKey) ||
                  user.website.toLowerCase().includes(searchKey) ||
                  user.company.name.toLowerCase().includes(searchKey)
                );
              })
              .map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => handleRowClick(user.id)}
                  style={{ cursor: "pointer" }}
                  hover
                  selected={selectedRows.includes(user.id)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {user.editable ? (
                      <TextField
                        value={user.name}
                        onChange={(e) =>
                          setUsers((prevUsers) =>
                            prevUsers.map((prevUser) =>
                              prevUser.id === user.id
                                ? { ...prevUser, name: e.target.value }
                                : prevUser
                            )
                          )
                        }
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {user.editable ? (
                      <TextField
                        value={user.username}
                        onChange={(e) =>
                          setUsers((prevUsers) =>
                            prevUsers.map((prevUser) =>
                              prevUser.id === user.id
                                ? { ...prevUser, username: e.target.value }
                                : prevUser
                            )
                          )
                        }
                      />
                    ) : (
                      user.username
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {user.editable ? (
                      <TextField
                        value={user.email}
                        onChange={(e) =>
                          setUsers((prevUsers) =>
                            prevUsers.map((prevUser) =>
                              prevUser.id === user.id
                                ? { ...prevUser, email: e.target.value }
                                : prevUser
                            )
                          )
                        }
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {user.editable ? (
                      <TextField
                        value={user.phone}
                        onChange={(e) =>
                          setUsers((prevUsers) =>
                            prevUsers.map((prevUser) =>
                              prevUser.id === user.id
                                ? { ...prevUser, phone: e.target.value }
                                : prevUser
                            )
                          )
                        }
                      />
                    ) : (
                      user.phone
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {user.editable ? (
                      <TextField
                        value={user.website}
                        onChange={(e) =>
                          setUsers((prevUsers) =>
                            prevUsers.map((prevUser) =>
                              prevUser.id === user.id
                                ? { ...prevUser, website: e.target.value }
                                : prevUser
                            )
                          )
                        }
                      />
                    ) : (
                      user.website
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {user.editable ? (
                      <TextField
                        value={user.company.name}
                        onChange={(e) =>
                          setUsers((prevUsers) =>
                            prevUsers.map((prevUser) =>
                              prevUser.id === user.id
                                ? {
                                    ...prevUser,
                                    company: {
                                      ...prevUser.company,
                                      name: e.target.value,
                                    },
                                  }
                                : prevUser
                            )
                          )
                        }
                      />
                    ) : (
                      user.company.name
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {user.editable ? (
                      <IconButton
                        color="primary"
                        onClick={() => handleSave(user.id)}
                      >
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(user.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDelete(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
