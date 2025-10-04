  let sessionData = null;

        window.addEventListener('DOMContentLoaded', function() {
            checkSession();
            setupChecklistListeners();
        });

        function checkSession() {
            const session = sessionStorage.getItem('questifySession');
            
            if (!session) {
                showAlert('Session not found. Please login again.', 'error');
                setTimeout(() => window.location.href = 'index.html', 2000);
                return;
            }

            sessionData = JSON.parse(session);
            const expiresAt = new Date(sessionData.expiresAt);

            if (new Date() >= expiresAt) {
                showAlert('Session expired. Please login again.', 'error');
                sessionStorage.removeItem('questifySession');
                setTimeout(() => window.location.href = 'index.html', 2000);
                return;
            }

            if (!sessionData.photoVerified) {
                showAlert('Please complete photo verification first.', 'error');
                setTimeout(() => window.location.href = 'upload-photo.html', 2000);
                return;
            }

            displayStudentInfo();
        }

        function displayStudentInfo() {
            const name = sessionData.studentName;
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            document.getElementById('headerName').textContent = name;
            document.getElementById('headerExamNum').textContent = sessionData.examNumber;
            document.getElementById('userInitials').textContent = initials;
            document.getElementById('examTitle').textContent = sessionData.examTitle;
            document.getElementById('profileName').textContent = name;
            document.getElementById('profileExamNumber').textContent = sessionData.examNumber;
            document.getElementById('profileInitials').textContent = initials;
            
            if (sessionData.photoDataUrl) {
                document.getElementById('studentPhoto').src = sessionData.photoDataUrl;
            }

            const loginTime = new Date(sessionData.loginTime);
            document.getElementById('loginTime').textContent = loginTime.toLocaleTimeString();
        }

        function setupChecklistListeners() {
            const checkboxes = [
                document.getElementById('check1'),
                document.getElementById('check2'),
                document.getElementById('check3'),
                document.getElementById('check4')
            ];

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateStartButton);
            });
        }

        function updateStartButton() {
            const allChecked = 
                document.getElementById('check1').checked &&
                document.getElementById('check2').checked &&
                document.getElementById('check3').checked &&
                document.getElementById('check4').checked;

            document.getElementById('startExamBtn').disabled = !allChecked;
        }

        document.getElementById('startExamBtn').addEventListener('click', function() {
            if (confirm('Are you ready to start the examination? Once started, the timer cannot be paused.')) {
                sessionData.examStartTime = new Date().toISOString();
                sessionStorage.setItem('questifySession', JSON.stringify(sessionData));
                window.location.href = 'exam.html';
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.removeItem('questifySession');
                window.location.href = 'index.html';
            }
        });

        function showAlert(message, type = 'error') {
            const alertBox = document.getElementById('alertBox');
            alertBox.className = `mb-6 p-4 rounded-xl ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`;
            alertBox.innerHTML = `
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        ${type === 'error' 
                            ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>'
                            : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>'
                        }
                    </svg>
                    <span class="font-medium">${message}</span>
                </div>
            `;
            alertBox.classList.remove('hidden');
            setTimeout(() => alertBox.classList.add('hidden'), 5000);
        }