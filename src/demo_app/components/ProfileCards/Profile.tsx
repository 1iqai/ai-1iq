import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Avatar,
    Button,
    Divider,
    CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { EditProfileModal } from './EditProfileModal';

type UserInfo = {
    username: string;
    name: string;
    email: string;
    role: string;
    image: string;
}

type ProfileProps = {
    initialProfile: UserInfo;
    onClose: () => void;
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

const ProfilePage: React.FC<ProfileProps> = ({ initialProfile, onClose }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<UserInfo | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (initialProfile) {
            setData(initialProfile);
        } else {
            setData(null);
        }
        setLoading(false);
    }, [initialProfile]);

    const handleEditSuccess = (updatedProfile: UserInfo) => {
        setData(updatedProfile);
    };

    if (loading) {
        return (
            <Modal open={true} onClose={onClose}>
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                </Box>
            </Modal>
        );
    }

    const profile = data || initialProfile;

    return (
        <>
            <Modal open={true} onClose={onClose}>
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
                            Profile Details
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditModalOpen(true)}
                                sx={{ textTransform: 'none' }}
                            >
                                Edit Profile
                            </Button>
                            <IconButton onClick={onClose} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ overflow: 'auto', flex: 1, p: 3 }}>
                        {/* Profile Header */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                p: 3,
                                bgcolor: 'background.surface',
                                borderRadius: 2,
                                mb: 3,
                            }}
                        >
                            <Avatar
                                src={profile?.image || 'https://placehold.co/128x128/e2e8f0/0f172a?text=User'}
                                alt={profile?.name}
                                sx={{ width: 80, height: 80 }}
                            />
                            <Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {profile?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    @{profile?.username}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {profile?.email}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Account Information */}
                        <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                Account Information
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        Full Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {profile?.name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        Username
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        @{profile?.username}
                                    </Typography>
                                </Box>
                                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        Email Address
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {profile?.email}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        Role
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {profile?.role}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <EditProfileModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    profile={profile}
                    onSuccess={handleEditSuccess}
                />
            )}
        </>
    );
};

export default ProfilePage;
