// Estado de la presentación
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Elementos de navegación
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');
const dots = document.querySelectorAll('.dot');

// Función para mostrar una diapositiva específica
function showSlide(index) {
    // Asegurar que el índice esté dentro del rango
    if (index < 0) {
        currentSlide = 0;
    } else if (index >= totalSlides) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Ocultar todas las diapositivas
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Mostrar la diapositiva actual
    slides[currentSlide].classList.add('active');

    // Reiniciar animaciones
    resetAnimations(slides[currentSlide]);

    // Actualizar controles
    updateControls();
}

// Función para reiniciar las animaciones de una diapositiva
function resetAnimations(slide) {
    const elements = slide.querySelectorAll('.typewriter, .fade-in-image');
    elements.forEach(element => {
        // Forzar reinicio de la animación
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = '';
        }, 10);
    });
}

// Función para actualizar los controles de navegación
function updateControls() {
    // Actualizar contador
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;

    // Actualizar botones
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;

    // Actualizar indicadores (puntos)
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Navegación con botones
prevBtn.addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

nextBtn.addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

// Navegación con puntos indicadores
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
    } else if (e.key === ' ') {
        // Espacio también avanza
        e.preventDefault();
        showSlide(currentSlide + 1);
    }
});

// Navegación con click en la pantalla
const presentationContainer = document.querySelector('.presentation-container');

presentationContainer.addEventListener('click', (e) => {
    // Obtener el ancho de la pantalla
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    
    // Si hace click en el lado izquierdo (30% de la pantalla), retrocede
    if (clickX < screenWidth * 0.3) {
        showSlide(currentSlide - 1);
    } 
    // Si hace click en el resto de la pantalla, avanza
    else {
        showSlide(currentSlide + 1);
    }
});

// Navegación táctil (swipe) para móviles
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left (siguiente)
        showSlide(currentSlide + 1);
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right (anterior)
        showSlide(currentSlide - 1);
    }
}

// Modo presentación (pantalla completa con F11 o botón)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Inicializar la presentación
updateControls();

// ===== EFECTO MÁQUINA DE ESCRIBIR PARA DIAPOSITIVA 1 =====
let typewriterActive = false;

