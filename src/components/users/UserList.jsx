import React from 'react';
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
    Chip,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '../../utils/dateUtils';

const UserList = ({ users, onViewProfile, onDelete, showActions }) => {
    const getDesignationLabel = (designation) => {
        if (designation === 'frontend') {
            return 'Frontend Developer';
        } else if (designation === 'backend') {
            return 'Backend Developer';
        } else if (designation === 'fullstack') {
            return 'Full Stack Developer';
        } else if (designation === 'tester') {
            return 'Tester';
        } else {
            return designation || 'Not Assigned';
        }
    };

    const getDesignationColor = (designation) => {
        if (designation === 'frontend') {
            return 'info';
        } else if (designation === 'backend') {
            return 'success';
        } else if (designation === 'fullstack') {
            return 'primary';
        } else if (designation === 'tester') {
            return 'warning';
        } else {
            return 'default';
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Created At</TableCell>
                        {showActions && <TableCell>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
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
                                    label={user.role}
                                    color={user.role === 'ADMIN' ? 'primary' : 'default'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            {showActions && (
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => onViewProfile(user)}
                                        >
                                            View Profile
                                        </Button>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onDelete(user)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserList;