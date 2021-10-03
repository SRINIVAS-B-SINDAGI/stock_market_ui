import { useAuth0 } from "@auth0/auth0-react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../../App";
import { Link, useHistory } from "react-router-dom";

interface ETF {
  filename: String;
  align?: "right";
  minWidth?: number;
}

const columns: readonly ETF[] = [
  { filename: "File Name", minWidth: 170 },
  { filename: "Company Name", minWidth: 170 },
];

export default function EtfsList() {
  const [requestToken, setRequestToken] = React.useState<string | undefined>();
  const [etfsList, setEtfsList] = React.useState<any[]>([]);
  const { user, getAccessTokenSilently } = useAuth0();
  const history = useHistory();
  useEffect(() => {
    const setToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        getEtfsList(token);
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

  const getEtfsList = (token: string) => {
    axios
      .get(`${serverUrl}/api/etfs`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        setEtfsList(response.data);
      })
      .catch(function (error) {
        setEtfsList(error);
      });
  };
  const rowClickHandler = (row: any) => {
    history.push({
      pathname: `/detials/${row.nasdaq_symbol}.csv`,
    });
  };
  return (
    <React.Fragment>
      <h4>Etfs List</h4>
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
              {etfsList.map((row: any) => {
                return (
                  <TableRow
                    hover
                    key={row.filename}
                    onClick={() => rowClickHandler(row)}
                  >
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
