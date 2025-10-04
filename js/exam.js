  const questions = [
            { question: "Which of the following countries is a member of ECOWAS?", options: ["Mali", "Niger", "Guinea", "Cameroon"], correctAnswer: 0 },
            { question: "A set of items consist of diesel, kerosine, petrol. What another possible item in the set would be?", options: ["Water", "Engine lubricant", "Crude Petroleum", "Compressed natural gas"], correctAnswer: 2 },
            { question: "The force that causes rotation around a central point is called?", options: ["Rotational Force", "Centripetal force", "Centrifugal Force", "Torque"], correctAnswer: 3 },
            { question: "An unexpected termination of an application is referred to as?", options: ["Crash", "Relapse", "Downgrade", "Invalidation"], correctAnswer: 0 },
            { question: "Which of the following materials is biodegradable?", options: ["Petroleum oil", "All Perfumes", "Styrofoam", "Glass"], correctAnswer: 1 },
            { question: "Which of the following is not a river in Nigeria?", options: ["Benin", "Osse", "Puma", "Donga"], correctAnswer: 2 },
            { question: "The device used for changing the voltage of alternating current is called?", options: ["Transformer", "Semi conductor", "Alternator", "Transducer"], correctAnswer: 0 },
            { question: "Aisha was unhappy and disappointed with the outcome of the exam; means that Aisha was?", options: ["Bored", "Dejected", "Uneasy", "Exasperated"], correctAnswer: 1 },
            { question: "What laws define criminal offences and their punishments in Nigeria?", options: ["The Penal Code", "The Constitution", "The Penal Code and Criminal Code", "The Criminal Code"], correctAnswer: 3 },
            { question: "A form of narrative that represents a hidden meaning beneath the literal one is called?", options: ["Metaphor", "Allegory", "Simile", "Analogy"], correctAnswer: 1 },
            { question: "Law enforcement officers should regard all information received as confidential; nearest in meaning to confidential is?", options: ["Reliable", "True", "Secret", "Authentic"], correctAnswer: 2 },
            { question: "The acronym LED stands for?", options: ["Liquid emitting device", "Light emitting device", "Light emitting diode", "None of the options"], correctAnswer: 2 },
            { question: "What is the rate of VAT in Nigeria?", options: ["10%", "None of the options", "7.50%", "5%"], correctAnswer: 2 },
            { question: "A doctor who has special training in diagnosing and treating cancer is called?", options: ["An Oncologist", "A Virologist", "A Pathologist", "A Chemotherapist"], correctAnswer: 0 },
            { question: "The evaluation of investments and economic trends to predict performance is termed?", options: ["Return on Investment Profiling", "Investment Environmental Scanning", "Investment Process Validation", "Investment analysis"], correctAnswer: 3 },
            { question: "The investigation is like a wild goose chase; means that the investigation?", options: ["Is compromised", "Will take a lot of resources", "Cannot be successful", "Is involving a lot of travelling"], correctAnswer: 2 },
            { question: "The durable fabric stretched over a wooden frame to create a stable surface for painting is called?", options: ["Damper", "Canvas", "None of the Options", "Acrylic"], correctAnswer: 1 },
            { question: "The phrase 'succinctly put' means?", options: ["To state briefly and clearly", "To state with definitions and examples", "To state with emphasis", "To state with substantial evidence"], correctAnswer: 0 },
            { question: "The Central Bank of Nigeria was established in what year?", options: ["1963", "1960", "1959", "1957"], correctAnswer: 2 },
            { question: "Multiply (3+a) by (5-a)?", options: ["15+2a²-a", "15+a+2a²", "15-a-2a²", "15+11a-2a²"], correctAnswer: 2 },
            { question: "The teacher gave him her frank opinion; nearest in meaning to frank is?", options: ["Silly", "Candid", "Difficult", "Dishonest"], correctAnswer: 1 },
            { question: "The maximum rate in which data can be transferred over a connection is called?", options: ["Connectivity", "RAM", "Bandwidth", "Wavelength"], correctAnswer: 2 },
            { question: "In statistical calculations, which of the following is not a measure of central tendency?", options: ["Mode", "Time Series", "Mean", "Median"], correctAnswer: 1 },
            { question: "What legislation governs the establishment and management of companies in Nigeria?", options: ["Company Establishment Act 2003", "Companies and Allied Matters Act 2020", "Companies Act 2009", "The Constitution"], correctAnswer: 1 },
            { question: "Depreciation is?", options: ["Charge for wear and tear of fixed assets", "Cost of repairs incurred on fixed assets", "Cost incurred on replacing fixed assets", "Provision for loss of fixed assets"], correctAnswer: 0 },
            { question: "A plant that naturally exists for several years is called?", options: ["Cash Crop", "Annual", "Multi-Seasonal", "Perennial"], correctAnswer: 3 },
            { question: "The field that studies the measurement of light is called?", options: ["Reflections", "Photometry", "Photo-Optics", "Photomagnetics"], correctAnswer: 1 },
            { question: "Which of the following best refers to Androids?", options: ["Patents for electronic Devices", "All of the options", "Operating Systems of mobile phones", "Secret protection devices in mobile phones"], correctAnswer: 2 },
            { question: "The acronym GPS stands for?", options: ["Global Positioning Systems", "Guided Positioning Systems", "Global Positioning Skill", "Global Positioning Settings"], correctAnswer: 0 },
            { question: "What is the capital city of Nigeria?", options: ["Lagos", "Abuja", "Port Harcourt", "Kano"], correctAnswer: 1 }
        ];

        let currentQuestionIndex = 0;
        let answers = new Array(questions.length).fill(null);
        let timeLeft = 45 * 60;
        let timerInterval = null;
        let sessionData = null;

        window.addEventListener('DOMContentLoaded', function() {
            checkSession();
            renderQuestion();
            generateQuestionNav();
            startTimer();
            updateNavigationButtons();
            updateSummary();
        });

        function checkSession() {
            const session = sessionStorage.getItem('questifySession');
            
            if (!session) {
                alert('Session not found. Redirecting to login...');
                window.location.href = 'index.html';
                return;
            }

            sessionData = JSON.parse(session);
            document.getElementById('studentName').textContent = sessionData.studentName;
        }

        function renderQuestion() {
            const q = questions[currentQuestionIndex];
            document.getElementById('questionText').textContent = q.question;
            document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
            document.getElementById('questionCounter').textContent = `${currentQuestionIndex + 1}/${questions.length}`;
            
            const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
            document.getElementById('progressBar').style.width = progressPercent + '%';
            
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';
            
            q.options.forEach((option, index) => {
                const label = document.createElement('label');
                label.className = 'flex items-center p-4 bg-gray-50 hover:bg-orange-50 rounded-lg cursor-pointer transition border-2 border-transparent hover:border-orange-200 group';
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'answer';
                input.value = index;
                input.className = 'w-5 h-5 text-orange-600 border-gray-300 focus:ring-orange-500';
                input.checked = answers[currentQuestionIndex] === index;
                
                input.addEventListener('change', function() {
                    answers[currentQuestionIndex] = parseInt(this.value);
                    updateQuestionNav();
                    updateSummary();
                });
                
                const span = document.createElement('span');
                span.className = 'ml-4 text-base text-gray-700 group-hover:text-gray-900';
                span.textContent = option;
                
                label.appendChild(input);
                label.appendChild(span);
                optionsContainer.appendChild(label);
            });
        }

        function generateQuestionNav() {
            const nav = document.getElementById('questionNav');
            nav.innerHTML = '';
            
            for (let i = 0; i < questions.length; i++) {
                const btn = document.createElement('button');
                btn.textContent = i + 1;
                btn.className = 'w-8 h-8 rounded font-semibold transition text-sm';
                btn.onclick = () => goToQuestion(i);
                updateNavButtonStyle(btn, i);
                nav.appendChild(btn);
            }
        }

        function updateNavButtonStyle(btn, index) {
            if (index === currentQuestionIndex) {
                btn.className = 'w-8 h-8 rounded font-semibold transition text-sm bg-yellow-400 text-gray-900';
            } else if (answers[index] !== null) {
                btn.className = 'w-8 h-8 rounded font-semibold transition text-sm bg-orange-600 text-white hover:bg-orange-700';
            } else {
                btn.className = 'w-8 h-8 rounded font-semibold transition text-sm bg-gray-200 text-gray-700 hover:bg-gray-300';
            }
        }

        function updateQuestionNav() {
            const buttons = document.getElementById('questionNav').children;
            for (let i = 0; i < buttons.length; i++) {
                updateNavButtonStyle(buttons[i], i);
            }
        }

        function updateSummary() {
            const answered = answers.filter(a => a !== null).length;
            document.getElementById('answeredCount').textContent = answered;
            document.getElementById('unansweredCount').textContent = questions.length - answered;
        }

        function goToQuestion(index) {
            currentQuestionIndex = index;
            renderQuestion();
            updateQuestionNav();
            updateNavigationButtons();
        }

        function updateNavigationButtons() {
            document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
            
            if (currentQuestionIndex === questions.length - 1) {
                document.getElementById('nextBtn').classList.add('hidden');
                document.getElementById('submitBtn').classList.remove('hidden');
            } else {
                document.getElementById('nextBtn').classList.remove('hidden');
                document.getElementById('submitBtn').classList.add('hidden');
            }
        }

        function startTimer() {
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    document.getElementById('timer').textContent = 
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    clearInterval(timerInterval);
                    alert('Time is up! Exam will be submitted automatically.');
                    submitExam();
                }
            }, 1000);
        }

        function submitExam() {
            clearInterval(timerInterval);
            
            const unanswered = answers.filter(a => a === null).length;
            let score = 0;
            
            answers.forEach((answer, index) => {
                if (answer === questions[index].correctAnswer) {
                    score++;
                }
            });

            sessionData.examCompleted = true;
            sessionData.score = score;
            sessionData.totalQuestions = questions.length;
            sessionData.answeredQuestions = answers.filter(a => a !== null).length;
            sessionData.unansweredQuestions = unanswered;
            sessionData.completionTime = new Date().toISOString();
            
            sessionStorage.setItem('questifySession', JSON.stringify(sessionData));
            window.location.href = 'exam-complete.html';
        }

        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderQuestion();
                updateQuestionNav();
                updateNavigationButtons();
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
                updateQuestionNav();
                updateNavigationButtons();
            }
        });

        document.getElementById('submitBtn').addEventListener('click', () => {
            const unanswered = answers.filter(a => a === null).length;
            if (unanswered > 0) {
                if (!confirm(`You have ${unanswered} unanswered question(s). Are you sure you want to submit?`)) {
                    return;
                }
            }
            if (confirm('Submit your examination? This action cannot be undone.')) {
                submitExam();
            }
        });

        window.addEventListener('beforeunload', function(e) {
            if (!sessionData?.examCompleted) {
                e.preventDefault();
                e.returnValue = 'Your exam is still in progress. Are you sure you want to leave?';
            }
        });