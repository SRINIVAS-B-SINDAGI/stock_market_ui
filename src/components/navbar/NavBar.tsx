import { useAuth0 } from "@auth0/auth0-react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

export default function NavBar() {
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  const { isAuthenticated } = useAuth0();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "#2E3B55" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Stock Market Information
          </Typography>
          {isAuthenticated ? (
            <LogoutIcon
              style={{ cursor: "pointer" }}
              onClick={() =>
                logout({
                  returnTo: window.location.origin,
                })
              }
            />
          ) : (
            <LoginIcon
              style={{ cursor: "pointer" }}
              onClick={() =>
                loginWithRedirect({
                  screen_hint: "login",
                })
              }
            />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
