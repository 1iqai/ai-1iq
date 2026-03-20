import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Stack,
  useTheme,
  alpha,
  FormHelperText,
  useMediaQuery,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Tooltip,
  Collapse,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Close as CloseIcon,
  InfoOutlined,
  SettingsOutlined,
  OutputOutlined,
  AutoAwesome,
  Cloud,
  AttachMoney,
  History,
  HelpOutline,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import type {
  Industry,
  IndustrySchema,
  FieldDef,
  SectionDef,
  GlobalSettings,
  OutputFormat,
} from "./schemas";
import {
  DEFAULT_GLOBAL_SETTINGS,
  INDUSTRIES,
  DEFAULT_PRESERVE_FIELDS,
  OUTPUT_FORMAT_OPTIONS,
  getSchema,
  getSchemaDefaults,
  isFieldVisible,
} from "./schemas";

interface ScheduleGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated?: (projectId: string) => void;
}

const GENERATING_MESSAGES = [
  "AI is generating your schedule...",
  "Analyzing project requirements...",
  "Calculating task durations...",
  "Optimizing dependencies...",
  "Building milestone structure...",
  "Setting task priorities...",
  "Almost there...",
];

const FIELD_ALIASES: Record<string, string[]> = {
  projectLocation: ["destination", "origin"],
  projectStartDate: ["startDate"],
};

