import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Card,
    CardContent,
    Grid,
    TextField,
    Alert,
    DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { storage } from '../../utils/localStorage';
import UserList from '../users/UserList';
import UserForm from '../users/UserForm';
import TeamList from '../teams/TeamList';
import TeamForm from '../teams/TeamForm';
import UserProfileView from '../users/UserProfileView';
import { useAuth } from '../../context/AuthContext';

const CURRENT_TIME = new Date().toISOString();
const CREATOR_NAME = 'Super Admin';

const SuperAdminDashboard = () => {
    const { user: currentUser, updateCurrentUser } = useAuth();
    const [tab, setTab] = useState(0);
    const [users, setUsers] = useState({ admins: [], employees: [] });
    const [teams, setTeams] = useState([]);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openTeamDialog, setOpenTeamDialog] = useState(false);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [openProfileViewDialog, setOpenProfileViewDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userFormRole, setUserFormRole] = useState('EMPLOYEE');
    const [profileError, setProfileError] = useState('');
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('user');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allUsers = storage.getUsers();
        setUsers({
            admins: allUsers.filter(user =>
                (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') &&
                user.id !== currentUser.id
            ),
            employees: allUsers.filter(user => user.role === 'EMPLOYEE')
        });
        setTeams(storage.getTeams());
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const name = formData.get('name');
        const email = formData.get('email');

        // Remove password validation temporarily for testing
        // if (currentPassword !== currentUser.password) {
        //     setProfileError('Current password is incorrect');
        //     return;
        // }

        // Validate new password only if provided
        if (newPassword && newPassword.length < 6) {
            setProfileError('New password must be at least 6 characters');
            return;
        }

        const updatedUser = {
            ...currentUser,
            name,
            email,
            password: newPassword || currentUser.password,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.name,
            updatedByUserId: currentUser.id
        };

        try {
            const allUsers = storage.getUsers();
            // Update user in storage
            storage.setUsers(allUsers.map(user =>
                user.id === currentUser.id ? updatedUser : user
            ));
            // Update current user in context
            updateCurrentUser(updatedUser);
            setOpenProfileDialog(false);
            setProfileError('');
            loadData(); // Refresh the data
        } catch (error) {
            console.error('Error updating profile:', error);
            setProfileError('Failed to update profile');
        }
    };

    const handleUserSubmit = (userData) => {
        const newUser = {
            ...userData,
            id: Date.now(),
            role: userFormRole,
            designation: userFormRole === 'ADMIN' ? 'Admin' : userData.designation,
            createdAt: CURRENT_TIME,
            createdBy: currentUser.name,
            createdByUserId: currentUser.id,
            updatedAt: CURRENT_TIME,
            updatedBy: CREATOR_NAME,
            updatedByUserId: currentUser.id
        };

        storage.setUsers([...storage.getUsers(), newUser]);
        loadData();
        setOpenUserDialog(false);
    };

    const handleTeamSubmit = (teamData) => {
        const newTeam = {
            ...teamData,
            id: Date.now(),
            members: [],
            createdAt: CURRENT_TIME,
            createdBy: currentUser.name,
            createdByUserId: currentUser.id
        };
        storage.setTeams([...teams, newTeam]);
        loadData();
        setOpenTeamDialog(false);
    };

    const handleDeleteUser = (user) => {
        if (user.role === 'SUPER_ADMIN') {
            alert('Super Admin accounts cannot be deleted');
            return;
        }
        setDeleteType('user');
        setItemToDelete(user);
        setConfirmDeleteDialog(true);
    };

    const handleDeleteTeam = (team) => {
        setDeleteType('team');
        setItemToDelete(team);
        setConfirmDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteType === 'user') {
            storage.setTeams(teams.map(team => ({
                ...team,
                members: team.members.filter(member => member.userId !== itemToDelete.id)
            })));
            storage.setUsers(storage.getUsers().filter(user => user.id !== itemToDelete.id));
        } else {
            storage.setTeams(teams.filter(t => t.id !== itemToDelete.id));
        }
        setConfirmDeleteDialog(false);
        setItemToDelete(null);
        loadData();
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setOpenProfileViewDialog(true);
    };

    const handleUserUpdate = (userId, updatedData) => {
        if (!updatedData) return;

        const allUsers = storage.getUsers();
        const userToUpdate = allUsers.find(u => u.id === userId);

        if (!userToUpdate || userToUpdate.role === 'SUPER_ADMIN') return;

        // Create updated user data
        const finalData = {
            ...userToUpdate,
            name: updatedData.name || userToUpdate.name,
            email: updatedData.email || userToUpdate.email,
            password: updatedData.password || userToUpdate.password, // Make sure password is updated
            role: userToUpdate.role, // Preserve original role
            designation: userToUpdate.role === 'ADMIN' ? 'Admin' : updatedData.designation,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.name,
            updatedByUserId: currentUser.id
        };

        try {
            // Update in localStorage
            const updatedUsers = allUsers.map(user =>
                user.id === userId ? finalData : user
            );
            storage.setUsers(updatedUsers);

            // Refresh data
            loadData();
            setOpenProfileViewDialog(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                                {currentUser.name.charAt(0)}
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h5">{currentUser.name}</Typography>
                            <Typography color="textSecondary">{currentUser.email}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Role: Super Admin
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => setOpenProfileDialog(true)}
                            >
                                Edit Profile
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                    <Tab label="Admins" />
                    <Tab label="Employees" />
                    <Tab label="Teams" />
                </Tabs>
            </Box>

            {tab === 0 && (
                <Paper sx={{ p: 2 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => {
                                setUserFormRole('ADMIN');
                                setOpenUserDialog(true);
                            }}
                        >
                            Add New Admin
                        </Button>
                    </Box>
                    <UserList
                        users={users.admins}
                        onDelete={handleDeleteUser}
                        onViewProfile={handleViewProfile}
                        showActions={true}
                    />
                </Paper>
            )}

            {tab === 1 && (
                <Paper sx={{ p: 2 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => {
                                setUserFormRole('EMPLOYEE');
                                setOpenUserDialog(true);
                            }}
                        >
                            Add New Employee
                        </Button>
                    </Box>
                    <UserList
                        users={users.employees}
                        onDelete={handleDeleteUser}
                        onViewProfile={handleViewProfile}
                        showActions={true}
                    />
                </Paper>
            )}

            {tab === 2 && (
                <Paper sx={{ p: 2 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<GroupAddIcon />}
                            onClick={() => setOpenTeamDialog(true)}
                        >
                            Create New Team
                        </Button>
                    </Box>
                    <TeamList
                        teams={teams}
                        users={[...users.admins, ...users.employees]}
                        onUpdate={(updatedTeams) => {
                            storage.setTeams(updatedTeams);
                            loadData();
                        }}
                        onDelete={handleDeleteTeam}
                    />
                </Paper>
            )}

            <Dialog
                open={openProfileDialog}
                onClose={() => {
                    setOpenProfileDialog(false);
                    setProfileError('');
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    {profileError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {profileError}
                        </Alert>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleProfileUpdate}
                        sx={{ mt: 2 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Name"
                                    defaultValue={currentUser.name}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    type="email"
                                    defaultValue={currentUser.email}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="newPassword"
                                    label="New Password (optional)"
                                    type="password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="currentPassword"
                                    label="Current Password"
                                    type="password"
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => setOpenProfileDialog(false)}
                                sx={{ mr: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                Save Changes
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog
                open={openUserDialog}
                onClose={() => setOpenUserDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Add New {userFormRole === 'ADMIN' ? 'Admin' : 'Employee'}
                </DialogTitle>
                <DialogContent>
                    <UserForm onSubmit={handleUserSubmit} role={userFormRole} />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openTeamDialog}
                onClose={() => setOpenTeamDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Create New Team</DialogTitle>
                <DialogContent>
                    <TeamForm onSubmit={handleTeamSubmit} />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openProfileViewDialog}
                onClose={() => setOpenProfileViewDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedUser?.role === 'SUPER_ADMIN' ? 'Super Admin Profile' : 'Edit User Profile'}
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <UserProfileView
                            user={selectedUser}
                            teams={teams.filter(team =>
                                team.members.some(member => member.userId === selectedUser.id)
                            )}
                            onClose={() => setOpenProfileViewDialog(false)}
                            onUpdate={handleUserUpdate}
                            isAdminView={true}
                            isSuperAdminView={true}
                            canEdit={true}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProfileViewDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDeleteDialog}
                onClose={() => setConfirmDeleteDialog(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the {deleteType} "{itemToDelete?.name}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SuperAdminDashboard;