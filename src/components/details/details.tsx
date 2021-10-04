import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress, Container, Grid } from "@mui/material";
import axios from "axios";
import React from "react";
import { serverUrl } from "../../App";
import ReactApexChart from "react-apexcharts";
import { calculateDate } from "../../utils/utils";
import { useHistory } from "react-router-dom";
import {
  ChartData,
  StandardDeviationResponse,
} from "../../interfaces/detailsInterface";

export default function Details(props: {
  match: { params: { filename: string; type: string } };
}) {
  const fileName = props.match.params.filename;
  const history = useHistory();
  const { user, getAccessTokenSilently } = useAuth0();
  const [requestToken, setRequestToken] = React.useState<string | undefined>();
  const [sdValue, setSdValue] = React.useState<string>("1M");
  const [loading, setLoadingData] = React.useState<string>("loading");
  const [graphData, setGraphData] = React.useState<ChartData>({
    date: [],
    open: [],
    close: [],
    volume: [],
  });
  const sdValues = ["1M", "1Y", "3Y", "5Y"];

  React.useEffect(() => {
    let end = new Date();
    let start = new Date();

    start.setDate(end.getDate() - 30);
    end.setDate(end.getDate() + 1);
    const setToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        getStandardDeviation(
          token,
          fileName,
          start,
          end,
          props.match.params.type
        );
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
    start: Date,
    end: Date,
    type: string
  ) => {
    axios
      .post(
        `${serverUrl}/api/standard-deviation`,
        {
          filename,
          start: start.toISOString().substring(0, 10),
          end: end.toISOString().substring(0, 10),
          type,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(function (response: any) {
        const createChartData: ChartData = {
          date: [],
          open: [],
          close: [],
          volume: [],
        };
        response.data.forEach((item: StandardDeviationResponse) => {
          createChartData.date.push(item.data.date.substring(0, 10));
          createChartData.open.push(Math.round(parseInt(item.data.open)));
          createChartData.close.push(Math.round(parseInt(item.data.close)));
          createChartData.volume.push(Math.round(parseInt(item.data.volume)));
        });
        setGraphData(createChartData);
        setLoadingData("loaded");
      })
      .catch(function (error) {
        console.debug(error);
      });
  };

  const handleChange = (standardDeviation: string) => {
    setLoadingData("loading");
    setSdValue(standardDeviation);
    const { end, start } = calculateDate(standardDeviation);
    getStandardDeviation(
      requestToken,
      fileName,
      start,
      end,
      props.match.params.type
    );
  };

  const openPriceConfig: any = {
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
        width: 0.5,
        curve: "smooth",
      },
      title: {
        text: "Open Price Data",
        align: "center",
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

  const closePriceConfig: any = {
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
        width: 0.5,
        curve: "smooth",
      },
      title: {
        text: "Close Price Data",
        align: "center",
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

  const volumePriceConfig: any = {
    series: [
      {
        name: "Volume Movement",
        data: graphData.volume,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0.5,
        curve: "straight",
      },
      title: {
        text: "Volumes Data",
        align: "center",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        type: "datetime",
        categories: graphData.date,
      },
    },
  };

  const handleButtonClick = () => {
    history.push({
      pathname: `/`,
    });
  };
  return (
    <React.Fragment>
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
        <Container fixed>
          <React.Fragment>
            <div style={{ margin: 40 }}>
              <button
                onClick={(event) => handleButtonClick()}
                style={{
                  border: "none",
                  borderRadius: 4,
                  height: 32,
                  width: 60,
                  cursor: "pointer",
                  backgroundColor: "#2E3B55",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                BACK
              </button>
              <p style={{ fontSize: 20 }}>
                {JSON.parse(localStorage.getItem("company_name")!)}
              </p>
              <hr />
              <div style={{ float: "right", padding: 12 }}>
                {sdValues.map((sdValue: string) => (
                  <button
                    onClick={() => handleChange(sdValue)}
                    key={sdValue}
                    style={{
                      border: "none",
                      borderRadius: 4,
                      height: 32,
                      width: 40,
                      cursor: "pointer",
                      backgroundColor: "#2E3B55",
                      color: "white",
                      marginLeft: 10,
                      fontWeight: 600,
                    }}
                  >
                    {sdValue}
                  </button>
                ))}
              </div>
              <div>
                <p>
                  Selected Standard Deviation : <b>{sdValue}</b>
                </p>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ReactApexChart
                    options={openPriceConfig.options}
                    series={openPriceConfig.series}
                    type="area"
                    height={350}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ReactApexChart
                    options={closePriceConfig.options}
                    series={closePriceConfig.series}
                    type="area"
                    height={350}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ReactApexChart
                    options={volumePriceConfig.options}
                    series={volumePriceConfig.series}
                    type="line"
                    height={350}
                  />
                </Grid>
              </Grid>
            </div>
          </React.Fragment>
        </Container>
      )}
    </React.Fragment>
  );
}
