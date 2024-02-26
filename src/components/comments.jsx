import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  IconButton,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import axios from "axios";
import { Grid } from "@mui/material";
import "./comments.css";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    name: true,
    username: false,
    email: true,
    phone: false,
    website: false,
    company: true,
    actions: true,
  });
  const [newUserData, setNewUserData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    companyName: "",
  });

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

  const filterUsers = (user) => {
    const searchKey = filterText.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchKey) ||
      user.username.toLowerCase().includes(searchKey) ||
      user.email.toLowerCase().includes(searchKey) ||
      user.phone.toLowerCase().includes(searchKey) ||
      user.website.toLowerCase().includes(searchKey) ||
      user.company.name.toLowerCase().includes(searchKey)
    );
  };

  const handleColumnVisibilityChange = (columnName) => {
    setColumnVisibility({
      ...columnVisibility,
      [columnName]: !columnVisibility[columnName],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: newUserData.name,
      username: newUserData.username,
      email: newUserData.email,
      phone: newUserData.phone,
      website: newUserData.website,
      company: { name: newUserData.companyName },
      editable: false,
    };
    setUsers([...users, newUser]);
    // Clear input fields after adding user
    setNewUserData({
      name: "",
      username: "",
      email: "",
      phone: "",
      website: "",
      companyName: "",
    });
  };

  return (
    <div>
      {/* <div>
        <TextField
          label="Filter by name"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
      </div> */}
      <div className="new-user">
        <h4>Add New User</h4>
        <TextField
          label="Name"
          name="name"
          value={newUserData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Username"
          name="username"
          value={newUserData.username}
          onChange={handleInputChange}
        />
        <TextField
          label="Email"
          name="email"
          value={newUserData.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Phone"
          name="phone"
          value={newUserData.phone}
          onChange={handleInputChange}
        />
        <TextField
          label="Website"
          name="website"
          value={newUserData.website}
          onChange={handleInputChange}
        />
        <TextField
          label="Company Name"
          name="companyName"
          value={newUserData.companyName}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </Button>
      </div>
      <div>
        <TextField
          label="Filter by name"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" padding="checkbox">
                <Checkbox checked={selectAll} onChange={handleSelectAllClick} />
              </TableCell>
              {columnVisibility.id && <TableCell align="right">ID</TableCell>}
              {columnVisibility.name && (
                <TableCell align="right">Name</TableCell>
              )}
              {columnVisibility.username && (
                <TableCell align="right">Username</TableCell>
              )}
              {columnVisibility.email && (
                <TableCell align="right">Email</TableCell>
              )}
              {columnVisibility.phone && (
                <TableCell align="right">Phone</TableCell>
              )}
              {columnVisibility.website && (
                <TableCell align="right">Website</TableCell>
              )}
              {columnVisibility.company && (
                <TableCell align="right">Company</TableCell>
              )}
              {columnVisibility.actions && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.filter(filterUsers).map((user) => (
              <TableRow
                align="right"
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handleRowClick(user.id)}
                style={{ cursor: "pointer" }}
                hover
                selected={selectedRows.includes(user.id)}
              >
                <TableCell align="right" padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </TableCell>
                {columnVisibility.id && (
                  <TableCell align="right">{user.id}</TableCell>
                )}
                {columnVisibility.name && (
                  <TableCell align="right">
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
                )}
                {columnVisibility.username && (
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
                )}
                {columnVisibility.email && (
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
                )}
                {columnVisibility.phone && (
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
                )}
                {columnVisibility.website && (
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
                )}
                {columnVisibility.company && (
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
                )}
                {columnVisibility.actions && (
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
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <h4>Hide/Show Columns</h4>
        <Grid container spacing={2}>
          {Object.keys(columnVisibility).map((columnName) => (
            <Grid item key={columnName}>
              <Checkbox
                checked={columnVisibility[columnName]}
                onChange={() => handleColumnVisibilityChange(columnName)}
                inputProps={{ "aria-label": `Hide ${columnName}` }}
              />
              <span>{columnName}</span>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
 
