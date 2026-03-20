import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemText,
  Typography,
  Autocomplete,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { CA_PROVINCES, COUNTRIES, US_STATES } from "../DashBoards/OrganizationManagement/address";
import type { Organization } from "../DashBoards/OrganizationManagement/OrganizationManagement";

type Industry = {
  id: string;
  name: string;
};

// type Division = {
//   id: string;
//   name: string;
// };

type EditOrganizationModalProps = {
  open: boolean;
  organization: Organization | null;
  onClose: () => void;
  onSuccess: () => void;
};

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  open,
  organization,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    industryId: "",
    divisionIds: [] as string[],
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
  });

  const [industries, setIndustries] = useState<Industry[]>([]);
  // const [divisions, setDivisions] = useState<Division[]>([]);
  const [isIndustriesLoading, setIsIndustriesLoading] = useState(false);
  // const [isDivisionsLoading, setIsDivisionsLoading] = useState(false);
  // const [isDivisionPickerOpen, setIsDivisionPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Contracted Organizations state
  const [contractedOrgs, setContractedOrgs] = useState<{ id: string; contractedOrg: { id: string; name: string; city: string; country: string; industry?: { name: string } } }[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [selectedContractedOrg, setSelectedContractedOrg] = useState<{ id: string; name: string } | null>(null);
  const [isAddingContractedOrg, setIsAddingContractedOrg] = useState(false);

  const fetchContractedOrgs = async (orgId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/contracted-organization/${orgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const { data } = await res.json();
      setContractedOrgs(data || []);
    } catch {
      setContractedOrgs([]);
    }
  };

  const fetchAllOrganizations = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/organization/list`);
      url.searchParams.append("page", "1");
      url.searchParams.append("limit", "1000");
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const { data } = await res.json();
      setAllOrganizations((data || []).map((o: any) => ({ id: o.id, name: o.name })));
    } catch {
      setAllOrganizations([]);
    }
  };

  const handleAddContractedOrg = async () => {
    if (!selectedContractedOrg || !organization) return;
    setIsAddingContractedOrg(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/contracted-organization`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ internalOrgId: organization.id, contractedOrgId: selectedContractedOrg.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add contracted organization");
      }
      toast.success("Contracted organization added");
      setSelectedContractedOrg(null);
      fetchContractedOrgs(organization.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to add contracted organization");
    } finally {
      setIsAddingContractedOrg(false);
    }
  };

  const handleRemoveContractedOrg = async (contractId: string) => {
    if (!organization) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/contracted-organization/${contractId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove contracted organization");
      toast.success("Contracted organization removed");
      fetchContractedOrgs(organization.id);
    } catch {
      toast.error("Failed to remove contracted organization");
    }
  };

  useEffect(() => {
    if (organization) {
      setForm({
        name: organization.name || "",
        description: organization.description || "",
        industryId: organization.industryId || "",
        divisionIds: organization.divisions?.map((d) => d.id) || [],
        streetAddress: organization.streetAddress || "",
        city: organization.city || "",
        stateProvince: organization.stateProvince || "",
        postalCode: organization.postalCode || "",
        country: organization.country || "",
      });
    }
  }, [organization]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setIsIndustriesLoading(true);
        const token = localStorage.getItem("token");
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/industry/list`);
        url.searchParams.append("page", "1");
        url.searchParams.append("limit", "1000");

        const response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch industries");
        const { data } = await response.json();
        setIndustries((data || []) as Industry[]);
      } catch (error) {
        setIndustries([]);
      } finally {
        setIsIndustriesLoading(false);
      }
    };

    // const fetchDivisions = async () => {
    //   try {
    //     setIsDivisionsLoading(true);
    //     const token = localStorage.getItem("token");
    //     const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/division/list`);
    //     url.searchParams.append("page", "1");
    //     url.searchParams.append("limit", "1000");

    //     const response = await fetch(url.toString(), {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });

    //     if (!response.ok) throw new Error("Failed to fetch divisions");
    //     const { data } = await response.json();
    //     setDivisions((data || []) as Division[]);
    //   } catch (error) {
    //     setDivisions([]);
    //   } finally {
    //     setIsDivisionsLoading(false);
    //   }
    // };

    if (open) {
      fetchIndustries();
      // fetchDivisions();
      fetchAllOrganizations();
      if (organization?.id) {
        fetchContractedOrgs(organization.id);
      }
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.industryId?.trim()) {
      toast.error("Industry is required");
      return;
    }
    if (!form.country.trim()) {
      toast.error("Country/Region is required");
      return;
    }
    if (!form.streetAddress.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!form.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!form.stateProvince.trim()) {
      toast.error("State, Province or Region is required");
      return;
    }
    if (!form.postalCode.trim()) {
      toast.error("Postal Code is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/organization/update/${organization.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description?.trim(),
          industryId: form.industryId?.trim(),
          divisionIds: form.divisionIds || [],
          streetAddress: form.streetAddress.trim(),
          city: form.city.trim(),
          stateProvince: form.stateProvince.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
        }),
      });

      if (!result.ok) {
        throw new Error(`Failed to update organization, status: ${result.status}`);
      }

      toast.success("Organization updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  // const handleRemoveDivision = (divisionId: string) => {
  //   setForm((p) => ({ ...p, divisionIds: p.divisionIds.filter((id) => id !== divisionId) }));
  // };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Edit Organization
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                fullWidth
                autoFocus
              />

              <FormControl fullWidth required>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={form.industryId}
                  onChange={(e) => setForm((p) => ({ ...p, industryId: e.target.value }))}
                  label="Industry"
                  disabled={isIndustriesLoading}
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <Box>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setIsDivisionPickerOpen(true)}
                  disabled={isDivisionsLoading}
                  fullWidth
                >
                  {form.divisionIds.length > 0
                    ? `${form.divisionIds.length} Team(s) Selected`
                    : "Add Team"}
                </Button>
                {form.divisionIds.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {form.divisionIds.map((id) => {
                      const division = divisions.find((d) => d.id === id);
                      return (
                        <Chip
                          key={id}
                          label={division?.name || id}
                          onDelete={() => handleRemoveDivision(id)}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              </Box> */}

              <FormControl fullWidth required>
                <InputLabel>Country/Region</InputLabel>
                <Select
                  value={form.country}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      country: e.target.value,
                      stateProvince: p.country !== e.target.value ? "" : p.stateProvince,
                    }))
                  }
                  label="Country/Region"
                >
                  {COUNTRIES.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Address"
                value={form.streetAddress}
                onChange={(e) => setForm((p) => ({ ...p, streetAddress: e.target.value }))}
                required
                fullWidth
              />

              <TextField
                label="City"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                required
                fullWidth
              />

              {form.country === "US" ? (
                <FormControl fullWidth required>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={form.stateProvince}
                    onChange={(e) => setForm((p) => ({ ...p, stateProvince: e.target.value }))}
                    label="State"
                  >
                    {US_STATES.map((s) => (
                      <MenuItem key={s.code} value={s.code}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : form.country === "CA" ? (
                <FormControl fullWidth required>
                  <InputLabel>Province/Territory</InputLabel>
                  <Select
                    value={form.stateProvince}
                    onChange={(e) => setForm((p) => ({ ...p, stateProvince: e.target.value }))}
                    label="Province/Territory"
                  >
                    {CA_PROVINCES.map((p) => (
                      <MenuItem key={p.code} value={p.code}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  label="State, Province or Region"
                  value={form.stateProvince}
                  onChange={(e) => setForm((p) => ({ ...p, stateProvince: e.target.value }))}
                  required
                  fullWidth
                />
              )}

              <TextField
                label="Postal Code"
                value={form.postalCode}
                onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))}
                required
                fullWidth
              />

              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                multiline
                rows={3}
                fullWidth
              />

              {/* Contracted Organizations Section */}
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Contracted Organizations
              </Typography>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Autocomplete
                  size="small"
                  sx={{ flex: 1 }}
                  options={allOrganizations.filter(
                    (o) =>
                      o.id !== organization?.id &&
                      !contractedOrgs.some((p) => p.contractedOrg.id === o.id)
                  )}
                  getOptionLabel={(o) => o.name}
                  value={selectedContractedOrg}
                  onChange={(_, val) => setSelectedContractedOrg(val)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select organization" />
                  )}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddContractedOrg}
                  disabled={!selectedContractedOrg || isAddingContractedOrg}
                >
                  Add
                </Button>
              </Box>

              {contractedOrgs.length > 0 ? (
                <List dense disablePadding>
                  {contractedOrgs.map((p) => (
                    <ListItem key={p.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={p.contractedOrg.name}
                        secondary={[p.contractedOrg.industry?.name, p.contractedOrg.city, p.contractedOrg.country].filter(Boolean).join(" - ")}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" size="small" onClick={() => handleRemoveContractedOrg(p.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No contracted organizations linked yet.
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Division Picker Dialog */}
      {/* <Dialog open={isDivisionPickerOpen} onClose={() => setIsDivisionPickerOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Select Teams
          <IconButton onClick={() => setIsDivisionPickerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {divisions.length === 0 ? (
            <Typography color="text.secondary">
              {isDivisionsLoading ? "Loading divisions..." : "No divisions available"}
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {divisions.map((division) => {
                const checked = form.divisionIds.includes(division.id);
                return (
                  <Box
                    key={division.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1,
                      px: 1,
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "action.hover" },
                      borderRadius: 1,
                    }}
                    onClick={() => {
                      const current = form.divisionIds;
                      if (checked) {
                        setForm((p) => ({ ...p, divisionIds: current.filter((x) => x !== division.id) }));
                      } else {
                        setForm((p) => ({ ...p, divisionIds: [...current, division.id] }));
                      }
                    }}
                  >
                    <Checkbox checked={checked} />
                    <ListItemText primary={division.name} />
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsDivisionPickerOpen(false)} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default EditOrganizationModal;
