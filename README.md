

# 📂 Catalyze - Gestion des utilisateurs et des tâches

### 🛠️ Technologies :

* **Backend :** Node.js, Express.js, MongoDB, Mongoose
* **Frontend :** React.js, Redux Toolkit, Material UI
* **Authentification :** JWT (JSON Web Token)

---

## 🎯 Description

**Catalyze** est une application web fullstack de gestion des tâches, avec une authentification sécurisée et un système de gestion des rôles.

Elle permet :

* La gestion des utilisateurs avec authentification via JWT.
* La création, modification et suppression de tâches.
* La gestion des permissions en fonction des rôles : `Utilisateur` ou `Manager`.
* Un tableau de bord moderne avec filtrage par statut et assignation des tâches.
* Une interface responsive et élégante grâce à Material UI.

---



## 🚀 Fonctionnalités

* 🔐 **Authentification sécurisée :** Inscription, connexion, stockage du token JWT.
* 👤 **Gestion des rôles :**

  * **Manager :** accès global aux tâches, création et assignation des tâches à n'importe quel utilisateur, visualisation de tous les utilisateurs.
  * **Utilisateur :** accès uniquement à ses propres tâches, modification de leur statut.
* 📝 **CRUD des tâches :** créer, lire, modifier, supprimer.
* ✅ **Filtrage des tâches par statut :** "à faire", "en cours", "terminée".
* 🎨 **Interface moderne et responsive :** design avec Material UI.
* 🔒 **Gestion sécurisée des routes :** accès protégé par token.

---

## 🗂️ Structure du projet

```text
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   └── app.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── redux
│   │   └── App.js
```

---

## ⚙️ Installation


```bash
cd backend
npm install
npm start
```

> Le serveur tourne sur `http://localhost:5000`

### 3️⃣ Frontend

```bash
cd frontend
npm install
npm start
```

> L’application tourne sur `http://localhost:3000`

---

## 🔗 Technologies utilisées

* **Node.js**
* **Express.js**
* **MongoDB / Mongoose**
* **React.js**
* **Redux Toolkit**
* **Material UI**
* **JWT (JSON Web Token)**

---

## 📌 Points d’apprentissage

* Mise en place d'une API sécurisée
* Utilisation de Redux Toolkit pour la gestion d’état
* Mise en place de Material UI pour un design moderne
* Gestion des rôles et permissions
* Création d’un CRUD complet

---

## 🙋‍♂️ Auteur

**Achref Zammeli**
*Étudiant en 2ème année cycle ingénieur informatique - Spécialité Cloud Computing*
[LinkedIn][(https://www.linkedin.com/in/achref-zammeli-7926601ba/) | [achref.zammeli@esprit.tn](mailto:achref.zammeli@esprit.tn)

---

## ⭐ Remarques

> Ce projet a été réalisé dans un objectif d’apprentissage et de montée en compétences. Il peut servir de base pour des projets de gestion plus avancés.


