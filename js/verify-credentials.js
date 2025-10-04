 // Session management
        let sessionData = null;
        let sessionTimerInterval = null;
        let countdownInterval = null;

        // Demo exam start time (5 minutes from now for testing - clients can customize)
        const EXAM_START_TIME = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        //const EXAM_START_TIME = new Date(Date.now() - 1000).toISOString();

        // Initialize page
        window.addEventListener('DOMContentLoaded', function() {
            checkSession();
            startSessionTimer();
            checkExamSchedule();
        });  


        // Check if user has valid session
        function checkSession() {
            const session = sessionStorage.getItem('questifySession');
            
            if (!session) {
                showAlert('Session not found. Please login again.', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }

            sessionData = JSON.parse(session);
            const expiresAt = new Date(sessionData.expiresAt);

            if (new Date() >= expiresAt) {
                showAlert('Session expired. Please login again.', 'error');
                sessionStorage.removeItem('questifySession');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }

            // Display student information
            document.getElementById('studentName').textContent = sessionData.studentName;
            document.getElementById('examNumber').textContent = sessionData.examNumber;
            document.getElementById('examTitle').textContent = sessionData.examTitle;
        }

        // Session timer countdown
        function startSessionTimer() {
            sessionTimerInterval = setInterval(() => {
                if (!sessionData) return;

                const now = new Date();
                const expiresAt = new Date(sessionData.expiresAt);
                const timeLeft = expiresAt - now;

                if (timeLeft <= 0) {
                    clearInterval(sessionTimerInterval);
                    showAlert('Session expired. Redirecting to login...', 'error');
                    sessionStorage.removeItem('questifySession');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                    return;
                }

                const minutes = Math.floor(timeLeft / 60000);
                const seconds = Math.floor((timeLeft % 60000) / 1000);
                document.getElementById('sessionTimer').textContent = 
                    `Session expires in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }

        // Check exam schedule
        function checkExamSchedule() {
            const examStartTime = new Date(EXAM_START_TIME);
            const now = new Date();

            if (now < examStartTime) {
                // Exam hasn't started yet - show countdown
                document.getElementById('countdownSection').classList.remove('hidden');
                startCountdown(examStartTime);
            }
        }

        // Countdown to exam start
        function startCountdown(examStartTime) {
            countdownInterval = setInterval(() => {
                const now = new Date();
                const timeLeft = examStartTime - now;

                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    document.getElementById('countdownSection').classList.add('hidden');
                    showAlert('Exam is now available! You can proceed.', 'success');
                    return;
                }

                const hours = Math.floor(timeLeft / 3600000);
                const minutes = Math.floor((timeLeft % 3600000) / 60000);
                const seconds = Math.floor((timeLeft % 60000) / 1000);

                document.getElementById('hoursLeft').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutesLeft').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('secondsLeft').textContent = seconds.toString().padStart(2, '0');
            }, 1000);
        }

        // Show alert
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

        // Enable proceed button when checkbox is checked
        document.getElementById('confirmCheck').addEventListener('change', function() {
            const examStartTime = new Date(EXAM_START_TIME);
            const now = new Date();
            const proceedBtn = document.getElementById('proceedBtn');
            
            if (this.checked && now >= examStartTime) {
                proceedBtn.disabled = false;
            } else if (this.checked && now < examStartTime) {
                showAlert('Please wait for the exam start time.', 'error');
                this.checked = false;
            } else {
                proceedBtn.disabled = true;
            }
        });

        // Proceed button
        document.getElementById('proceedBtn').addEventListener('click', function() {
            window.location.href = 'upload-photo.html';
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', function() {
            sessionStorage.removeItem('questifySession');
            window.location.href = 'index.html';
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.removeItem('questifySession');
                window.location.href = 'index.html';
            }
        });

        // Cleanup intervals on page unload
        window.addEventListener('beforeunload', function() {
            if (sessionTimerInterval) clearInterval(sessionTimerInterval);
            if (countdownInterval) clearInterval(countdownInterval);
        });