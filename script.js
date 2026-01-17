// ===== VARIABLES GLOBALES =====
let currentSlide = 0;
const totalSlides = 34; // 0-33
// Audio Sirat
let siratAudio = null;
let siratAudioStarted = false;
let siratBlockAdvance = true;
let siratAllowAdvanceTimeout = null;
let siratStopOnJoder = false;

// Audio Apagon (última diapositiva)
let apagonAudio = null;
let apagonAudioStarted = false;

// ===== FUNCIÓN PRINCIPAL DE NAVEGACIÓN =====
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    // Bloqueo especial para la primera diapositiva si el audio no ha terminado
    if (currentSlide === 0 && siratBlockAdvance && index > 0) {
        // No avanzar
        return;
    }
    if (index >= totalSlides) {
        currentSlide = totalSlides - 1;
    } else if (index < 0) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) {
            slide.classList.add('active');
        }
    });
    // Detener síntesis de voz al cambiar de diapositiva
    speechSynthesis.cancel();
}

// ===== FUNCIÓN GENÉRICA DE TYPEWRITER =====
function typewriterEffect(elementId, text, speed = 80, onComplete = null) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '<span class="typed-text"></span><span class="cursor">|</span>';
    const typedSpan = element.querySelector('.typed-text');
    const cursor = element.querySelector('.cursor');
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                const br = document.createElement('br');
                typedSpan.appendChild(br);
            } else {
                const textNode = document.createTextNode(text.charAt(i));
                typedSpan.appendChild(textNode);
            }
            i++;
        } else {
            clearInterval(interval);
            if (cursor) {
                setTimeout(() => {
                    cursor.style.display = 'none';
                }, 1000);
            }
            if (onComplete) onComplete();
        }
    }, speed);
}

// ===== EFECTOS PARA CADA DIAPOSITIVA =====

// SLIDE 1: Título inicial con efecto de indecisión
let slide1Active = false;
function startSlide1Effect() {
    if (slide1Active) return;
    slide1Active = true;
    
    const container = document.getElementById('typewriter-slide1');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Secuencia de acciones
    const sequence = [
        { action: 'type', text: 'Título: "Un hombre y una mujer"', isBold: true },
        { action: 'pause', duration: 500 },
        { action: 'delete', chars: 23, keepBold: true }, // Borrar '"Un hombre y una mujer"' (23 chars con comillas)
        { action: 'pause', duration: 300 },
        { action: 'type', text: '"Enamorarse a los sesenta"', isBold: true },
        { action: 'pause', duration: 500 },
        { action: 'delete', chars: 26, keepBold: true }, // Borrar '"Enamorarse a los sesenta"' (26 chars con comillas)
        { action: 'pause', duration: 300 },
        { action: 'type', text: '"Amor e identidad"', isBold: true },
        { action: 'pause', duration: 500 },
        { action: 'delete', chars: 18, keepBold: true }, // Borrar '"Amor e identidad"' (18 chars con comillas)
        { action: 'pause', duration: 300 },
        { action: 'type', text: 'pendiente de decidir', isBold: true },
        { action: 'endBold' },
        { action: 'newline' },
        { action: 'newline' },
        { action: 'pause', duration: 500 },
        { action: 'type', text: '(suena a piano el teclado de una máquina de escribir, si se puede, que va a ser que no)' },
        { action: 'newline' },
        { action: 'newline' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: 'Un hombre y una mujer se encuentran y se enamoran' },
        { action: 'delete', chars: 11 }, // Borrar solo "se enamoran" (11 chars, sin el espacio previo)
        { action: 'pause', duration: 200 },
        { action: 'type', text: 'en el inicio del amor, él la deja' },
        { action: 'delete', chars: 7 }, // Borrar solo "la deja" (7 chars)
        { action: 'pause', duration: 200 },
        { action: 'type', text: 'se va.' },
        { action: 'newline' },
        { action: 'newline' },
        { action: 'pause', duration: 500 },
        { action: 'type', text: '(de fondo se escucha música de rabe' },
        { action: 'delete', chars: 4 }, // Borrar solo "rabe" (4 chars)
        { action: 'pause', duration: 200 },
        { action: 'type', text: 'rave, mucho barullo)' },
        { action: 'newline' },
        { action: 'newline' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: 'Escena 1 – Rodeada de cajas, por una mudanza obligada, una mujer tropieza' },
        { action: 'newline' },
        { action: 'newline' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: 'MUJER: ¡Joder! Nacer recibir mamar...', onType: () => {
            // Cuando se escriba "joder!" en la segunda diapositiva, detener el audio
            if (siratAudio && siratAudioStarted && !siratStopOnJoder) {
                siratAudio.pause();
                siratAudio.currentTime = 0;
                siratStopOnJoder = true;
            }
        } },
        { action: 'removeCursor' }
    ];
    
    let sequenceIndex = 0;
    let textContent = '';
    let boldContent = '';
    let normalContent = '';
    let inBoldSection = false;
    
    function executeNextAction() {
        if (sequenceIndex >= sequence.length) return;
        
        const action = sequence[sequenceIndex];
        sequenceIndex++;
        
        if (action.action === 'type') {
            let charIndex = 0;
            const isBold = action.isBold;
            const typingInterval = setInterval(() => {
                if (charIndex < action.text.length) {
                    const char = action.text[charIndex];
                    if (isBold) {
                        boldContent += char;
                        inBoldSection = true;
                    } else {
                        normalContent += char;
                    }
                    updateDisplay();
                    // Si hay función onType y justo se escribe "joder!", llamarla
                    if (action.onType && action.text.substring(0, charIndex + 1).toLowerCase().includes('joder!')) {
                        action.onType();
                    }
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    executeNextAction();
                }
            }, 60);
        } else if (action.action === 'delete') {
            let charsDeleted = 0;
            const keepBold = action.keepBold;
            
            const deleteInterval = setInterval(() => {
                if (charsDeleted < action.chars) {
                    if (keepBold && boldContent.length > 0) {
                        boldContent = boldContent.slice(0, -1);
                    } else if (normalContent.length > 0) {
                        normalContent = normalContent.slice(0, -1);
                    }
                    
                    updateDisplay();
                    charsDeleted++;
                } else {
                    clearInterval(deleteInterval);
                    executeNextAction();
                }
            }, 40);
            
        } else if (action.action === 'pause') {
            setTimeout(() => {
                executeNextAction();
            }, action.duration);
            
        } else if (action.action === 'newline') {
            normalContent += '\n';
            updateDisplay();
            executeNextAction();
            
        } else if (action.action === 'endBold') {
            inBoldSection = false;
            executeNextAction();
            
        } else if (action.action === 'removeCursor') {
            const cursor = container.querySelector('.cursor');
            if (cursor) {
                setTimeout(() => {
                    cursor.style.display = 'none';
                }, 1000);
            }
        }
    }
    
    function updateDisplay() {
        let html = '';
        
        // Contenido en negrita
        if (boldContent.length > 0) {
            html += '<strong>' + escapeHtml(boldContent) + '</strong>';
        }
        
        // Contenido normal
        if (normalContent.length > 0) {
            let normalHtml = escapeHtml(normalContent);
            normalHtml = normalHtml.replace(/\n/g, '<br>');
            html += normalHtml;
        }
        
        container.innerHTML = html + '<span class="cursor">|</span>';
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    updateDisplay();
    executeNextAction();
}


// SLIDE 2: Monopoli
let slide2Active = false;
function startSlide2Effect() {
    if (slide2Active) return;
    slide2Active = true;
    
    const text = `MUJER: ... de la vivienda...

¡y chimpún!

En una caja encuentra un monopoli

MUJER: Me quedo con tus propiedades...`;
    
    typewriterEffect('typewriter-slide2', text, 60);
}

// SLIDE 3: Ge-ne-ro-sa
let slide3Active = false;
function startSlide3Effect() {
    if (slide3Active) return;
    slide3Active = true;
    
    const container = document.getElementById('typewriter-slide3');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Escribir con pausas especiales en cada sílaba
    const sequence = [
        { action: 'type', text: 'HOMBRE: ... ' },
        { action: 'type', text: 'Ge' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: '-' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: 'ne' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: '-' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: 'ro' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: '-' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: 'sa' },
        { action: 'removeCursor' }
    ];
    
    let sequenceIndex = 0;
    let content = '';
    
    function executeNext() {
        if (sequenceIndex >= sequence.length) return;
        
        const action = sequence[sequenceIndex];
        sequenceIndex++;
        
        if (action.action === 'type') {
            let charIndex = 0;
            const interval = setInterval(() => {
                if (charIndex < action.text.length) {
                    content += action.text[charIndex];
                    container.innerHTML = content + '<span class="cursor">|</span>';
                    charIndex++;
                } else {
                    clearInterval(interval);
                    executeNext();
                }
            }, 80);
            
        } else if (action.action === 'pause') {
            setTimeout(() => {
                executeNext();
            }, action.duration);
            
        } else if (action.action === 'removeCursor') {
            const cursor = container.querySelector('.cursor');
            if (cursor) {
                setTimeout(() => {
                    cursor.style.display = 'none';
                }, 1000);
            }
        }
    }
    
    executeNext();
}

// SLIDE 5: Teléfono hijo
let slide5Active = false;
function startSlide5Effect() {
    if (slide5Active) return;
    slide5Active = true;
    
    const text = `MUJER: ... se convertía en un borrego dócil a su lado.

(suena el teléfono) (usar piano con melodía que asemeje un tono de llamada)

MUJER: Hola, hijo`;
    
    typewriterEffect('typewriter-slide5', text, 60);
}

// SLIDE 6: Coño
let slide6Active = false;
function startSlide6Effect() {
    if (slide6Active) return;
    slide6Active = true;
    
    const text = `MUJER: ... Y cuando te vas, tu cara adopta forma de coño, con olor a coño; vas a trabajar y saludas, discutes, tomas café, fumas, compras el pan, todo, con olor a coño, mi coño.`;
    
    typewriterEffect('typewriter-slide6', text, 70);
}

// SLIDE 7: En esto andas
let slide7Active = false;
function startSlide7Effect() {
    if (slide7Active) return;
    slide7Active = true;
    
    const text = `MUJER: ... En esto andas.

En esto ando.

Escena 2 – Mujer tratando de entender, y de poner orden dentro de su cabeza, fuera ya ha renunciado por el momento

MUJER: Y yo, que aprendí de antiguo a mirar las estrellas...`;
    
    typewriterEffect('typewriter-slide7', text, 60);
}

// SLIDE 8: Caminabas solo + Poema Brecht
let slide8Active = false;
function startSlide8Effect() {
    if (slide8Active) return;
    slide8Active = true;
    
    const container = document.getElementById('typewriter-slide8');
    if (!container) return;
    
    container.innerHTML = '';
    
    let beforeBold = '';
    let boldContent = '';
    let afterBold = '';
    let currentSection = 'before'; // 'before', 'bold', 'after'
    
    // Secuencia: primero texto normal, luego el poema en negrita, luego texto normal
    const sequence = [
        { action: 'type', text: 'MUJER: Caminabas solo.\n\n(si contamos con presupuesto, una pianista diría:)\n\n', section: 'before' },
        { action: 'pause', duration: 300 },
        { action: 'startBold' },
        { action: 'type', text: '"Estoy sentado al borde de la carretera\nEl chófer cambia la rueda\nNo me gusta el lugar de donde vengo\nNo me gusta el lugar adonde voy\n¿Por qué miro el cambio de rueda con tanta impaciencia?"\n\nBertolt Brecht', section: 'bold' },
        { action: 'endBold' },
        { action: 'pause', duration: 300 },
        { action: 'type', text: '\n\n(y si contamos con más presupuesto, un cañón de luz apunta directo al rostro de la mujer)', section: 'after' },
        { action: 'removeCursor' }
    ];
    
    let sequenceIndex = 0;
    
    function executeNext() {
        if (sequenceIndex >= sequence.length) return;
        
        const action = sequence[sequenceIndex];
        sequenceIndex++;
        
        if (action.action === 'type') {
            let charIndex = 0;
            const interval = setInterval(() => {
                if (charIndex < action.text.length) {
                    if (action.section === 'before') {
                        beforeBold += action.text[charIndex];
                    } else if (action.section === 'bold') {
                        boldContent += action.text[charIndex];
                    } else if (action.section === 'after') {
                        afterBold += action.text[charIndex];
                    }
                    updateDisplay();
                    charIndex++;
                } else {
                    clearInterval(interval);
                    executeNext();
                }
            }, 70);
            
        } else if (action.action === 'startBold') {
            currentSection = 'bold';
            executeNext();
            
        } else if (action.action === 'endBold') {
            currentSection = 'after';
            executeNext();
            
        } else if (action.action === 'pause') {
            setTimeout(() => {
                executeNext();
            }, action.duration);
            
        } else if (action.action === 'removeCursor') {
            const cursor = container.querySelector('.cursor');
            if (cursor) {
                setTimeout(() => {
                    cursor.style.display = 'none';
                }, 1000);
            }
        }
    }
    
    function updateDisplay() {
        let html = '';
        
        // Contenido antes de la negrita
        if (beforeBold.length > 0) {
            let beforeHtml = escapeHtml(beforeBold);
            beforeHtml = beforeHtml.replace(/\n/g, '<br>');
            html += beforeHtml;
        }
        
        // Contenido en negrita
        if (boldContent.length > 0) {
            let boldHtml = escapeHtml(boldContent);
            boldHtml = boldHtml.replace(/\n/g, '<br>');
            html += '<strong>' + boldHtml + '</strong>';
        }
        
        // Contenido después de la negrita
        if (afterBold.length > 0) {
            let afterHtml = escapeHtml(afterBold);
            afterHtml = afterHtml.replace(/\n/g, '<br>');
            html += afterHtml;
        }
        
        container.innerHTML = html + '<span class="cursor">|</span>';
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    executeNext();
}

// SLIDE 9: Insultos del lunes
let slide9Active = false;
function startSlide9Effect() {
    if (slide9Active) return;
    slide9Active = true;
    
    const text = `MUJER: ¡Mocito, dócil, pimpollo!

HOMBRE: ...un lunes

MUJER: para escuchar de vuelta:

HOMBRE: ¡ociosa, inactiva, apartada!`;
    
    typewriterEffect('typewriter-slide9', text, 70);
}

// SLIDE 10: Lista de insultos con CLICK
let slide10Active = false;
function startSlide10Effect() {
    if (slide10Active) return;
    slide10Active = true;
    
    const element = document.getElementById('typewriter-slide10');
    if (!element) return;
    
    element.innerHTML = '';
    
    let content = '';
    let waitingForClick = false;
    let clickHandlerAdded = false;
    let contentBeforeGusta = ''; // Todo el contenido ANTES de "gusta"
    let contentAfterGusta = ''; // Todo el contenido DESPUÉS de "gusta" (insultos)
    
    // Secuencia de acciones
    const sequence = [
        { action: 'type', text: '(suena música de fondo)\n\n' },
        { action: 'type', text: 'Ambos encuentran divertido intercambiarse insultos cuando se encuentran, les ' },
        { action: 'type', text: 'excita' },
        { action: 'pause', duration: 300 },
        { action: 'delete', chars: 6 }, // Borrar "excita"
        { action: 'type', text: 'estimula, y les ' },
        { action: 'type', text: 'excita' },
        { action: 'pause', duration: 300 },
        { action: 'delete', chars: 6 }, // Borrar "excita"
        { action: 'saveBeforeGusta' }, // Guardar todo ANTES de "gusta"
        { action: 'type', text: 'gusta' },
        { action: 'saveAfterGustaStart' }, // Marcar inicio de la parte de insultos
        { action: 'newline' },
        { action: 'newline' },
        { action: 'pause', duration: 500 },
        { action: 'type', text: 'HOMBRE: trincherosa, impetuosa, desincronizada' },
        { action: 'newline' },
        { action: 'type', text: 'MUJER: enfocado, fermento, sospechoso' },
        { action: 'waitClick' }, // PAUSAR aquí sin mostrar texto
        { action: 'replaceGustaWithExcita' }, // Reemplazar gusta con excita manteniendo insultos
        { action: 'newline' },
        { action: 'newline' },
        { action: 'pause', duration: 500 },
        { action: 'type', text: 'Escena 3 – estrategias de la mujer' },
        { action: 'removeCursor' }
    ];
    
    let sequenceIndex = 0;
    
    function executeNext() {
        if (sequenceIndex >= sequence.length) return;
        
        const action = sequence[sequenceIndex];
        sequenceIndex++;
        
        if (action.action === 'type') {
            let charIndex = 0;
            const interval = setInterval(() => {
                if (charIndex < action.text.length) {
                    content += action.text[charIndex];
                    updateDisplay();
                    charIndex++;
                } else {
                    clearInterval(interval);
                    executeNext();
                }
            }, 60);
            
        } else if (action.action === 'delete') {
            let charsDeleted = 0;
            const deleteInterval = setInterval(() => {
                if (charsDeleted < action.chars && content.length > 0) {
                    content = content.slice(0, -1);
                    updateDisplay();
                    charsDeleted++;
                } else {
                    clearInterval(deleteInterval);
                    executeNext();
                }
            }, 40);
            
        } else if (action.action === 'pause') {
            setTimeout(() => {
                executeNext();
            }, action.duration);
            
        } else if (action.action === 'newline') {
            content += '\n';
            updateDisplay();
            executeNext();
            
        } else if (action.action === 'saveBeforeGusta') {
            contentBeforeGusta = content;
            executeNext();
            
        } else if (action.action === 'saveAfterGustaStart') {
            // Guardar todo lo que viene después de "gusta"
            contentAfterGusta = content.substring(contentBeforeGusta.length + 5); // +5 por "gusta"
            executeNext();
            
        } else if (action.action === 'replaceGustaWithExcita') {
            // Construir el contenido completo actual
            const fullContentNow = content;
            
            // Encontrar exactamente dónde está "gusta" en el texto
            const gustaIndex = contentBeforeGusta.length;
            
            // Mostrar cursor en la posición de "gusta"
            content = contentBeforeGusta + 'gusta';
            const afterGusta = fullContentNow.substring(gustaIndex + 5);
            
            // Mostrar cursor justo después de "gusta"
            updateDisplayAtPosition(gustaIndex + 5, afterGusta);
            
            setTimeout(() => {
                // Borrar "gusta" letra por letra
                let charsDeleted = 0;
                const deleteInterval = setInterval(() => {
                    if (charsDeleted < 5) {
                        content = content.slice(0, -1);
                        updateDisplayAtPosition(content.length, afterGusta);
                        charsDeleted++;
                    } else {
                        clearInterval(deleteInterval);
                        
                        // Escribir "excita." letra por letra
                        const newWord = 'excita.';
                        let charIndex = 0;
                        const typeInterval = setInterval(() => {
                            if (charIndex < newWord.length) {
                                content += newWord[charIndex];
                                updateDisplayAtPosition(content.length, afterGusta);
                                charIndex++;
                            } else {
                                clearInterval(typeInterval);
                                
                                // Restaurar el contenido completo con los insultos
                                content = content + afterGusta;
                                updateDisplay();
                                
                                setTimeout(() => {
                                    executeNext();
                                }, 500);
                            }
                        }, 60);
                    }
                }, 40);
            }, 500);
            
        } else if (action.action === 'waitClick') {
            waitingForClick = true;
            
            if (!clickHandlerAdded) {
                clickHandlerAdded = true;
                const clickHandler = (e) => {
                    if (waitingForClick) {
                        waitingForClick = false;
                        document.removeEventListener('click', clickHandler, true);
                        executeNext();
                        e.stopPropagation();
                    }
                };
                
                // Usar capture phase para interceptar el click antes
                document.addEventListener('click', clickHandler, true);
            }
            
        } else if (action.action === 'removeCursor') {
            const cursor = element.querySelector('.cursor');
            if (cursor) {
                setTimeout(() => {
                    cursor.style.display = 'none';
                }, 1000);
            }
        }
    }
    
    function updateDisplay() {
        let html = content.replace(/\n/g, '<br>');
        element.innerHTML = html + '<span class="cursor">|</span>';
    }
    
    function updateDisplayAtPosition(cursorPos, textAfter) {
        // Mostrar cursor en una posición específica, manteniendo el texto después visible
        const beforeCursor = content.substring(0, cursorPos);
        let html = beforeCursor.replace(/\n/g, '<br>') + 
                   '<span class="cursor">|</span>' + 
                   textAfter.replace(/\n/g, '<br>');
        element.innerHTML = html;
    }
    
    executeNext();
}

// SLIDE 11: JULTAGI
let slide11Active = false;
function startSlide11Effect() {
    if (slide11Active) return;
    slide11Active = true;
    
    const text = `Escena 4 – JULTAGI`;
    
    typewriterEffect('typewriter-slide11', text, 70);
}

// SLIDE 12: Alevosía
let slide12Active = false;
function startSlide12Effect() {
    if (slide12Active) return;
    slide12Active = true;
    
    const text = `MUJER: .....con el peso de tu alevosía

(si tuviéramos presupuesto, podríamos contar con el abecedario erótico de Alonso Santiago. Hablar con Pilar)

HOMBRE: Un día le prometí.....`;
    
    typewriterEffect('typewriter-slide12', text, 70);
}

// SLIDES 13-17: LETRAS
function createLetterSlide(slideNum, letter, text) {
    return function() {
        const varName = `slide${slideNum}Active`;
        if (window[varName]) return;
        window[varName] = true;
        
        const fullText = `LETRA ${letter}\n\n${text}`;
        typewriterEffect(`typewriter-slide${slideNum}`, fullText, 70);
    };
}

let slide13Active = false;
function startSlide13Effect() {
    if (slide13Active) return;
    slide13Active = true;
    
    const element = document.getElementById('typewriter-slide13');
    if (!element) return;
    
    element.innerHTML = '<img src="images/A_Alonso_Santiago.png" alt="Letra A" style="max-width: 90%; max-height: 85vh; display: block; margin: 0 auto;">';
}

let slide14Active = false;
function startSlide14Effect() {
    if (slide14Active) return;
    slide14Active = true;
    
    const element = document.getElementById('typewriter-slide14');
    if (!element) return;
    
    element.innerHTML = '<img src="images/F_Alonso_Santiago.png" alt="Letra F" style="max-width: 90%; max-height: 85vh; display: block; margin: 0 auto;">';
}

let slide15Active = false;
function startSlide15Effect() {
    if (slide15Active) return;
    slide15Active = true;
    
    const element = document.getElementById('typewriter-slide15');
    if (!element) return;
    
    element.innerHTML = '<img src="images/L_Alonso_Santiago.png" alt="Letra L" style="max-width: 90%; max-height: 85vh; display: block; margin: 0 auto;">';
}

let slide16Active = false;
function startSlide16Effect() {
    if (slide16Active) return;
    slide16Active = true;
    
    const element = document.getElementById('typewriter-slide16');
    if (!element) return;
    
    element.innerHTML = '<img src="images/D_Alonso_Santiago.png" alt="Letra D" style="max-width: 90%; max-height: 85vh; display: block; margin: 0 auto;">';
}

let slide17Active = false;
function startSlide17Effect() {
    if (slide17Active) return;
    slide17Active = true;
    
    const element = document.getElementById('typewriter-slide17');
    if (!element) return;
    
    element.innerHTML = '<img src="images/M_Alonso_Santiago.png" alt="Letra M" style="max-width: 90%; max-height: 85vh; display: block; margin: 0 auto;">';
}

// SLIDE 19: LETRA P
let slide19Active = false;
function startSlide19Effect() {
    if (slide19Active) return;
    slide19Active = true;
    
    const element = document.getElementById('typewriter-slide19');
    if (!element) return;
    
    element.innerHTML = '<img src="images/P_Alonso_Santiago.png" alt="Letra P" style="max-width: 90%; max-height: 85vh; display: block; margin: 0 auto;">';
}

// SLIDE 20: El sentido no es previo
let slide20Active = false;
function startSlide20Effect() {
    if (slide20Active) return;
    slide20Active = true;
    
    const text = `MUJER: ......El sentido no es previo.

Escena 5 – los pisos tienen vida

MUJER: Los pisos tienen vida.`;
    
    typewriterEffect('typewriter-slide20', text, 60);
}

// SLIDE 21: Urbanismo + Escena 6
let slide21Active = false;
function startSlide21Effect() {
    if (slide21Active) return;
    slide21Active = true;
    
    const text = `HOMBRE: ......hasta que urbanismo pusiera orden.

Escena 6 – Él

Con música de Bunbury, "lo que queda por vivir", él desordena su vida, recolocando los muebles de su cabeza.

HOMBRE: Muchas ganas, y desconcierto, y bastante miedo...`;
    
    typewriterEffect('typewriter-slide21', text, 60);
}

// SLIDE 22: Saliva mocos
let slide22Active = false;
function startSlide22Effect() {
    if (slide22Active) return;
    slide22Active = true;
    typewriterEffect('typewriter-slide22', 'HOMBRE: .... saliva, mocos, esputos, pipís, cacas', 70);
}

// SLIDE 23: Pandemias
let slide23Active = false;
function startSlide23Effect() {
    if (slide23Active) return;
    slide23Active = true;
    typewriterEffect('typewriter-slide23', 'HOMBRE: .... treponemas, VIH, gripe A, covid 19', 70);
}

// SLIDE 24: Cambios
let slide24Active = false;
function startSlide24Effect() {
    if (slide24Active) return;
    slide24Active = true;
    typewriterEffect('typewriter-slide24', 'HOMBRE:\n... cambios poquitas veces propiciados por mí', 70);
}

// SLIDE 25: Cinco bodas
let slide25Active = false;
function startSlide25Effect() {
    if (slide25Active) return;
    slide25Active = true;
    typewriterEffect('typewriter-slide25', 'HOMBRE: ... ¡Cinco bodas!', 80);
}

// SLIDE 26: Bandera EEUU
let slide26Active = false;
function startSlide26Effect() {
    if (slide26Active) return;
    slide26Active = true;
    
    const element = document.getElementById('typewriter-slide26');
    if (!element) return;
    
    element.innerHTML = '';
    
    let content = '';
    
    const sequence = [
        { action: 'type', text: 'HOMBRE: ...o ya puestos, la de EEUU con su salpicado de ' },
        { action: 'type', text: 'mierda de culo naranja' },
        { action: 'pause', duration: 400 },
        { action: 'delete', chars: 22 }, // Borrar "mierda de culo naranja"
        { action: 'type', text: 'estrellas.' },
        { action: 'removeCursor' }
    ];
    
    let sequenceIndex = 0;
    
    function executeNext() {
        if (sequenceIndex >= sequence.length) return;
        
        const action = sequence[sequenceIndex];
        sequenceIndex++;
        
        if (action.action === 'type') {
            let charIndex = 0;
            const interval = setInterval(() => {
                if (charIndex < action.text.length) {
                    content += action.text[charIndex];
                    updateDisplay();
                    charIndex++;
                } else {
                    clearInterval(interval);
                    executeNext();
                }
            }, 60);
            
        } else if (action.action === 'delete') {
            let charsDeleted = 0;
            const deleteInterval = setInterval(() => {
                if (charsDeleted < action.chars && content.length > 0) {
                    content = content.slice(0, -1);
                    updateDisplay();
                    charsDeleted++;
                } else {
                    clearInterval(deleteInterval);
                    executeNext();
                }
            }, 40);
            
        } else if (action.action === 'pause') {
            setTimeout(() => {
                executeNext();
            }, action.duration);
            
        } else if (action.action === 'removeCursor') {
            const cursor = element.querySelector('.cursor');
            if (cursor) {
                setTimeout(() => {
                    cursor.style.display = 'none';
                }, 1000);
            }
        }
    }
    
    function updateDisplay() {
        element.innerHTML = content + '<span class="cursor">|</span>';
    }
    
    executeNext();
}

// SLIDE 27: Mis mis mis
let slide27Active = false;
function startSlide27Effect() {
    if (slide27Active) return;
    slide27Active = true;
    
    const text = 'HOMBRE: ... mis .....mis.... mis......mis ...... mis ....mis......';
    
    typewriterEffect('typewriter-slide27', text, 70);
}

// SLIDE 28: Prosopagnósico
let slide28Active = false;
function startSlide28Effect() {
    if (slide28Active) return;
    slide28Active = true;
    typewriterEffect('typewriter-slide28', 'MUJER: Y además, prosopagnósico.\n¡Y coprofílico!', 70);
}

// SLIDE 29: No más excusas
let slide29Active = false;
function startSlide29Effect() {
    if (slide29Active) return;
    slide29Active = true;
    
    const text = `MUJER: No más excusas para no hacerlo.

Es que, es que, es que, es que, es que, es que, es que, es que`;
    
    typewriterEffect('typewriter-slide29', text, 60);
}

// SLIDE 30: Toca avanzar
let slide30Active = false;
function startSlide30Effect() {
    if (slide30Active) return;
    slide30Active = true;
    
    const text = `MUJER: ...Toca avanzar.

Escena 7 – mi madre`;
    
    typewriterEffect('typewriter-slide30', text, 70);
}

// SLIDE 31: Alexa calla
let slide31Active = false;
function startSlide31Effect() {
    if (slide31Active) return;
    slide31Active = true;
    
    const text = `Suena su teléfono, sobre acordes de Tom Waits

Escena 8 – AYAHUASCA

MUJER: Alexa, calla.`;
    
    typewriterEffect('typewriter-slide31', text, 70);
}

// SLIDE 32: Título final
let slide32Active = false;
function startSlide32Effect() {
    if (slide32Active) return;
    slide32Active = true;
    
    const element = document.getElementById('typewriter-slide32');
    if (!element) return;
    
    // Efecto de "volver atrás" - mostrar algunas líneas de texto que desaparecen rápidamente
    const flashTexts = [
        'Escena 9 – Bajo tierra, ni muertos.',
        'MUJER: Alexa, calla.',
        'Escena 7 – mi madre',
        'MUJER: ...Toca avanzar.',
        'Es que, es que, es que...',
        'MUJER: No más excusas...',
        'HOMBRE: ... mis .....mis....',
    ];
    
    let flashIndex = 0;
    const flashInterval = setInterval(() => {
        if (flashIndex < flashTexts.length) {
            element.innerHTML = `<p style="opacity: 0.3; font-size: 1.2rem;">${flashTexts[flashIndex]}</p>`;
            flashIndex++;
        } else {
            clearInterval(flashInterval);
            
            // Ahora mostrar la primera hoja con "Título: pendiente de decidir" YA ESCRITO en NEGRITA
            setTimeout(() => {
                element.innerHTML = '<strong>Título: <span id="titulo-temp">pendiente de decidir</span></strong><span class="cursor">|</span>';
                
                // Esperar un momento y luego borrar "pendiente de decidir"
                setTimeout(() => {
                    let currentText = 'pendiente de decidir';
                    const deleteInterval = setInterval(() => {
                        if (currentText.length > 0) {
                            currentText = currentText.slice(0, -1);
                            document.getElementById('titulo-temp').textContent = currentText;
                        } else {
                            clearInterval(deleteInterval);
                            
                            // Escribir "Bajo tierra, ni muertos." EN NEGRITA CON COMILLAS
                            const newTitle = '"Bajo tierra, ni muertos."';
                            let charIndex = 0;
                            const typeInterval = setInterval(() => {
                                if (charIndex < newTitle.length) {
                                    currentText += newTitle[charIndex];
                                    document.getElementById('titulo-temp').textContent = currentText;
                                    charIndex++;
                                } else {
                                    clearInterval(typeInterval);
                                    
                                    // Continuar con el resto del texto (NORMAL, no negrita)
                                    setTimeout(() => {
                                        const restOfText = '\n\n(suena música de piano con acordes tipo "cajita de música", y se mantiene durante todo el primer párrafo que ella habla)\n\nEscena 9 – Bajo tierra, ni muertos.';
                                        // Cerrar el strong y continuar con texto normal
                                        let content = '<strong>Título: "Bajo tierra, ni muertos."</strong>';
                                        let restIndex = 0;
                                        
                                        const finalInterval = setInterval(() => {
                                            if (restIndex < restOfText.length) {
                                                if (restOfText[restIndex] === '\n') {
                                                    content += '<br>';
                                                } else {
                                                    content += restOfText[restIndex];
                                                }
                                                element.innerHTML = content + '<span class="cursor">|</span>';
                                                restIndex++;
                                            } else {
                                                clearInterval(finalInterval);
                                                // Ocultar cursor al final
                                                setTimeout(() => {
                                                    const cursor = element.querySelector('.cursor');
                                                    if (cursor) cursor.style.display = 'none';
                                                }, 1000);
                                            }
                                        }, 60);
                                    }, 500);
                                }
                            }, 60);
                        }
                    }, 40);
                }, 1500);
            }, 300);
        }
    }, 400);
}

// SLIDE 33: APAGÓN (fondo negro, texto blanco)
let slide33Active = false;
function startSlide33Effect() {
    if (slide33Active) return;
    slide33Active = true;
    
    const element = document.getElementById('typewriter-slide33');
    if (!element) return;
    
    element.innerHTML = '';
    
    const text = `(se apagan las luces de la sala)

Escena 10 – APAGÓN

No hay luz en toda España, no se sabe qué está pasando. No funciona nada. La mujer coge un transistor a pilas. Él coge una vela, que enciende, y camina hacia ella con un camping gas, dispuestos a preparar la cena. Abren un cava y celebran la vida, más incierta que nunca.

Hay música

Bailan`;
    
    typewriterEffect('typewriter-slide33', text, 70);
        // Start simple typewriter for slide33
        typewriterEffect('typewriter-slide33', text, 70);

        // Ensure only the apagon audio (mabel apagon_mezcla.mp3) is used for this slide.
        // Do NOT start or touch Sirat audio here.
        if (!apagonAudio) apagonAudio = document.getElementById('audio-apagon');
        if (apagonAudio) {
            apagonAudio.currentTime = 0;
            apagonAudio.volume = 1;
            // Play immediately when the slide effect starts
            apagonAudio.play();
            apagonAudioStarted = true;
        }
}

// ===== MUTATION OBSERVERS =====
const slideObservers = [];
for (let i = 1; i <= 33; i++) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && mutation.target.id === `slide${i}`) {
                setTimeout(() => window[`startSlide${i}Effect`](), 300);
            } else if (!mutation.target.classList.contains('active') && mutation.target.id === `slide${i}`) {
                window[`slide${i}Active`] = false;
            }
        });
    });
    const slideElement = document.getElementById(`slide${i}`);
    if (slideElement) {
        observer.observe(slideElement, { attributes: true, attributeFilter: ['class'] });
        slideObservers.push(observer);
    }
}

