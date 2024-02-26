import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField"; // Import TextField component
import axios from "axios";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  // // Filter function
  // const filteredUsers = users.filter((user) => {
  //   return user.name.toLowerCase().includes(filterText.toLowerCase());
  // });

  // const filteredUsers = users.filter(user => {
  //   // Convert all user object values to lowercase strings
  //   const userValues = Object.values(user).map(value => String(value).toLowerCase());
  //   // Check if any of the user values include the filter text
  //   return userValues.some(value => value.includes(filterText.toLowerCase()));
  // });

  const filteredUsers = users.filter((user) => {
    // Convert all user object values to lowercase strings, excluding certain fields
    const userValues = Object.entries(user).map(([key, value]) => {
      // Exclude certain fields from lowercase conversion and filtering
      if (key !== "id") {
        return String(value).toLowerCase();
      }
      return value.toString(); // Keep ID as is
    });
    // Check if any of the user values (including ID) include the filter text
    return userValues.some((value) => value.includes(filterText.toLowerCase()));
  });

  return (
    <div>
      {/* Filter input field */}
      <TextField
        label="Filter by name"
        variant="outlined"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      {/* Table Container */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Website</TableCell>
              <TableCell align="right">Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell align="right">{user.username}</TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.phone}</TableCell>
                <TableCell align="right">{user.website}</TableCell>
                <TableCell align="right">{user.company.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
