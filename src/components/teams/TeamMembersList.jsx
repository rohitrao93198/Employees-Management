import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Checkbox
} from '@mui/material';

const TeamMembersList = ({ team, users, onUpdate }) => {
    const handleToggleMember = (userId) => {
        const currentMembers = team.members || [];

        const isCurrentMember = currentMembers.includes(userId);

        if (isCurrentMember) {
            const updatedMembers = currentMembers.filter(id => id !== userId);
            onUpdate(updatedMembers);
        } else {
            const updatedMembers = [...currentMembers, userId];
            onUpdate(updatedMembers);
        }
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell align="center">Add to Team</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'ADMIN' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={(team.members || []).includes(user.id)}
                                        onChange={() => handleToggleMember(user.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography color="textSecondary">
                                    No users available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TeamMembersList;