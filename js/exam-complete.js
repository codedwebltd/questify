        let sessionData = null;

        window.addEventListener('DOMContentLoaded', function() {
            checkSession();
            displayResults();
        });

        function checkSession() {
            const session = sessionStorage.getItem('questifySession');
            
            if (!session) {
                alert('Session not found. Redirecting to login...');
                window.location.href = 'index.html';
                return;
            }

            sessionData = JSON.parse(session);

            if (!sessionData.examCompleted) {
                alert('Please complete the exam first.');
                window.location.href = 'exam.html';
                return;
            }
        }

        function displayResults() {
            const score = sessionData.score;
            const total = sessionData.totalQuestions;
            const answered = sessionData.answeredQuestions;
            const unanswered = sessionData.unansweredQuestions;
            const percentage = Math.round((score / total) * 100);
            const passed = percentage >= 50;
            const wrongAnswers = answered - score;

            // Calculate time taken
            const startTime = new Date(sessionData.examStartTime);
            const endTime = new Date(sessionData.completionTime);
            const timeTaken = Math.floor((endTime - startTime) / 1000);
            const minutes = Math.floor(timeTaken / 60);
            const seconds = timeTaken % 60;

            // Calculate grade
            let grade = 'F';
            if (percentage >= 90) grade = 'A+';
            else if (percentage >= 80) grade = 'A';
            else if (percentage >= 70) grade = 'B';
            else if (percentage >= 60) grade = 'C';
            else if (percentage >= 50) grade = 'D';

            // Update banner
            const banner = document.getElementById('resultBanner');
            if (passed) {
                banner.className = 'rounded-2xl p-8 text-center text-white bg-gradient-to-br from-green-500 to-green-600';
                document.getElementById('resultTitle').textContent = 'Congratulations!';
                document.getElementById('resultMessage').textContent = 'You have successfully passed the examination';
            } else {
                banner.className = 'rounded-2xl p-8 text-center text-white bg-gradient-to-br from-red-500 to-red-600';
                document.getElementById('statusIcon').innerHTML = '<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
                document.getElementById('resultTitle').textContent = 'Exam Complete';
                document.getElementById('resultMessage').textContent = 'Unfortunately, you did not meet the pass mark';
            }

            // Update scores
            document.getElementById('scoreDisplay').textContent = score;
            document.getElementById('percentageDisplay').textContent = percentage + '%';
            document.getElementById('gradeDisplay').textContent = grade;
            
            const statusBadge = document.getElementById('statusBadge');
            const statusText = document.getElementById('statusText');
            
            if (passed) {
                statusBadge.className = 'inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold bg-green-100 text-green-700';
                statusText.textContent = 'PASSED';
            } else {
                statusBadge.className = 'inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold bg-red-100 text-red-700';
                statusText.textContent = 'FAILED';
            }

            // Update performance cards
            document.getElementById('correctDisplay').textContent = score;
            document.getElementById('wrongDisplay').textContent = wrongAnswers;
            document.getElementById('timeDisplay').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('unansweredDisplay').textContent = unanswered;

            // Update details
            document.getElementById('studentNameDisplay').textContent = sessionData.studentName.toUpperCase();
            document.getElementById('examNumberDisplay').textContent = sessionData.examNumber;
            document.getElementById('examTitleDisplay').textContent = sessionData.examTitle;
            document.getElementById('completionDateDisplay').textContent = endTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            document.getElementById('logoutBtn').addEventListener('click', logout);
            document.getElementById('dashboardBtn').addEventListener('click', function() {
                 window.location.href = 'student-dashboard.html';
            });
            // Update certificate
            document.getElementById('certStudentName').textContent = sessionData.studentName.toUpperCase();
            document.getElementById('certExamNumber').textContent = sessionData.examNumber;
            document.getElementById('certExamTitle').textContent = sessionData.examTitle.toUpperCase();
            document.getElementById('certDate').textContent = endTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('certScore').textContent = score;
            document.getElementById('certGrade').textContent = grade;
            document.getElementById('certStatus').textContent = passed ? 'PASSED' : 'FAILED';
            document.getElementById('certStatus').style.color = passed ? '#15803d' : '#b91c1c';
            document.getElementById('certNumber').textContent = `QSTFY-${new Date().getFullYear()}-${String(sessionData.examNumber).slice(-3).padStart(3, '0')}`;
        }
        function logout() {
            if (confirm('Are you sure you want to exit? Your session will be cleared.')) {
                sessionStorage.removeItem('questifySession');
                window.location.href = 'index.html';
            }
        }