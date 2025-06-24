import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar,
    Box, TextField, Button, Select, MenuItem as MuiMenuItem, Grid, Card, CardContent,
    Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Fab, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import logo from '../assets/logo catalyze.jfif';
import { logout } from '../redux/features/authSlice';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 220;

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showUsers, setShowUsers] = useState(false);
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.user);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setUsers(data);
        };
        fetchUsers();
        const fetchTasks = async () => {
            const res = await fetch('http://localhost:5000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setTasks(data);
        };
        fetchTasks();
    }, [token]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newTask.title,
                    description: newTask.description,
                    status: 'à faire',
                    assignedTo: newTask.assignedTo
                })
            });
            const data = await res.json();
            if (res.ok) {
                setTasks([...tasks, data]);
                setNewTask({ title: '', description: '', assignedTo: '' });
                setDrawerOpen(false);
            }
        } catch (error) {
            console.error('Erreur serveur');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                const updatedTasks = tasks.map(task =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                );
                setTasks(updatedTasks);
            }
        } catch (error) {
            console.error('Erreur serveur');
        }
    };

    const getStatusColor = (status) => {
        if (status === 'à faire') return '#ff9800';
        if (status === 'en cours') return '#2196f3';
        if (status === 'terminée') return '#4caf50';
        return '#bdbdbd';
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
        window.location.href = '/login';
    };

    const filteredTasks = statusFilter === 'all'
        ? tasks
        : tasks.filter(task => task.status === statusFilter);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6fa' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#212b36', color: '#fff' },
                }}
            >
                <Toolbar sx={{ justifyContent: 'center', bgcolor: '#1a222b' }}>
                    <Box component="img" src={logo} alt="Logo" sx={{ height: 48, borderRadius: 2 }} />
                </Toolbar>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Avatar sx={{ bgcolor: '#1976d2' }}>{user.username[0]?.toUpperCase()}</Avatar>
                        </ListItemIcon>
                        <ListItemText
                            primary={user.username}
                            secondary={user.role}
                            primaryTypographyProps={{ fontWeight: 'bold', color: '#fff' }}
                            secondaryTypographyProps={{ color: '#bdbdbd' }}
                        />
                    </ListItem>
                    {/* Bouton "Tous les utilisateurs" désactivé si déjà affiché */}
                    {user.role === 'manager' && (
                        <ListItem
                            button
                            onClick={() => !showUsers && setShowUsers(true)}
                            disabled={showUsers}
                            sx={showUsers ? { opacity: 0.6 } : {}}
                        >
                            <ListItemIcon>
                                <PersonIcon sx={{ color: '#1976d2' }} />
                            </ListItemIcon>
                            <ListItemText primary="Tous les utilisateurs" />
                        </ListItem>
                    )}
                    <Divider sx={{ my: 1, bgcolor: '#333' }} />
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon sx={{ color: '#fff' }} /></ListItemIcon>
                        <ListItemText primary="Déconnexion" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
                {/* Header : n'affiche que si on n'est PAS sur la vue utilisateurs */}
                {!showUsers && (
                    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', color: '#212b36', boxShadow: 1 }}>
                        <Toolbar>
                            <AssignmentIcon sx={{ mr: 2, color: '#1976d2' }} />
                            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
                                Tableau de bord des tâches
                            </Typography>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                size="small"
                                sx={{ bgcolor: '#f4f6fa', minWidth: 150, mr: 2 }}
                            >
                                <MuiMenuItem value="all">Tous les statuts</MuiMenuItem>
                                <MuiMenuItem value="à faire">À faire</MuiMenuItem>
                                <MuiMenuItem value="en cours">En cours</MuiMenuItem>
                                <MuiMenuItem value="terminée">Terminée</MuiMenuItem>
                            </Select>
                            {user.role === 'manager' && (
                                <Tooltip title="Créer une tâche">
                                    <Fab color="primary" size="small" onClick={() => setDrawerOpen(true)}>
                                        <AddIcon />
                                    </Fab>
                                </Tooltip>
                            )}
                        </Toolbar>
                    </AppBar>
                )}
                <Box sx={{ p: 4 }}>
                    {showUsers ? (
                        // Affichage de la liste des utilisateurs
                        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                            <Typography variant="h4" gutterBottom>Liste des Utilisateurs</Typography>
                            <Button
                                variant="outlined"
                                sx={{ mb: 3 }}
                                onClick={() => setShowUsers(false)}
                            >
                                Retour aux tâches
                            </Button>
                            <List sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
                                {users.map((u) => (
                                    <ListItem key={u._id} sx={{ mb: 1 }}>
                                        <ListItemIcon>
                                            <Avatar sx={{ bgcolor: '#1976d2' }}>
                                                {u.username[0]?.toUpperCase()}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={u.username}
                                            secondary={`Rôle : ${u.role}`}
                                            primaryTypographyProps={{ fontWeight: 600 }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredTasks.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography variant="body1" align="center" color="text.secondary">
                                        Aucune tâche trouvée.
                                    </Typography>
                                </Grid>
                            ) : (
                                filteredTasks.map(task => (
                                    <Grid item xs={12} sm={6} md={4} key={task._id}>
                                        <Card sx={{
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            bgcolor: '#fff',
                                            minHeight: 200,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            borderLeft: `8px solid ${getStatusColor(task.status)}`
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#212b36' }}>
                                                    {task.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 2, color: '#637381' }}>
                                                    {task.description}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1, color: getStatusColor(task.status), fontWeight: 600 }}>
                                                    Statut : {task.status}
                                                </Typography>
                                                <Select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    sx={{ bgcolor: '#f4f6fa', borderRadius: 1, mb: 1 }}
                                                >
                                                    <MuiMenuItem value="à faire">À faire</MuiMenuItem>
                                                    <MuiMenuItem value="en cours">En cours</MuiMenuItem>
                                                    <MuiMenuItem value="terminée">Terminée</MuiMenuItem>
                                                </Select>
                                                {task.assignedTo && (
                                                    <Typography variant="body2" sx={{ mt: 1, color: '#1976d2' }}>
                                                        Assigné à : {users.find(u => String(u._id) === String(task.assignedTo))?.username || 'Inconnu'}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                </Box>

                {/* Drawer pour création de tâche */}
                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3 } }}
                >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Créer une nouvelle tâche</Typography>
                    <Box component="form" onSubmit={handleAddTask}>
                        <TextField
                            label="Titre"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            fullWidth
                            multiline
                            minRows={3}
                            sx={{ mb: 2 }}
                        />
                        <Select
                            value={newTask.assignedTo}
                            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                            displayEmpty
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        >
                            <MuiMenuItem value="" disabled>Assigner à un utilisateur</MuiMenuItem>
                            {users.map(userOption => (
                                <MuiMenuItem key={userOption._id} value={userOption._id}>
                                    {userOption.username}
                                </MuiMenuItem>
                            ))}
                        </Select>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Ajouter la tâche
                        </Button>
                    </Box>
                </Drawer>
            </Box>
        </Box>
    );
};

export default Dashboard;