function startTypewriterEffect() {
    if (typewriterActive) return;
    typewriterActive = true;
    
    const container = document.getElementById('typewriter-container');
    if (!container) return;
    
    container.innerHTML = '<p class="custom-typewriter"><span id="typed-text"></span><span class="cursor">|</span></p>';
    
    const typedTextSpan = document.getElementById('typed-text');
    const cursor = document.querySelector('.cursor');
    
    // Velocidad de escritura (ms por carácter)
    const typeSpeed = 120;
    const deleteSpeed = 60;
    const pauseTime = 800;
    
    // Secuencia de textos
    const sequence = [
        { action: 'type', text: 'Bajo tierra, ni muertos.', large: true },
        { action: 'pause', duration: 1000 },
        { action: 'newline' },
        { action: 'newline' },
        { action: 'type', text: 'Un hombre y una mujer, se encuentran y se enamoran' },
        { action: 'pause', duration: 800 },
        { action: 'delete', chars: 12 }, // Borrar "se enamoran"
        { action: 'pause', duration: 400 },
        { action: 'type', text: ' en el inicio del amor, él la deja' },
        { action: 'pause', duration: 800 },
        { action: 'delete', chars: 7 }, // Borrar "la deja"
        { action: 'pause', duration: 400 },
        { action: 'type', text: 'se va.' },
        { action: 'pause', duration: 1000 },
        { action: 'newline' },
        { action: 'newline' },
        { action: 'type', text: 'Escena 1 - "rodeada de cajas, por una mudanza obligada, una mujer tropieza"' },
        { action: 'pause', duration: 1000 },
        { action: 'newline' },
        { action: 'newline' },
        { action: 'type', text: '¡Joder!' },
        { action: 'pause', duration: 1000 },
        { action: 'removeCursor' }
    ];
    
    let currentStep = 0;
    let isLargeText = false;
    
    function executeStep() {
        if (currentStep >= sequence.length) return;
        
        const step = sequence[currentStep];
        
        switch (step.action) {
            case 'type':
                isLargeText = step.large || false;
                typeText(step.text, () => {
                    currentStep++;
                    executeStep();
                });
                break;
                
            case 'delete':
                deleteText(step.chars, () => {
                    currentStep++;
                    executeStep();
                });
                break;
                
            case 'pause':
                setTimeout(() => {
                    currentStep++;
                    executeStep();
                }, step.duration);
                break;
                
            case 'newline':
                const br = document.createElement('br');
                typedTextSpan.appendChild(br);
                currentStep++;
                executeStep();
                break;
                
            case 'removeCursor':
                cursor.style.display = 'none';
                currentStep++;
                break;
        }
    }
    
    function typeText(text, callback) {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                if (i === 0 && isLargeText) {
                    // Envolver el texto grande en un span
                    const span = document.createElement('span');
                    span.className = 'large-text';
                    span.textContent = text.charAt(i);
                    typedTextSpan.appendChild(span);
                } else if (isLargeText) {
                    // Continuar añadiendo al span de texto grande
                    const spans = typedTextSpan.querySelectorAll('.large-text');
                    const lastSpan = spans[spans.length - 1];
                    if (lastSpan) {
                        lastSpan.textContent += text.charAt(i);
                    }
                } else {
                    // Crear un nodo de texto en lugar de usar innerHTML
                    const textNode = document.createTextNode(text.charAt(i));
                    typedTextSpan.appendChild(textNode);
                }
                i++;
            } else {
                clearInterval(interval);
                isLargeText = false;
                callback();
            }
        }, typeSpeed);
    }
    
    function deleteText(numChars, callback) {
        let deleted = 0;
        const interval = setInterval(() => {
            if (deleted < numChars) {
                const lastChild = typedTextSpan.lastChild;
                if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
                    // Es un nodo de texto
                    const text = lastChild.textContent;
                    if (text.length > 1) {
                        lastChild.textContent = text.slice(0, -1);
                    } else {
                        typedTextSpan.removeChild(lastChild);
                    }
                } else if (lastChild && lastChild.nodeType === Node.ELEMENT_NODE) {
                    // Es un elemento (span)
                    const text = lastChild.textContent;
                    if (text.length > 1) {
                        lastChild.textContent = text.slice(0, -1);
                    } else {
                        typedTextSpan.removeChild(lastChild);
                    }
                } else {
                    // Usar textContent como fallback
                    typedTextSpan.textContent = typedTextSpan.textContent.slice(0, -1);
                }
                deleted++;
            } else {
                clearInterval(interval);
                callback();
            }
        }, deleteSpeed);
    }
    
    // Iniciar la secuencia
    executeStep();
}

// Detectar cuando se muestra la diapositiva 1
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active') && mutation.target.id === 'slide1') {
            setTimeout(() => startTypewriterEffect(), 300);
        }
    });
});

// Observar cambios en las diapositivas
slides.forEach(slide => {
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
});

// Iniciar el efecto si la diapositiva 1 ya está activa (no la 0)
if (slides[1] && slides[1].classList.contains('active')) {
    setTimeout(() => startTypewriterEffect(), 300);
}

// ===== EFECTO PARA DIAPOSITIVA 2 =====
let slide2Active = false;

function startSlide2Effect() {
    if (slide2Active) return;
    slide2Active = true;
    
    const image = document.getElementById('slide2-img');
    const imageContainer = document.querySelector('.image-slide2-container');
    const typewriterContainer = document.getElementById('typewriter-container-slide2');
    
    if (!image || !typewriterContainer) return;
    
    // Después de 3 segundos, reducir la imagen y mostrar el texto
    setTimeout(() => {
        image.classList.add('reduced');
        imageContainer.classList.add('reduced');
        
        // Mostrar el contenedor del texto
        setTimeout(() => {
            typewriterContainer.classList.add('visible');
            startTypewriterSlide2();
        }, 1000);
    }, 3000);
}

