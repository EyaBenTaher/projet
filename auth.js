// ========================================
// AUTH.JS - Gestion de l'authentification
// ========================================

// Vérifier si l'utilisateur est connecté
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// ========================================
// VALIDATION
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        const input = errorElement.previousElementSibling;
        if (input) input.classList.add('invalid');
        errorElement.classList.add('show');
        
        setTimeout(() => {
            errorElement.classList.remove('show');
            if (input) input.classList.remove('invalid');
        }, 3000);
    }
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input) input.classList.remove('invalid');
    if (error) error.classList.remove('show');
}

// ========================================
// INSCRIPTION
// ========================================
function handleInscription(event) {
    event.preventDefault();
    
    // Récupérer les valeurs
    const nomComplet = document.getElementById('nomComplet').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Réinitialiser les erreurs
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('input').forEach(el => el.classList.remove('invalid', 'valid'));
    
    let isValid = true;
    
    // Validation du nom
    if (nomComplet.length < 3) {
        showError('nomError');
        isValid = false;
    } else {
        document.getElementById('nomComplet').classList.add('valid');
    }
    
    // Validation de l'email
    if (!validateEmail(email)) {
        showError('emailError');
        isValid = false;
    } else {
        // Vérifier si l'email existe déjà
        if (users.find(u => u.email === email)) {
            const emailError = document.getElementById('emailError');
            emailError.textContent = 'Cet email est déjà utilisé';
            showError('emailError');
            isValid = false;
        } else {
            document.getElementById('email').classList.add('valid');
        }
    }
    
    // Validation du téléphone
    if (telephone.length !== 8 || !/^\d{8}$/.test(telephone)) {
        showError('telError');
        isValid = false;
    } else {
        document.getElementById('telephone').classList.add('valid');
    }
    
    // Validation du mot de passe
    if (password.length < 8) {
        showError('passwordError');
        isValid = false;
    } else {
        document.getElementById('password').classList.add('valid');
    }
    
    // Validation de la confirmation
    if (password !== confirmPassword) {
        showError('confirmError');
        isValid = false;
    } else if (confirmPassword.length >= 8) {
        document.getElementById('confirmPassword').classList.add('valid');
    }
    
    if (!isValid) return;
    
    // Créer le nouvel utilisateur
    const newUser = {
        id: Date.now(),
        nomComplet,
        email,
        telephone,
        password,
        dateInscription: new Date().toISOString()
    };
    
    // Sauvegarder
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Message de succès
    alert('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.');
    
    // Redirection
    setTimeout(() => {
        window.location.href = 'connexion.html';
    }, 500);
}

// ========================================
// CONNEXION
// ========================================
function handleConnexion(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Réinitialiser les erreurs
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('input').forEach(el => el.classList.remove('invalid'));
    
    // Chercher l'utilisateur
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Connexion réussie
        currentUser = {
            id: user.id,
            nom: user.nomComplet,
            email: user.email,
            telephone: user.telephone
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('✅ Connexion réussie ! Bienvenue ' + currentUser.nom);
        
        // Redirection vers la page d'accueil
        setTimeout(() => {
            window.location.href = 'projet1.html';
        }, 500);
    } else {
        // Échec de connexion
        alert('❌ Email ou mot de passe incorrect');
        document.getElementById('loginEmail').classList.add('invalid');
        document.getElementById('loginPassword').classList.add('invalid');
    }
}

// ========================================
// DÉCONNEXION
// ========================================
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('currentUser');
        currentUser = null;
        alert('Vous avez été déconnecté avec succès');
        window.location.href = 'projet1.html';
    }
}

// ========================================
// VALIDATION EN TEMPS RÉEL
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Validation du nom en temps réel
    const nomInput = document.getElementById('nomComplet');
    if (nomInput) {
        nomInput.addEventListener('input', function() {
            if (this.value.trim().length >= 3) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                clearError('nomComplet', 'nomError');
            } else {
                this.classList.remove('valid');
            }
        });
    }
    
    // Validation de l'email en temps réel
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (validateEmail(this.value.trim())) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                clearError('email', 'emailError');
            } else {
                this.classList.remove('valid');
            }
        });
    }
    
    // Validation du téléphone en temps réel
    const telInput = document.getElementById('telephone');
    if (telInput) {
        telInput.addEventListener('input', function() {
            // Limiter à 8 chiffres
            this.value = this.value.replace(/\D/g, '').substring(0, 8);
            
            if (this.value.length === 8) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                clearError('telephone', 'telError');
            } else {
                this.classList.remove('valid');
            }
        });
    }
    
    // Validation du mot de passe en temps réel
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length >= 8) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                clearError('password', 'passwordError');
            } else {
                this.classList.remove('valid');
            }
            
            // Vérifier aussi la confirmation si elle est remplie
            const confirmInput = document.getElementById('confirmPassword');
            if (confirmInput && confirmInput.value) {
                if (this.value === confirmInput.value) {
                    confirmInput.classList.remove('invalid');
                    confirmInput.classList.add('valid');
                    clearError('confirmPassword', 'confirmError');
                } else {
                    confirmInput.classList.remove('valid');
                }
            }
        });
    }
    
    // Validation de la confirmation en temps réel
    const confirmInput = document.getElementById('confirmPassword');
    if (confirmInput) {
        confirmInput.addEventListener('input', function() {
            const password = document.getElementById('password').value;
            if (this.value === password && this.value.length >= 8) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                clearError('confirmPassword', 'confirmError');
            } else {
                this.classList.remove('valid');
            }
        });
    }
});

// Rendre les fonctions disponibles globalement
window.handleInscription = handleInscription;
window.handleConnexion = handleConnexion;
window.logout = logout;