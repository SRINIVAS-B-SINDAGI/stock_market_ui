import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { serverUrl } from "../../App";
import ReactApexChart from "react-apexcharts";

export default function Details(props: {
  match: { params: { filename: string } };
}) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [requestToken, setRequestToken] = React.useState<string | undefined>();
  const [sdValue, setSdValue] = React.useState<string>("1M");
  const [graphData, setGraphData] = React.useState({
    date: [],
    open: [],
    close: [],
  });
  const getDays = (duration: any) => {
    if (duration === "1M") {
      return 30;
    } else if (duration === "1Y") {
      return 365;
    } else if (duration === "3Y") {
      return 365 * 3;
    } else if (duration === "5Y") {
      return 365 * 5;
    }
  };
  const calculateDate = (value: any) => {
    let end = new Date();
    let start = new Date();

    start.setDate(end.getDate() - getDays(value)!);
    end.setDate(end.getDate() + 1);
    return { end, start };
  };

  React.useEffect(() => {
    let end = new Date();
    let start = new Date();

    start.setDate(end.getDate() - 30);
    end.setDate(end.getDate() + 1);
    const setToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        getStandardDeviation(token, props.match.params.filename, start, end);
        setRequestToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      setToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStandardDeviation = (
    token: string | undefined,
    filename: string,
    start: any,
    end: any
  ) => {
    axios
      .post(
        `${serverUrl}/api/standard-deviation`,
        {
          filename: filename,
          start: start.toISOString().substring(0, 10),
          end: end.toISOString().substring(0, 10),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(function (response: any) {
        const temp: any = {
          date: [],
          open: [],
          close: [],
        };
        response.data.forEach((item: any) => {
          temp.date.push(item.data.data.substring(0, 10));
          temp.open.push(item.data.open);
          temp.close.push(item.data.close);
        });
        setGraphData(temp);
      })
      .catch(function (error) {
        console.debug(error);
      });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSdValue(event.target.value as string);
    const { end, start } = calculateDate(event.target.value);
    getStandardDeviation(requestToken, props.match.params.filename, start, end);
  };

  const sdValues = ["1M", "1Y", "3Y", "5Y"];

  const openLine: any = {
    series: [
      {
        name: "open price",
        data: graphData.open,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: graphData.date,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  };

  const closeLine: any = {
    series: [
      {
        name: "close price",
        data: graphData.close,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: graphData.date,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  };
  return (
    <React.Fragment>
      <Container fixed>
        <Grid item xs={12} lg={12} md={12} xl={12}>
          <p>Details</p>

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sdValue}
                label="Age"
                onChange={handleChange}
              >
                {sdValues.map((sd: string) => (
                  <MenuItem value={sd}>{sd}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Container>
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <h4 style={{ textAlign: "center" }}>Open Price</h4>
            <ReactApexChart
              options={openLine.options}
              series={openLine.series}
              type="area"
              height={350}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <h4 style={{ textAlign: "center" }}>Close Price</h4>
            <ReactApexChart
              options={closeLine.options}
              series={closeLine.series}
              type="area"
              height={350}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    </React.Fragment>
  );
}