function startTypewriterSlide2() {
    const container = document.getElementById('typewriter-container-slide2');
    if (!container) return;
    
    container.innerHTML = '<p class="custom-typewriter-slide2"><span id="typed-text-slide2"></span><span class="cursor">|</span></p>';
    
    const typedTextSpan = document.getElementById('typed-text-slide2');
    const cursor = container.querySelector('.cursor');
    
    const typeSpeed = 120;
    const text = 'Agosto amanece amplio ante ambos. Agárrame abrázame ave árbol altísimo acróbata abecedárico';
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            const textNode = document.createTextNode(text.charAt(i));
            typedTextSpan.appendChild(textNode);
            i++;
        } else {
            clearInterval(interval);
            // Ocultar cursor al terminar
            setTimeout(() => {
                cursor.style.display = 'none';
            }, 1000);
        }
    }, typeSpeed);
}

// Detectar cuando se muestra la diapositiva 2
const slide2Observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active') && mutation.target.id === 'slide2') {
            setTimeout(() => startSlide2Effect(), 300);
        } else if (!mutation.target.classList.contains('active') && mutation.target.id === 'slide2') {
            // Reset cuando se sale de la diapositiva
            slide2Active = false;
            const image = document.getElementById('slide2-img');
            const imageContainer = document.querySelector('.image-slide2-container');
            const typewriterContainer = document.getElementById('typewriter-container-slide2');
            if (image) image.classList.remove('reduced');
            if (imageContainer) imageContainer.classList.remove('reduced');
            if (typewriterContainer) {
                typewriterContainer.classList.remove('visible');
                typewriterContainer.innerHTML = '';
            }
        }
    });
});

if (slides[2]) {
    slide2Observer.observe(slides[2], { attributes: true, attributeFilter: ['class'] });
    
    // Iniciar el efecto si la diapositiva 2 ya está activa
    if (slides[2].classList.contains('active')) {
        setTimeout(() => startSlide2Effect(), 300);
    }
}

// ===== EFECTO PARA DIAPOSITIVA 3 - APAGÓN =====
let slide3Active = false;

function startSlide3Effect() {
    if (slide3Active) return;
    slide3Active = true;
    
    // Reproducir mensaje de voz después de 2 segundos
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = 'Atención... Atención... Se informa a la población que debido a un apagón generalizado, los servicios eléctricos se encuentran suspendidos. Permanezcan en sus hogares... Repetimos... Permanezcan en sus hogares...';
        utterance.lang = 'es-ES';
        utterance.rate = 0.85;
        utterance.pitch = 0.9;
        utterance.volume = 1;
        
        let voices = speechSynthesis.getVoices();
        
        if (voices.length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                selectBestVoice(voices, utterance);
            };
        } else {
            selectBestVoice(voices, utterance);
        }
        
        function selectBestVoice(voices, utterance) {
            const spanishVoice = 
                voices.find(voice => voice.name.includes('Google español') || voice.name.includes('Google Spanish')) ||
                voices.find(voice => voice.name.includes('Microsoft Helena') || voice.name.includes('Mónica')) ||
                voices.find(voice => voice.lang === 'es-ES' && voice.name.includes('Premium')) ||
                voices.find(voice => voice.lang === 'es-ES') ||
                voices.find(voice => voice.lang.startsWith('es-')) ||
                voices[0];
            
            if (spanishVoice) {
                utterance.voice = spanishVoice;
            }
        }
        
        speechSynthesis.speak(utterance);
    }, 2000);
}

// Detectar cuando se muestra la diapositiva 3
const slide3Observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active') && mutation.target.id === 'slide3') {
            setTimeout(() => startSlide3Effect(), 300);
        } else if (!mutation.target.classList.contains('active') && mutation.target.id === 'slide3') {
            slide3Active = false;
            // Detener la síntesis de voz si se sale de la diapositiva
            speechSynthesis.cancel();
        }
    });
});

if (slides[3]) {
    slide3Observer.observe(slides[3], { attributes: true, attributeFilter: ['class'] });
    
    if (slides[3].classList.contains('active')) {
        setTimeout(() => startSlide3Effect(), 300);
    }
}

// Cargar las voces disponibles (necesario para algunos navegadores)
speechSynthesis.getVoices();
window.speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
};



