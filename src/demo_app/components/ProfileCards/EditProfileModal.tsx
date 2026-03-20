import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Avatar,
    Button,
    TextField,
    Divider,
    CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon, Image as ImageIcon, VpnKey as VpnKeyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { uploadProfileImage } from '../../services/fileService';
import { toast } from 'react-toastify';

type UserInfo = {
    username: string;
    name: string;
    email: string;
    role: string;
    image: string;
}

type EditProfileModalProps = {
    open: boolean;
    onClose: () => void;
    profile: UserInfo;
    onSuccess: (updatedProfile: UserInfo) => void;
}

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600, md: 700 },
    maxHeight: '90vh',
    bgcolor: 'background.default',
    boxShadow: 24,
    borderRadius: 3,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, profile, onSuccess }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [updating, setUpdating] = useState<boolean>(false);
    const [editedProfile, setEditedProfile] = useState<UserInfo>(profile);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<string | null>(null);
    const token = localStorage.getItem("token");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            toast.error('Only JPG, JPEG, and PNG files are allowed.');
            e.target.value = '';
            return;
        }

        if (file.size > maxSize) {
            toast.error('File size must be less than 5MB.');
            e.target.value = '';
            return;
        }

        setProfileImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImagePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!editedProfile || !user.id) return;
        setUpdating(true);
        try {
            let imageUrlForStorage = editedProfile.image;
            if (profileImageFile) {
                const uploadResult = await uploadProfileImage(profileImageFile);
                imageUrlForStorage = uploadResult.url; // Store raw URL in database
            }
            const body = {
                ...editedProfile,
                image: imageUrlForStorage,
            };

            if (!body.name.trim()) {
                throw Error("Name can't be empty");
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update-user/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // data.data.image should now be a presigned URL from backend
            setUser(data.data);
            localStorage.setItem("user", JSON.stringify(data.data));
            onSuccess(data.data);
            toast.success('Profile updated successfully!');
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                if (error && error.message)
                    toast.error(error.message);
                else
                    toast.error("Something is wrong");
            }
        } finally {
            setUpdating(false);
            setProfileImageFile(null);
            setProfileImagePreviewUrl(null);
        }
    };

    const handleChangePassword = () => {
        navigate("/reset-password");
        window.location.reload();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 3,
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="h5" fontWeight={600}>
                        Edit Profile
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={updating ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                            onClick={handleSave}
                            disabled={updating}
                            sx={{ textTransform: 'none' }}
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Content */}
                <Box sx={{ overflow: 'auto', flex: 1, p: 3 }}>
                    {/* Profile Image Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            p: 3,
                            bgcolor: 'background.surface',
                            borderRadius: 2,
                            mb: 3,
                        }}
                    >
                        <Avatar
                            src={profileImagePreviewUrl || editedProfile?.image || 'https://placehold.co/128x128/e2e8f0/0f172a?text=User'}
                            alt={editedProfile?.name}
                            sx={{ width: 100, height: 100 }}
                        />
                        <Typography variant="caption" color="error">
                            * Image should be less than 5MB
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            Upload New Image
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                hidden
                                onChange={handleImageChange}
                            />
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Edit Form */}
                    <Box>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Profile Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Full Name"
                                fullWidth
                                value={editedProfile?.name || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                            />
                            <TextField
                                label="Username"
                                fullWidth
                                disabled
                                value={editedProfile?.username || ''}
                                helperText="Username cannot be changed"
                            />
                            <TextField
                                label="Email Address"
                                fullWidth
                                disabled
                                value={editedProfile?.email || ''}
                                helperText="Email cannot be changed"
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Change Password Section */}
                    <Box
                        sx={{
                            p: 3,
                            bgcolor: 'background.surface',
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Security
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<VpnKeyIcon />}
                            onClick={handleChangePassword}
                            fullWidth
                            sx={{ textTransform: 'none' }}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};
