import { useAuth0 } from "@auth0/auth0-react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../../App";

interface Stock {
  filename: String;
  // company_name: String;
  align?: "right";
  minWidth?: number;
}

const columns: readonly Stock[] = [
  { filename: "File Name", minWidth: 170 },
  { filename: "Company Name", minWidth: 170 },
];

export default function StocksList() {
  const [requestToken, setRequestToken] = React.useState<string | undefined>();
  const [stocksList, setStocksList] = React.useState<any[]>([]);
  const { user, getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const setToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        getStocksList(token);
        setRequestToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      setToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getStocksList = (token: string) => {
    axios
      .get(`${serverUrl}/api/stocks`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        setStocksList(response.data);
      })
      .catch(function (error) {
        setStocksList(error);
      });
  };
  return (
    <React.Fragment>
      <h4>Stocks List</h4>
      <Paper
        sx={{
          width: "100%",
        }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.filename}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stocksList.map((row: any) => {
                return (
                  <TableRow hover key={row.filename}>
                    <TableCell>{`${row.nasdaq_symbol}.csv`}</TableCell>
                    <TableCell>{row.security_name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </React.Fragment>
  );
}
