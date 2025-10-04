let video = document.getElementById('video');
        let capturedImage = document.getElementById('capturedImage');
        let stream = null;
        let photoDataUrl = null;
        let sessionData = null;

        // Check session
        window.addEventListener('DOMContentLoaded', function() {
            checkSession();
            initCamera();
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

            document.getElementById('studentName').textContent = sessionData.studentName;
            document.getElementById('examNumber').textContent = sessionData.examNumber;
        }

        // Initialize camera
        async function initCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                });
                video.srcObject = stream;
            } catch (error) {
                console.error('Camera error:', error);
                document.getElementById('noCameraFallback').classList.remove('hidden');
                document.getElementById('cameraStatus').classList.add('hidden');
                document.getElementById('cameraGuide').classList.add('hidden');
            }
        }

        // Capture photo
        document.getElementById('captureBtn').addEventListener('click', function() {
            const canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            // Show captured image
            capturedImage.src = photoDataUrl;
            capturedImage.classList.remove('hidden');
            video.classList.add('hidden');
            
            // Update UI
            document.getElementById('captureBtn').classList.add('hidden');
            document.getElementById('retakeBtn').classList.remove('hidden');
            document.getElementById('cameraGuide').classList.add('hidden');
            document.getElementById('cameraStatus').classList.add('hidden');
            document.getElementById('continueBtn').disabled = false;
            
            // Stop camera
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            
            showAlert('Photo captured successfully!', 'success');
        });

        // Retake photo
        document.getElementById('retakeBtn').addEventListener('click', function() {
            capturedImage.classList.add('hidden');
            video.classList.remove('hidden');
            document.getElementById('captureBtn').classList.remove('hidden');
            document.getElementById('retakeBtn').classList.add('hidden');
            document.getElementById('cameraGuide').classList.remove('hidden');
            document.getElementById('cameraStatus').classList.remove('hidden');
            document.getElementById('continueBtn').disabled = true;
            
            photoDataUrl = null;
            initCamera();
        });

        // File upload fallback
        document.getElementById('uploadFileBtn').addEventListener('click', function() {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    photoDataUrl = event.target.result;
                    capturedImage.src = photoDataUrl;
                    capturedImage.classList.remove('hidden');
                    document.getElementById('noCameraFallback').classList.add('hidden');
                    document.getElementById('continueBtn').disabled = false;
                    showAlert('Photo uploaded successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        // Continue button
        document.getElementById('continueBtn').addEventListener('click', function() {
            if (!photoDataUrl) {
                showAlert('Please capture a photo first.', 'error');
                return;
            }

            // Store photo in session
            sessionData.photoDataUrl = photoDataUrl;
            sessionData.photoVerified = true;
            sessionStorage.setItem('questifySession', JSON.stringify(sessionData));

            window.location.href = 'student-dashboard.html';
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', function() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            window.location.href = 'verify-credentials.html';
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                sessionStorage.removeItem('questifySession');
                window.location.href = 'index.html';
            }
        });

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

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        });