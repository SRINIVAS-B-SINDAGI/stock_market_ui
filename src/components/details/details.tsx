import { Container, Grid } from "@mui/material";
import React from "react";

export default function Details() {
  return (
    <React.Fragment>
      <Container fixed>
        <Grid item xs={12} lg={12} md={12} xl={12}>
          <p>Details</p>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
