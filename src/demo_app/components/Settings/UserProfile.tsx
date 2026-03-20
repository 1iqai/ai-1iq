import { useEffect, useState } from "react";
import { Box, TextField, Button, Avatar, Typography, CircularProgress } from "@mui/material";
import { Lock as LockIcon, Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { uploadProfileImage } from "../../services/fileService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getRole } from "../../utility/getRole";

export const UserProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    name: "",
    role: "",
    image: "",
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<string | null>(null);
  const defaultProfileImage = "https://placehold.co/128x128/e2e8f0/0f172a?text=User";

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        const decodedUser = JSON.parse(data);
        setUser(decodedUser);

        setEditForm({
          username: decodedUser.username || "",
          email: decodedUser.email || "",
          name: decodedUser.name || "",
          role: decodedUser.role || "",
          image: decodedUser.image || defaultProfileImage,
        });
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      let newProfileImageUrl: string | undefined = undefined;
      if (profileImageFile) {
        const uploadResult = await uploadProfileImage(profileImageFile);
        newProfileImageUrl = uploadResult.url; // Use raw URL for database storage
      }

      const body = {
        ...editForm,
        image: newProfileImageUrl,
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update-user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        // console.error("Error saving profile:", error);
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsSaving(false);
      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreviewUrl(null);
    }
  };

  const handleCancel = () => {
    setEditForm({
      username: user?.username || "",
      email: user?.email || "",
      name: user?.name || "",
      role: user?.role || "",
      image: user?.profileImageUrl || defaultProfileImage,
    });
    setProfileImageFile(null);
    setProfileImagePreviewUrl(null);
    setIsEditing(false);
  };

  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    navigate("/reset-password");
  };

  return (
    <>
      <Box>
        {/* Two-Column Grid */}
        {user ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
              gap: 3,
            }}
          >
            {/* Left Column - Avatar Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                p: 3,
                backgroundColor: "background.default",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "fit-content",
              }}
            >
              {/* Large Avatar */}
              <Avatar
                src={isEditing ? profileImagePreviewUrl || editForm.image : user.image || defaultProfileImage}
                alt="Profile"
                sx={{
                  width: {
                    xs: 90,
                    md: 150,
                  },
                  height: {
                    xs: 90,
                    md: 150,
                  },
                }}
                slotProps={{
                  img: {
                    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = defaultProfileImage;
                    },
                  },
                }}
              />

              {/* File Format Info */}
              <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ px: 2 }}>
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br />
                max size of 5 Mb
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Upload Button (Edit Mode Only) */}
                {isEditing && (
                  <Button component="label" variant="outlined" fullWidth size="small">
                    Upload Photo
                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                  </Button>
                )}

                {/* Change Password Button */}
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={handlePasswordChange}
                  fullWidth
                  size="small"
                >
                  Change Password
                </Button>
              </Box>
            </Box>

            {/* Right Column - Form Fields */}
            <Box
              sx={{
                py: 3,
                px: 2.5,
                backgroundColor: "background.default",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* Two-Column Grid for Form Fields */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3,
                }}
              >
                {/* Full Name */}
                <TextField
                  label="Full name"
                  type="text"
                  value={isEditing ? editForm.name : user.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  disabled={!isEditing}
                  required
                  fullWidth
                  autoFocus={isEditing}
                />

                {/* Email Address */}
                <TextField
                  label="Email address"
                  type="email"
                  value={isEditing ? editForm.email : user.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  disabled={true}
                  fullWidth
                />

                {/* Username */}
                <TextField
                  label="Username"
                  type="text"
                  value={isEditing ? editForm.username : user.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  disabled={true}
                  fullWidth
                />

                {/* Role */}
                <TextField label="Role" value={getRole(user.role)} disabled={true} fullWidth />
              </Box>

              {/* Save Button (Edit Mode Only) */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box sx={{ marginTop: 3, display: "flex", gap: 1 }}>
                  <Button
                    variant={isEditing ? "contained" : "outlined"}
                    color={isEditing ? "success" : "primary"}
                    size="small"
                    startIcon={
                      isSaving ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : isEditing ? (
                        <SaveIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              backgroundColor: "background.default",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              User data not available
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
