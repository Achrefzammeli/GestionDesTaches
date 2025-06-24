import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Card, CardContent } from '@mui/material';

const AdminPage = () => {
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
   // console.log('Token utilisé :', token);
    const fetchUsers = async () => {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.error('Accès refusé ou erreur serveur');
      }
    };

    // Vérification si c’est un manager
    if (user && user.role === 'manager') {
      fetchUsers();
    }
  }, [token, user]);

  if (user && user.role !== 'manager') {
    return <Typography variant="h6" textAlign="center" mt={5}>Accès refusé</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Liste des Utilisateurs</Typography>
      {users.map((u) => (
        <Card key={u._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{u.username}</Typography>
            <Typography color="text.secondary">Rôle : {u.role}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default AdminPage;
