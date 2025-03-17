import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    CardContent,
    Chip,
    DialogContentText,
    TextField,
    Alert
} from '@mui/material';
import { storage } from '../../utils/localStorage';
import UserList from '../users/UserList';
import UserForm from '../users/UserForm';
import TeamList from '../teams/TeamList';
import TeamForm from '../teams/TeamForm';
import UserProfileView from '../users/UserProfileView';
import { useAuth } from '../../context/AuthContext';

const CURRENT_TIME = new Date().toISOString();
const CREATOR_NAME = storage.getCurrentUser()?.name || 'Admin';

const AdminDashboard = () => {
    const { user: currentUser } = useAuth();
    const [tab, setTab] = useState(0);
    const [users, setUsers] = useState({ admins: [], employees: [] });
    const [teams, setTeams] = useState([]);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openTeamDialog, setOpenTeamDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('');
    const [openAdminProfileDialog, setOpenAdminProfileDialog] = useState(false);
    const [profileError, setProfileError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allUsers = storage.getUsers();
        setUsers({
            admins: allUsers.filter(user =>
                user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
            ),
            employees: allUsers.filter(user => user.role === 'EMPLOYEE')
        });
        setTeams(storage.getTeams());
    };

    const handleUserSubmit = (userData) => {
        const newUser = {
            ...userData,
            id: Date.now(),
            role: 'EMPLOYEE',
            createdAt: CURRENT_TIME,
            createdBy: CREATOR_NAME,
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
            createdBy: CREATOR_NAME,
            createdByUserId: currentUser.id
        };
        storage.setTeams([...teams, newTeam]);
        loadData();
        setOpenTeamDialog(false);
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setOpenProfileDialog(true);
    };

    const handleUpdateUser = (userId, updatedData) => {
        if (!updatedData) return;
        const allUsers = storage.getUsers();
        const userToUpdate = allUsers.find(u => u.id === userId);

        if (!userToUpdate || userToUpdate.role === 'SUPER_ADMIN') {
            setOpenProfileDialog(false);
            return;
        }

        const finalData = {
            ...userToUpdate,
            ...updatedData,
            updatedAt: CURRENT_TIME,
            updatedBy: CREATOR_NAME,
            updatedByUserId: currentUser.id
        };

        storage.setUsers(allUsers.map(user =>
            user.id === userId ? finalData : user
        ));
        loadData();
        setOpenProfileDialog(false);
    };

    const handleDeleteClick = (item, type) => {
        setItemToDelete(item);
        setDeleteType(type);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteType === 'user') {
            storage.setUsers(storage.getUsers().filter(user =>
                user.id !== itemToDelete.id
            ));
            storage.setTeams(teams.map(team => ({
                ...team,
                members: team.members.filter(member =>
                    member.userId !== itemToDelete.id
                )
            })));
        } else if (deleteType === 'team') {
            storage.setTeams(teams.filter(team =>
                team.id !== itemToDelete.id
            ));
        }
        loadData();
        setOpenDeleteDialog(false);
        setItemToDelete(null);
    };

    const canEditUser = (user) =>
        user.role !== 'SUPER_ADMIN' && user.id !== currentUser.id;

    const handleAdminProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');

        const newPassword = formData.get('newPassword');
        if (newPassword && newPassword.length < 6) {
            setProfileError('New password must be at least 6 characters');
            return;
        }

        const updatedUser = {
            ...currentUser,
            name: formData.get('name'),
            email: formData.get('email'),
            ...(newPassword && { password: newPassword }),
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.name,
            updatedByUserId: currentUser.id
        };

        try {
            const allUsers = storage.getUsers();
            storage.setUsers(allUsers.map(user =>
                user.id === currentUser.id ? updatedUser : user
            ));
            storage.setCurrentUser(updatedUser);
            loadData();
            setOpenAdminProfileDialog(false);
            setProfileError('');
        } catch (error) {
            console.error('Error updating profile:', error);
            setProfileError('Failed to update profile');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                    <Tab label="Admin Network" />
                    <Tab label="Employees" />
                    <Tab label="Teams" />
                </Tabs>
            </Box>

            {tab === 0 && (
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                        {users.admins.map((admin) => (
                            <Grid item xs={12} md={6} key={admin.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {admin.name}
                                            {admin.id === currentUser.id && (
                                                <Chip label="You" color="primary"
                                                    size="small" sx={{ ml: 1 }} />
                                            )}
                                            {admin.role === 'SUPER_ADMIN' && (
                                                <Chip label="Super Admin"
                                                    color="secondary"
                                                    size="small"
                                                    sx={{ ml: 1 }} />
                                            )}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            {admin.email}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewProfile(admin)}
                                            sx={{ mt: 1 }}
                                        >
                                            View Profile
                                        </Button>
                                        {admin.id === currentUser.id && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => setOpenAdminProfileDialog(true)}
                                                sx={{ mt: 1, ml: 1 }}
                                            >
                                                Edit Profile
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {tab === 1 && (
                <Paper sx={{ p: 2 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={() => setOpenUserDialog(true)}
                        >
                            Add Employee
                        </Button>
                    </Box>
                    <UserList
                        users={users.employees}
                        onViewProfile={handleViewProfile}
                        onDelete={(user) => handleDeleteClick(user, 'user')}
                        showActions={true}
                    />
                </Paper>
            )}

            {tab === 2 && (
                <Paper sx={{ p: 2 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={() => setOpenTeamDialog(true)}
                        >
                            Create Team
                        </Button>
                    </Box>
                    <TeamList
                        teams={teams}
                        users={[...users.employees, ...users.admins]}
                        onUpdate={(updatedTeams) => {
                            storage.setTeams(updatedTeams);
                            loadData();
                        }}
                        onDelete={(team) => handleDeleteClick(team, 'team')}
                    />
                </Paper>
            )}

            <Dialog
                open={openUserDialog}
                onClose={() => setOpenUserDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogContent>
                    <UserForm onSubmit={handleUserSubmit} role="EMPLOYEE" />
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
                open={openProfileDialog}
                onClose={() => setOpenProfileDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedUser?.role === 'SUPER_ADMIN' ? 'Super Admin Profile' : 'User Profile'}
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <UserProfileView
                            user={selectedUser}
                            teams={teams.filter(team =>
                                team.members.some(member =>
                                    member.userId === selectedUser.id
                                )
                            )}
                            isAdminView={true}
                            canEdit={canEditUser(selectedUser)}
                            onUpdate={handleUpdateUser}
                            onClose={() => setOpenProfileDialog(false)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProfileDialog(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`Are you sure you want to delete the ${deleteType === 'user' ? 'employee' : 'team'} "${itemToDelete?.name}"?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAdminProfileDialog}
                onClose={() => {
                    setOpenAdminProfileDialog(false);
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
                        onSubmit={handleAdminProfileUpdate}
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
                                onClick={() => setOpenAdminProfileDialog(false)}
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
        </Container>
    );
};

export default AdminDashboard;