import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, setError } from '../redux/features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Avatar,
    Stack
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const { username, password } = formData;

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(loginSuccess({ user: data.user, token: data.token }));
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                dispatch(setError(data.message || 'Erreur connexion'));
            }
        } catch (error) {
            dispatch(setError('Erreur serveur'));
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f4f6fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
                <Stack alignItems="center" spacing={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <LockOutlinedIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" fontWeight={700}>Connexion</Typography>
                </Stack>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Nom d'utilisateur"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2, mb: 1 }}
                    >
                        Se connecter
                    </Button>
                </Box>
                <Box mt={2}>
                    <Typography variant="body2" align="center">
                        <Link to="/reset-password" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                            Mot de passe oublié ?
                        </Link>
                    </Typography>
                    <Typography variant="body2" align="center" mt={1}>
                        Pas encore de compte ?{' '}
                        <Link to="/register" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                            Inscrivez-vous ici
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;