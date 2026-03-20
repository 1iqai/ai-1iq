import { Box, } from "@mui/material";
import Logo from "../Logo/Logo";
import type { DrawerHeaderProps } from "./types";
//import {  useNavigate } from "react-router-dom";

const DrawerHeader: React.FC<DrawerHeaderProps> = ({ collapsed }) => {
  //const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate("/");
  // };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: collapsed ? 0 : 2,
        pt: 2,
        minHeight: 64,
      }}
    >
      {collapsed ? (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Logo />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Logo />
          </Box>
        </>
      )}
    </Box>
  );
};

export default DrawerHeader;
