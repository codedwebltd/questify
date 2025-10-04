  // Toggle Password Visibility
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordInput = document.getElementById('accessCode');
            const eyeIcon = document.getElementById('eyeIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>';
            } else {
                passwordInput.type = 'password';
                eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
            }
        });

        // Valid credentials array
        const validCredentials = [
            { examNumber: 'EXM2025001', accessCode: 'DEMO2025', studentName: 'John Doe', examTitle: 'General Knowledge Test' },
            { examNumber: 'EXM2025002', accessCode: 'PASS2025', studentName: 'Jane Smith', examTitle: 'Mathematics Test' },
            { examNumber: 'EXM2025003', accessCode: 'TEST2025', studentName: 'Mike Johnson', examTitle: 'Science Test' }
        ];

        // Show alert
        function showAlert(message, type = 'error') {
            const alertBox = document.getElementById('alertBox');
            alertBox.className = `mb-6 p-4 rounded-xl ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`;
            alertBox.innerHTML = `
                <div class="flex items-center gap-2">
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

        // Login handler
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const examNumber = document.getElementById('examNumber').value.trim();
            const accessCode = document.getElementById('accessCode').value.trim();
            
            const validUser = validCredentials.find(
                cred => cred.examNumber === examNumber && cred.accessCode === accessCode
            );
            
            if (validUser) {
                const sessionData = {
                    examNumber: validUser.examNumber,
                    studentName: validUser.studentName,
                    examTitle: validUser.examTitle,
                    loginTime: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
                };
                
                sessionStorage.setItem('questifySession', JSON.stringify(sessionData));
                showAlert('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'verify-credentials.html';
                }, 1000);
            } else {
                showAlert('Invalid credentials. Please try again.');
            }
        });

        // Check existing session
        window.addEventListener('DOMContentLoaded', function() {
            const session = sessionStorage.getItem('questifySession');
            if (session) {
                const sessionData = JSON.parse(session);
                if (new Date() < new Date(sessionData.expiresAt)) {
                    window.location.href = 'verify-credentials.html';
                } else {
                    sessionStorage.removeItem('questifySession');
                }
            }
        });