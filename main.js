let currentUser = null;
        let selectedDoctor = null;
        let doctors = [
            {id: 1, name: "Dr. Amina Ben Ali", specialty: "Cardiologue", location: "Tunis", phone: "71 234 567", rating: 4.8, reviews: []},
            {id: 2, name: "Dr. Mohamed Trabelsi", specialty: "Dermatologue", location: "Sfax", phone: "74 123 456", rating: 4.5, reviews: []},
            {id: 3, name: "Dr. Salma Gharbi", specialty: "Pédiatre", location: "Sousse", phone: "73 345 678", rating: 4.9, reviews: []},
            {id: 4, name: "Dr. Karim Mansour", specialty: "Dentiste", location: "Monastir", phone: "73 456 789", rating: 4.7, reviews: []},
            {id: 5, name: "Dr. Leila Hamdi", specialty: "Généraliste", location: "Tunis", phone: "71 567 890", rating: 4.6, reviews: []},
            {id: 6, name: "Dr. Ahmed Jaziri", specialty: "Cardiologue", location: "Bizerte", phone: "72 678 901", rating: 4.4, reviews: []},
            {id: 7, name: "Dr. sarah salhi", specialty: "Pédiatre", location: "Monastir", phone: "72 678 346", rating: 4.5, reviews: []},
            {id: 8, name: "Dr. Aya ben marzoug", specialty: "psychiatre", location:"Mahdia", phone: "72 520 901", rating: 4.4, reviews: []}
        ];
        let appointments = [];

        function displayDoctors(doctorsList) {
            const grid = document.getElementById('doctorsGrid');
            const resultsCount = document.getElementById('resultsCount');
            grid.innerHTML = '';
            
            resultsCount.textContent = `${doctorsList.length} médecin${doctorsList.length > 1 ? 's' : ''} trouvé${doctorsList.length > 1 ? 's' : ''}`;
            
            doctorsList.forEach(doctor => {
                const card = document.createElement('div');
                card.className = 'doctor-card';
                card.innerHTML = `
                    <div class="doctor-avatar">${doctor.name.charAt(4)}</div>
                    <div class="doctor-name">${doctor.name}</div>
                    <div style="text-align: center;">
                        <span class="doctor-specialty">${doctor.specialty}</span>
                    </div>
                    <div class="doctor-info">📍 ${doctor.location}</div>
                    <div class="doctor-info">📞 ${doctor.phone}</div>
                    <div class="rating">⭐ ${doctor.rating} (${doctor.reviews.length} avis)</div>
                    <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="openAppointment(${doctor.id})">
                      Prendre un rendz-vous
                    </button>
                    <button class="btn-secondary" style="width: 100%; margin-top: 0.5rem;" onclick="showReviews(${doctor.id})">
                        <a style=href="connexion.html" >Voir les avis</a>
                    </button>
                `;
                grid.appendChild(card);
            });
        }

        function searchDoctors() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const specialty = document.getElementById('specialtyFilter').value;
            
            const filtered = doctors.filter(doctor => {
                const matchesSearch = doctor.name.toLowerCase().includes(searchTerm);
                const matchesSpecialty = !specialty || doctor.specialty === specialty;
                return matchesSearch && matchesSpecialty;
            });
            
            displayDoctors(filtered);
        }

       

       
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }
        

        function updateUIForLoggedInUser() {
            document.getElementById('authButtons').classList.add('hidden');
            document.getElementById('userSection').classList.remove('hidden');
            document.getElementById('appointmentsBtn').classList.remove('hidden');
        }

        function openAppointment(doctorId) {
           
            selectedDoctor = doctors.find(d => d.id === doctorId);
            document.getElementById('appointmentModal').classList.add('active');
            
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('appointmentDate').min = today;
        }

        function bookAppointment(e) {
            e.preventDefault();
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;
            const reason = document.getElementById('appointmentReason').value;
            
            const appointment = {
                id: Date.now(),
                doctorId: selectedDoctor.id,
                doctorName: selectedDoctor.name,
                date,
                time,
                reason,
                userId: currentUser.id
            };
            
            appointments.push(appointment);
            closeModal('appointmentModal');
            alert('Rendez-vous confirmé!');
            e.target.reset();
        }

        function showReviews(doctorId) {
           
            selectedDoctor = doctors.find(d => d.id === doctorId);
            displayReviews();
            document.getElementById('reviewModal').classList.add('active');
        }

        function displayReviews() {
            const reviewsList = document.getElementById('reviewsList');
            reviewsList.innerHTML = '<h3 style="margin: 1.5rem 0 1rem 0; color: #9c27b0;">Avis des patients</h3>';
            
            if (selectedDoctor.reviews.length === 0) {
                reviewsList.innerHTML += '<p style="color: #999;">Aucun avis pour le moment. Soyez le premier à donner votre avis!</p>';
                return;
            }
            
            selectedDoctor.reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.innerHTML = `
                    <div class="review-header">
                        <span class="review-author">${review.userName}</span>
                        <span class="rating">${'⭐'.repeat(review.rating)}</span>
                    </div>
                    <div class="review-text">${review.text}</div>
                    <div style="font-size: 0.85rem; color: #999; margin-top: 0.5rem;">${review.date}</div>
                `;
                reviewsList.appendChild(reviewCard);
            });
        }

        function addReview(e) {
            e.preventDefault();
            const rating = parseInt(document.getElementById('reviewRating').value);
            const text = document.getElementById('reviewText').value;
            
            const review = {
                id: Date.now(),
                userName: currentUser.name,
                userId: currentUser.id,
                rating,
                text,
                date: new Date().toLocaleDateString('fr-FR')
            };
            
            selectedDoctor.reviews.push(review);
            
            const totalRating = selectedDoctor.reviews.reduce((sum, r) => sum + r.rating, 0);
            selectedDoctor.rating = (totalRating / selectedDoctor.reviews.length).toFixed(1);
            
            displayReviews();
            displayDoctors(doctors);
            e.target.reset();
            alert('Merci pour votre avis!');
        }

        function showAppointments() {
            document.getElementById('homePage').classList.add('hidden');
            document.getElementById('appointmentsPage').classList.remove('hidden');
            displayAppointments();
        }

        function showHome() {
            document.getElementById('homePage').classList.remove('hidden');
            document.getElementById('appointmentsPage').classList.add('hidden');
        }

        function displayAppointments() {
            const list = document.getElementById('appointmentsList');
            const userAppointments = appointments.filter(a => a.userId === currentUser.id);
            
            if (userAppointments.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: #999;">Vous n\'avez pas encore de rendez-vous</p>';
                return;
            }
            
            list.innerHTML = '';
            userAppointments.forEach(apt => {
                const item = document.createElement('div');
                item.className = 'appointment-item';
                item.innerHTML = `
                    <h3 style="color: #9c27b0; margin-bottom: 0.5rem;">${apt.doctorName}</h3>
                    <p><strong>Date:</strong> ${new Date(apt.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Heure:</strong> ${apt.time}</p>
                    <p><strong>Motif:</strong> ${apt.reason}</p>
                `;
                list.appendChild(item);
            });
        }

        // Initialisation
        displayDoctors(doctors);