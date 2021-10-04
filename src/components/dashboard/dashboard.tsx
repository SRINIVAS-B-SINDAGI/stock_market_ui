import { Container, Grid } from "@mui/material";
import React from "react";
import EtfsList from "../etfs-list/EtfsList";
import StocksList from "../stocks-list/StocksList";

export default function Dashboard() {
  return (
    <React.Fragment>
      <Container fixed>
        <Grid item xs={12} lg={12} md={12} xl={12}>
          <StocksList />
        </Grid>
        <Grid item xs={12} lg={12} md={12} xl={12}>
          <EtfsList />
        </Grid>
      </Container>
    </React.Fragment>
  );
}
