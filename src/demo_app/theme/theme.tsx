// src/theme.tsx
import { alpha, createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    sidebar?: string;
    surface?: string;
  }
  interface PaletteOptions {
    status?: {
      complete?: { bg: string; text: string };
      progress?: { bg: string; text: string };
      rejected?: { bg: string; text: string };
      notStarted?: { bg: string; text: string };
    };
  }
  interface Palette {
    status: {
      complete: { bg: string; text: string };
      progress: { bg: string; text: string };
      rejected: { bg: string; text: string };
      notStarted: { bg: string; text: string };
    };
  }
}

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },

  typography: {
    // 1. Set the default font to Inter.
    // This applies to body1 (paragraphs), body2, buttons, captions, etc.
    fontFamily: "'Inter', sans-serif",

    // 2. Override specific heading variants to use Poppins
    h1: {
      fontFamily: "'Poppins', sans-serif",
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
    },
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#0073E6",
        },
        error: { main: "#d32f2f" },
        warning: { main: "#ed6c02" },
        success: { main: "#2e7d32" },
        info: { main: "#0288d1" }, // Good to have
        background: {
          default: "#ffffff",
          sidebar: "#f8fafc",
          surface: "#f2f4f7",
        },
        text: {
          primary: "#1a202c",
          secondary: "#4b5563",
          disabled: "#9ca3af",
        },
        action: {
          hover: "rgba(0, 115, 230, 0.04)",
          selected: "rgba(0, 115, 230, 0.08)",
          active: "#0073E6",
        },
        divider: "#dee2e6",
        status: {
          complete: { bg: "#dcfce7", text: "#118D57" },
          progress: { bg: "#dbeafe", text: "#1e40af" },
          rejected: { bg: "#fee2e2", text: "#991b1b" },
          notStarted: { bg: "#f3f4f6", text: "#374151" },
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#0073E6",
        },
        error: { main: "#f44336" },
        warning: { main: "#ffa726" },
        success: { main: "#66bb6a" },
        info: { main: "#29b6f6" },
        background: {
          default: "#171728",
          sidebar: "#111827",
          surface: "#0C0C20",
        },
        text: {
          primary: "#e2e8f0",
        },
        action: {
          hover: "rgba(0, 115, 230, 0.08)",
          selected: "rgba(0, 115, 230, 0.16)",
          active: "#4ca3f5",
        },
        divider: "#3d454f",
        status: {
          complete: { bg: "#166534", text: "#dcfce7" },
          progress: { bg: "#1e40af", text: "#dbeafe" },
          rejected: { bg: "#991b1b", text: "#fee2e2" },
          notStarted: { bg: "#374151", text: "#f3f4f6" },
        },
      },
    },
  },

  components: {
    MuiAlert: {
      styleOverrides: {
        // Override for severity="error"
        standardError: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        }),

        // Override for severity="success"
        standardSuccess: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main,
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
        }),

        // Override for severity="warning"
        standardWarning: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
        }),

        // Override for severity="info"
        standardInfo: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.main,
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        }),

        // Base styles for all alerts
        root: {
          borderRadius: "8px",
        },
        icon: {
          alignItems: "center",
        },
      },
    },
     //  Override for MUI Drawers (Sidebars)
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRight: "none",
          boxShadow: theme.palette.mode === "light" ? "0 0 20px rgba(0, 0, 0, 0.05)" : "0 0 20px rgba(0, 0, 0, 0.3)",
          backgroundImage: "none", // Removes default Material overlay in dark mode
        }),
      },
    },

    //  Override for Modals (Dialogs)
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: (theme.vars || theme).palette.background.default,
          backgroundImage: "none", // Removes default Material overlay in dark mode
        }),
      },
    },

    //  Select Dropdowns (Menu)
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: (theme.vars || theme).palette.background.default,
          backgroundImage: "none", // REQUIRED
        }),
      },
    },

    //  Popovers (used by some other dropdowns)
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: (theme.vars || theme).palette.background.default,
          backgroundImage: "none",
        }),
      },
    },

    // ADD THIS: Override for Table Containers
    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: (theme.vars || theme).palette.background.default,
          backgroundImage: "none",
          boxShadow: "none",
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
        }),
      },
    },

    // All Button custom design
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 20px",
          borderRadius: "50px",
          textTransform: "none",
        },
      },
    },

    // Controls the actual input padding (The space inside the border)
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "6px", // Set your custom radius here
        },
        input: {
          // Adjust these values to your liking:
          // Default Medium is roughly: 16.5px 14px
          // Default Small is roughly: 8.5px 14px
          padding: "12px 16px",
          borderRadius: "12px",
        },
        // If using size="small" specific override:
        /*
        root: {
          '&.MuiInputBase-sizeSmall .MuiOutlinedInput-input': {
            padding: "8px 12px", 
          }
        }
        */
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          // To vertically center the label:
          transform: "translate(14px, 12px) scale(1)", // Match Y to top padding

          // Or specifically for outlined variant:
          "&.MuiInputLabel-outlined": {
            transform: "translate(14px, 12px) scale(1)",
          },
          "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
          },
        },
      },
    },
  },
});

export default theme;
