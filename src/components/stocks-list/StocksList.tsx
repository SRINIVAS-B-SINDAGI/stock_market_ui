import { useAuth0 } from "@auth0/auth0-react";
import {
  CircularProgress,
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
import { useHistory } from "react-router-dom";
import { Stock, StockResponseData } from "../../interfaces/stocksListInterface";

const columns: readonly Stock[] = [
  { filename: "File Name", minWidth: 170 },
  { filename: "Company Name", minWidth: 170 },
];

export default function StocksList() {
  const [stocksList, setStocksList] = React.useState<StockResponseData[]>([]);
  const { user, getAccessTokenSilently } = useAuth0();
  const history = useHistory();
  const [loading, setLoadingData] = React.useState<string>("loading");
  useEffect(() => {
    const setToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        getStocksList(token);
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
        setLoadingData("loaded");
      })
      .catch(function (error) {
        setStocksList(error);
      });
  };
  const rowClickHandler = (row: StockResponseData) => {
    history.push({
      pathname: `/detials/${row.nasdaq_symbol}.csv/stock`,
    });
    localStorage.setItem("company_name", JSON.stringify(row.security_name));
  };

  return (
    <React.Fragment>
      <h4>Stocks List</h4>
      {loading === "loading" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 100,
          }}
        >
          <CircularProgress />
        </div>
      ) : (
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
                      <b>{column.filename}</b>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {stocksList.map((row: StockResponseData, index) => {
                  return (
                    <TableRow
                      style={{ cursor: "pointer" }}
                      hover
                      key={index}
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
      )}
    </React.Fragment>
  );
}