const ScheduleGeneratorModal: React.FC<ScheduleGeneratorModalProps> = ({
  open,
  onClose,
  onProjectCreated: _onProjectCreated,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading] = useState(false);
  const [_loadingStatus, setLoadingStatus] = useState("");
  const [isGenerating] = useState(false);
  const messageIndexRef = useRef(0);

  // Schema-based state
  const [currentIndustry, setCurrentIndustry] = useState<Industry>("Construction (Design + Build)");
  const [schema, setSchema] = useState<IndustrySchema>(() => getSchema("Construction (Design + Build)"));
  const [formValues, setFormValues] = useState<Record<string, any>>(() => getSchemaDefaults(getSchema("Construction (Design + Build)")));
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Ref to track current form values for industry switching
  const formValuesRef = useRef<Record<string, any>>(formValues);
  useEffect(() => {
    formValuesRef.current = formValues;
  }, [formValues]);

  // Initialize form with schema defaults when industry changes
  useEffect(() => {
    const newSchema = getSchema(currentIndustry);
    setSchema(newSchema);

    // Preserve common fields when switching industries
    const newDefaults = getSchemaDefaults(newSchema);
    const newFieldIds = new Set<string>();
    newSchema.sections.forEach((section) => {
      section.fields.forEach((field) => newFieldIds.add(field.id));
    });

    const currentValues = formValuesRef.current;
    const preservedValues: Record<string, any> = { ...newDefaults };

    // Always set industry
    if (newFieldIds.has("industry")) {
      preservedValues.industry = currentIndustry;
    }

    // Preserve common fields
    DEFAULT_PRESERVE_FIELDS.forEach((key) => {
      let value = currentValues[key];

      // Try aliases if direct key not found
      if (value === undefined) {
        const aliases = FIELD_ALIASES[key] ?? [];
        for (const alias of aliases) {
          if (currentValues[alias] !== undefined) {
            value = currentValues[alias];
            break;
          }
        }
      }

      if (value !== undefined && value !== "" && newFieldIds.has(key)) {
        preservedValues[key] = value;
      }
    });

    // Carry over any other overlapping fields
    Object.entries(currentValues).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && newFieldIds.has(k) && preservedValues[k] === undefined) {
        preservedValues[k] = v;
      }
    });

    setFormValues(preservedValues);
    setErrors({});
  }, [currentIndustry]);

  // Cycle through generating messages while waiting for AI
  useEffect(() => {
    if (!isGenerating) {
      messageIndexRef.current = 0;
      return;
    }

    const interval = setInterval(() => {
      messageIndexRef.current = (messageIndexRef.current + 1) % GENERATING_MESSAGES.length;
      setLoadingStatus(GENERATING_MESSAGES[messageIndexRef.current]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when field is changed
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  }, []);

  const handleIndustryChange = useCallback((newIndustry: Industry) => {
    setCurrentIndustry(newIndustry);
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const handleClose = () => {
    if (!loading) {
      // Reset form to defaults
      const defaultSchema = getSchema("Construction (Design + Build)");
      setCurrentIndustry("Construction (Design + Build)");
      setSchema(defaultSchema);
      setFormValues(getSchemaDefaults(defaultSchema));
      setGlobalSettings(DEFAULT_GLOBAL_SETTINGS);
      setErrors({});
      setCollapsedSections({});
      onClose();
    }
  };

  // Render a single field based on its type
  const renderField = (field: FieldDef) => {
    if (!isFieldVisible(field, formValues)) return null;

    const value = formValues[field.id];
    const error = errors[field.id];
    const isRequired = field.required;

    const labelWithRequired = isRequired ? `${field.label} *` : field.label;

    switch (field.type) {
      case "text":
        return (
          <TextField
            value={value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            label={labelWithRequired}
            fullWidth
            size="small"
            placeholder={field.placeholder}
            error={!!error}
            helperText={error || field.help}
            InputProps={{
              endAdornment: field.help && !error ? (
                <Tooltip title={field.help}>
                  <HelpOutline fontSize="small" color="action" sx={{ ml: 1 }} />
                </Tooltip>
              ) : undefined,
            }}
          />
        );

      case "textarea":
        return (
          <TextField
            value={value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            label={labelWithRequired}
            fullWidth
            size="small"
            multiline
            rows={field.rows || 3}
            placeholder={field.placeholder}
            error={!!error}
            helperText={error || field.help}
          />
        );

      case "number":
        return (
          <TextField
            value={value ?? ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value === "" ? undefined : Number(e.target.value))}
            label={labelWithRequired}
            type="number"
            fullWidth
            size="small"
            error={!!error}
            helperText={error || field.help}
            inputProps={{ min: field.min, max: field.max }}
          />
        );

      case "date":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={labelWithRequired}
              value={value || null}
              onChange={(newValue) => handleFieldChange(field.id, newValue)}
              sx={{ mt: 0.5 }}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: !!error,
                  helperText: error || field.help,
                },
              }}
            />
          </LocalizationProvider>
        );

      case "select":
        // Special handling for industry field
        if (field.id === "industry") {
          return (
            <FormControl fullWidth size="small" error={!!error}>
              <InputLabel>{labelWithRequired}</InputLabel>
              <Select
                value={currentIndustry}
                onChange={(e) => handleIndustryChange(e.target.value as Industry)}
                label={labelWithRequired}
              >
                {INDUSTRIES.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
              {(error || field.help) && <FormHelperText>{error || field.help}</FormHelperText>}
            </FormControl>
          );
        }

        return (
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{labelWithRequired}</InputLabel>
            <Select
              value={value ?? field.default ?? ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={labelWithRequired}
            >
              {field.options?.map((option) => (
                <MenuItem key={String(option)} value={option}>
                  {String(option)}
                </MenuItem>
              ))}
            </Select>
            {(error || field.help) && <FormHelperText>{error || field.help}</FormHelperText>}
          </FormControl>
        );

      case "multiSelect":
        return (
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{labelWithRequired}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              input={<OutlinedInput label={labelWithRequired} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((val) => (
                    <Chip key={val} label={val} size="small" />
                  ))}
                </Box>
              )}
            >
              {field.options?.map((option) => (
                <MenuItem key={String(option)} value={option}>
                  <Checkbox checked={(value || []).includes(option)} />
                  <ListItemText primary={String(option)} />
                </MenuItem>
              ))}
            </Select>
            {(error || field.help) && <FormHelperText>{error || field.help}</FormHelperText>}
          </FormControl>
        );

      case "toggle":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                size="small"
              />
            }
            label={
              <Box>
                <Typography variant="body2">{field.label}</Typography>
                {field.help && (
                  <Typography variant="caption" color="text.secondary">
                    {field.help}
                  </Typography>
                )}
              </Box>
            }
          />
        );

      default:
        return null;
    }
  };

  // Render a section
  const renderSection = (section: SectionDef) => {
    // Filter out industry field from projectInfo section (it will be in the header)
    const visibleFields = section.fields.filter((field) => {
      if (section.id === "projectInfo" && field.id === "industry") return false;
      return isFieldVisible(field, formValues);
    });
    if (visibleFields.length === 0 && section.id !== "projectInfo") return null;

    const isCollapsible = section.id === "advanced";
    const isCollapsed = collapsedSections[section.id];

    // Get icon for section
    const getSectionIcon = () => {
      switch (section.id) {
        case "projectInfo":
          return <InfoOutlined color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />;
        case "scopeAndControls":
          return <SettingsOutlined color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />;
        case "advanced":
          return <SettingsOutlined color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />;
        case "projectPrompt":
          return <AutoAwesome color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />;
        default:
          return <InfoOutlined color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />;
      }
    };

    return (
      <Paper
        key={section.id}
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          border: 1,
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          mb={isCollapsible && isCollapsed ? 0 : { xs: 2, sm: 2.5 }}
          sx={isCollapsible ? { cursor: "pointer" } : undefined}
          onClick={isCollapsible ? () => toggleSection(section.id) : undefined}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            {getSectionIcon()}
            <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              {section.title}
            </Typography>
          </Stack>

          {/* Industry selector on the right side of Project Information header */}
          {section.id === "projectInfo" && (
            <FormControl size="small" sx={{ minWidth: { xs: 140, sm: 200 } }}>
              <InputLabel sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Industry Type</InputLabel>
              <Select
                value={currentIndustry}
                onChange={(e) => handleIndustryChange(e.target.value as Industry)}
                label="Industry Type"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "& .MuiSelect-select": {
                    py: { xs: 0.75, sm: 1 },
                  },
                }}
              >
                {INDUSTRIES.map((industry) => (
                  <MenuItem key={industry} value={industry} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {isCollapsible && (isCollapsed ? <ExpandMore /> : <ExpandLess />)}
        </Stack>

        <Collapse in={!isCollapsible || !isCollapsed}>
          <Grid container spacing={2}>
            {visibleFields.map((field) => {
              // Determine grid size based on field type and section columns
              const gridSize =
                field.type === "textarea"
                  ? { xs: 12 }
                  : section.columns === 1
                  ? { xs: 12 }
                  : { xs: 12, sm: 6, md: section.columns === 3 ? 4 : 6 };

              return (
                <Grid key={field.id} size={gridSize}>
                  {renderField(field)}
                </Grid>
              );
            })}
          </Grid>
        </Collapse>
      </Paper>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          display: "flex",
          flexDirection: "column",
          maxHeight: isMobile ? "100vh" : "90vh",
          borderRadius: isMobile ? 0 : 2,
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1, flexShrink: 0, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Stack direction="row" alignItems="center" gap={1}>
              <AutoAwesome sx={{ color: "primary.main", fontSize: { xs: 20, sm: 24 } }} />
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                {schema.title || "Schedule Generator"}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0, ml: { xs: 3.5, sm: 4 }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Generate a comprehensive project schedule based on your specifications
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, overflow: "auto", flex: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Dynamic sections from schema */}
          {schema.sections.map((section) => renderSection(section))}

          {/* Integration Settings Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: 1,
              borderColor: "divider",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1} mb={{ xs: 2, sm: 2.5 }}>
              <SettingsOutlined color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
              <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Integration Settings
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {/* Include Weather Impact */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    backgroundColor: "background.default",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Cloud fontSize="small" color="action" />
                    <Typography variant="subtitle2" fontWeight={500}>
                      Weather Impact
                    </Typography>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={globalSettings.integrations.weatherImpact}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            integrations: { ...prev.integrations, weatherImpact: e.target.checked },
                          }))
                        }
                        size="small"
                      />
                    }
                    label={
                      <Typography sx={{ ml: 0.5 }} variant="body2" color="text.secondary">
                        Include weather delays
                      </Typography>
                    }
                  />
                </Paper>
              </Grid>

              {/* Use Cost Calibration API */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    backgroundColor: "background.default",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <AttachMoney fontSize="small" color="action" />
                    <Typography variant="subtitle2" fontWeight={500}>
                      Cost Calibration
                    </Typography>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={globalSettings.integrations.costCalibration}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            integrations: { ...prev.integrations, costCalibration: e.target.checked },
                          }))
                        }
                        size="small"
                      />
                    }
                    label={
                      <Typography sx={{ ml: 0.5 }} variant="body2" color="text.secondary">
                        Fetch regional costs
                      </Typography>
                    }
                  />
                </Paper>
              </Grid>

              {/* Enable Version Control */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    backgroundColor: "background.default",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <History fontSize="small" color="action" />
                    <Typography variant="subtitle2" fontWeight={500}>
                      Version Control
                    </Typography>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={globalSettings.integrations.versionControl}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            integrations: { ...prev.integrations, versionControl: e.target.checked },
                          }))
                        }
                        size="small"
                      />
                    }
                    label={
                      <Typography sx={{ ml: 0.5 }} variant="body2" color="text.secondary">
                        Save version history
                      </Typography>
                    }
                  />
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Output Settings Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: 1,
              borderColor: "divider",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1} mb={{ xs: 2, sm: 2.5 }}>
              <OutputOutlined color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
              <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Output Settings
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {/* Output Format - Dropdown */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    backgroundColor: "background.default",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <OutputOutlined fontSize="small" color="action" />
                    <Typography variant="subtitle2" fontWeight={500}>
                      Output Format
                    </Typography>
                  </Stack>
                  <FormControl fullWidth size="small">
                    <Select
                      value={globalSettings.output.outputFormat}
                      onChange={(e) =>
                        setGlobalSettings((prev) => ({
                          ...prev,
                          output: { ...prev.output, outputFormat: e.target.value as OutputFormat },
                        }))
                      }
                    >
                      {OUTPUT_FORMAT_OPTIONS.map((format) => (
                        <MenuItem key={format} value={format}>
                          {format}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>

              {/* Include Assumptions */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    backgroundColor: "background.default",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <InfoOutlined fontSize="small" color="action" />
                    <Typography variant="subtitle2" fontWeight={500}>
                      Include Assumptions
                    </Typography>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={globalSettings.output.includeAssumptions}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            output: { ...prev.output, includeAssumptions: e.target.checked },
                          }))
                        }
                        size="small"
                      />
                    }
                    label={
                      <Typography sx={{ ml: 0.5 }} variant="body2" color="text.secondary">
                        Recommended for transparency
                      </Typography>
                    }
                  />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          bgcolor: "background.surface",
          borderTop: 1,
          borderColor: "divider",
          flexShrink: 0,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          disabled={loading}
          fullWidth={isMobile}
          sx={{ order: { xs: 2, sm: 1 } }}
        >
          Cancel
        </Button>
        <Tooltip title="Not available in this demo" arrow>
          <span style={{ order: 1, width: isMobile ? "100%" : undefined }}>
            <Button
              disabled={true}
              variant="contained"
              fullWidth={isMobile}
              startIcon={<AutoAwesome />}
              sx={{
                background: "linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)",
                boxShadow: "0 3px 5px 2px rgba(255, 152, 0, .3)",
              }}
            >
              Generate Schedule
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleGeneratorModal;