// Última diapositiva (slide33): reproducir audio apagon automáticamente
const observerApagon = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active') && mutation.target.id === 'slide33') {
            if (!apagonAudioStarted) {
                if (!apagonAudio) apagonAudio = document.getElementById('audio-apagon');
                if (apagonAudio) {
                    apagonAudio.currentTime = 0;
                    apagonAudio.play();
                    apagonAudioStarted = true;
                }
            }
        } else if (!mutation.target.classList.contains('active') && mutation.target.id === 'slide33') {
            // Si se sale de la última diapositiva, detener el audio
            if (apagonAudio && !apagonAudio.paused) {
                apagonAudio.pause();
                apagonAudio.currentTime = 0;
                apagonAudioStarted = false;
            }
        }
    });
});
const slide33Element = document.getElementById('slide33');
if (slide33Element) {
    observerApagon.observe(slide33Element, { attributes: true, attributeFilter: ['class'] });
}

// ===== NAVEGACIÓN CON CLICK =====
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-btn') || e.target.closest('.dot')) return;
    // Special behavior for slide 33: a click stops the apagon audio and does NOT advance the slide.
    if (currentSlide === 33) {
        if (!apagonAudio) apagonAudio = document.getElementById('audio-apagon');
        if (apagonAudio && apagonAudioStarted && !apagonAudio.paused) {
            apagonAudio.pause();
            apagonAudio.currentTime = 0;
            apagonAudioStarted = false;
            return;
        }
        // If audio already stopped, allow normal click navigation below
    }
    // Si estamos en la primera diapositiva y el audio no ha empezado, lo iniciamos y bloqueamos avance
    if (currentSlide === 0 && !siratAudioStarted) {
        if (!siratAudio) siratAudio = document.getElementById('audio-sirat');
        if (siratAudio) {
            siratAudio.currentTime = 0;
            siratAudio.play();
            siratAudioStarted = true;
            siratBlockAdvance = true;
            // Tras 90 segundos, permitir avanzar y cambiar automáticamente
            siratAllowAdvanceTimeout = setTimeout(() => {
                siratBlockAdvance = false;
                showSlide(1);
            }, 90000);
        }
        return;
    }
    // Si estamos en la primera diapositiva y el audio ya está sonando, permitir avanzar con click
    if (currentSlide === 0 && siratBlockAdvance) {
        siratBlockAdvance = false;
        showSlide(1);
        return;
    }
    // Comportamiento normal para otras diapositivas
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    if (clickX < screenWidth * 0.3) {
        showSlide(currentSlide - 1);
    } else {
        showSlide(currentSlide + 1);
    }
});

// ===== NAVEGACIÓN CON TECLADO =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        showSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showSlide(currentSlide - 1);
    }
});

// ===== NAVEGACIÓN TÁCTIL =====
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
        showSlide(currentSlide + 1);
    }
    if (touchEndX > touchStartX + 50) {
        showSlide(currentSlide - 1);
    }
}

// ===== INICIALIZACIÓN =====
showSlide(0);
