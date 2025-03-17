import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Collapse,
    Box,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate, formatDisplayDate } from '../../utils/dateUtils';

const CURRENT_TIME = '2025-03-11 08:00:47';
const CURRENT_USER = 'rohitrao93198';

const TeamList = ({
    teams,
    users,
    showActions = true,
    isReadOnly = false,
    onUpdate,
    onDelete
}) => {
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleExpandClick = (teamId) => {
        setExpandedTeam(expandedTeam === teamId ? null : teamId);
    };

    const handleEditMembers = (team) => {
        setSelectedTeam(team);
        setSelectedMembers(team.members.map(member => ({
            ...member,
            ...users.find(user => user.id === member.userId)
        })));
        setOpenDialog(true);
    };

    const handleSaveMembers = () => {
        if (selectedTeam) {
            onUpdate(teams.map(team =>
                team.id === selectedTeam.id
                    ? { ...team, members: selectedMembers }
                    : team
            ));
            setOpenDialog(false);
        }
    };

    const toggleMember = (user) => {
        const isSelected = selectedMembers.some(member => member.userId === user.id);
        setSelectedMembers(isSelected
            ? selectedMembers.filter(member => member.userId !== user.id)
            : [...selectedMembers, {
                userId: user.id,
                name: user.name,
                email: user.email,
                designation: user.designation || '',
                role: user.role || 'EMPLOYEE'
            }]
        );
    };

    const getDesignationLabel = (designation) => {
        const labels = {
            frontend: 'Frontend Developer',
            backend: 'Backend Developer',
            fullstack: 'Full Stack Developer',
            tester: 'Tester'
        };
        return labels[designation] || designation || 'Not Assigned';
    };

    const getDesignationColor = (designation) => {
        const colors = {
            frontend: 'info',
            backend: 'success',
            fullstack: 'primary',
            tester: 'warning'
        };
        return colors[designation] || 'default';
    };

    const getRoleColor = (role) => {
        const colors = {
            ADMIN: 'secondary',
            SUPER_ADMIN: 'error'
        };
        return colors[role] || 'default';
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Team Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Members</TableCell>
                            <TableCell>Created At</TableCell>
                            {showActions && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.map((team) => (
                            <React.Fragment key={`team-${team.id}`}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleExpandClick(team.id)}
                                        >
                                            {expandedTeam === team.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{team.name}</TableCell>
                                    <TableCell>{team.description}</TableCell>
                                    <TableCell>{team.members.length}</TableCell>
                                    <TableCell>
                                        {formatDate(team.createdAt)}
                                    </TableCell>
                                    {showActions && (
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleEditMembers(team)}
                                                >
                                                    Edit Members
                                                </Button>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => onDelete(team)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                                <TableRow key={`collapse-${team.id}`}>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={expandedTeam === team.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Team Members
                                                </Typography>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell>Designation</TableCell>
                                                            <TableCell>Role</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {team.members.map((member) => {
                                                            const userInfo = users.find(user => user.id === member.userId);
                                                            return (
                                                                <TableRow key={`member-${team.id}-${member.userId}`}>
                                                                    <TableCell>{userInfo?.name || member.name}</TableCell>
                                                                    <TableCell>{userInfo?.email || ''}</TableCell>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={getDesignationLabel(userInfo?.designation)}
                                                                            color={getDesignationColor(userInfo?.designation)}
                                                                            size="small"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={userInfo?.role || 'EMPLOYEE'}
                                                                            color={getRoleColor(userInfo?.role)}
                                                                            size="small"
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Team Members</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Designation</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={`user-${user.id}`}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getDesignationLabel(user.designation)}
                                                color={getDesignationColor(user.designation)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role || 'EMPLOYEE'}
                                                color={getRoleColor(user.role)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant={selectedMembers.some(member => member.userId === user.id) ? "contained" : "outlined"}
                                                size="small"
                                                onClick={() => toggleMember(user)}
                                            >
                                                {selectedMembers.some(member => member.userId === user.id) ? "Remove" : "Add"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveMembers} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TeamList;