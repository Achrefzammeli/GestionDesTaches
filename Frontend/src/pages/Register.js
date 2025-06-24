import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, setError } from '../redux/features/authSlice';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';

const Register = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',       // Par défaut 'user'
    birthDate: '',      // Date de naissance optionnelle
  });

  const { username, password, role, birthDate } = formData;

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, birthDate })
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Inscription réussie !');
        // Ici tu peux rediriger vers login ou dashboard
      } else {
        dispatch(setError(data.message || 'Erreur inscription'));
      }

    } catch (error) {
      dispatch(setError('Erreur serveur'));
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h4" mb={3} textAlign="center">Inscription</Typography>
      <form onSubmit={handleSubmit}>
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
        <TextField
          select
          label="Rôle"
          name="role"
          value={role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="user">Utilisateur</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
        </TextField>
        <TextField
          label="Date de naissance"
          name="birthDate"
          type="date"
          value={birthDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          S'inscrire
        </Button>
      </form>
    </Box>
  );
};

export default Register;
