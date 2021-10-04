import { useAuth0 } from "@auth0/auth0-react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../../App";
import { useHistory } from "react-router-dom";
import { ETF, EtfResponseData } from "../../interfaces/etfsListInterface";
import { getJSON } from "../../services/service";

const columns: readonly ETF[] = [
  { filename: "File Name", minWidth: 170 },
  { filename: "Company Name", minWidth: 170 },
];

export default function EtfsList() {
  const [etfsList, setEtfsList] = React.useState<EtfResponseData[]>([]);
  const { user, getAccessTokenSilently } = useAuth0();
  const history = useHistory();
  const [loading, setLoadingData] = React.useState<string>("loading");
  useEffect(() => {
    const setToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        getEtfsList(token);
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
    getJSON(`${serverUrl}/api/etfs`, token)
      .then((response) => {
        setEtfsList(response.data);
        setLoadingData("loaded");
      })
      .catch(function (error) {
        setEtfsList(error);
      });
  };

  const rowClickHandler = (row: EtfResponseData) => {
    history.push({
      pathname: `/detials/${row.nasdaq_symbol}.csv/etf`,
    });
  };

  return (
    <React.Fragment>
      <h4>Etfs List</h4>
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
                {etfsList.map((row: EtfResponseData, index) => {
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
