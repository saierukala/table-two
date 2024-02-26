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
  const [columns, setColumns] = useState({
    id: false,
    name: true,
    username: false,
    email: true,
    phone: false,
    website: false,
    company: false,
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

  const toggleColumnVisibility = (columnName) => {
    setColumns({ ...columns, [columnName]: !columns[columnName] });
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
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll(e.target.checked);
                    setSelectedRows(
                      e.target.checked ? users.map((user) => user.id) : []
                    );
                  }}
                />
              </TableCell>
              {Object.keys(columns).map((column) =>
                columns[column] ? (
                  <TableCell key={column}>{column}</TableCell>
                ) : null
              )}
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
                  onClick={() => {
                    const selectedIndex = selectedRows.indexOf(user.id);
                    const newSelected = [...selectedRows];
                    if (selectedIndex === -1) {
                      newSelected.push(user.id);
                    } else {
                      newSelected.splice(selectedIndex, 1);
                    }
                    setSelectedRows(newSelected);
                  }}
                  style={{ cursor: "pointer" }}
                  hover
                  selected={selectedRows.indexOf(user.id) !== -1}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.indexOf(user.id) !== -1}
                      onChange={() => {
                        const selectedIndex = selectedRows.indexOf(user.id);
                        const newSelected = [...selectedRows];
                        if (selectedIndex === -1) {
                          newSelected.push(user.id);
                        } else {
                          newSelected.splice(selectedIndex, 1);
                        }
                        setSelectedRows(newSelected);
                      }}
                    />
                  </TableCell>
                  {Object.keys(columns).map((column) =>
                    columns[column] ? (
                      <TableCell key={column}>{user[column]}</TableCell>
                    ) : null
                  )}
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => {}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => {}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        {Object.keys(columns).map(
          (column) =>
            column !== "id" && (
              <label key={column}>
                <Checkbox
                  checked={columns[column]}
                  onChange={() => toggleColumnVisibility(column)}
                />
                {column}
              </label>
            )
        )}
      </div>
    </div>
  );
}
