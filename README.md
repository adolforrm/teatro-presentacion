# Presentación de Teatro

Una presentación interactiva con HTML, CSS y JavaScript para acompañar una obra de teatro.

## 🎭 Características

- ✨ **Efecto máquina de escribir** para textos
- 🖼️ **Aparición progresiva** de imágenes
- 🎨 **Diseño elegante** con gradientes y sombras
- 📱 **Responsive** - funciona en móviles y tablets
- ⌨️ **Navegación múltiple**:
  - Botones en pantalla
  - Flechas del teclado (← →)
  - Puntos indicadores
  - Gestos táctiles (swipe)
- 🖥️ **Modo pantalla completa** (presiona F11)

## 🚀 Cómo usar

1. Abre el archivo `index.html` en tu navegador
2. Navega entre diapositivas usando:
   - Los botones "Anterior" y "Siguiente"
   - Las flechas del teclado
   - Los puntos indicadores
   - Desliza (swipe) en dispositivos táctiles

## 📝 Cómo personalizar

### Añadir nuevas diapositivas

Edita el archivo `index.html` y añade una nueva sección dentro de `<div class="presentation-container">`:

\`\`\`html
<section class="slide" id="slide4">
    <div class="content">
        <h2 class="typewriter">Tu título aquí</h2>
        <p class="typewriter delay-1">Tu texto aquí</p>
    </div>
</section>
\`\`\`

**No olvides:**
1. Actualizar el contador en la sección de navegación (cambiar "1 / 3" por "1 / 4")
2. Añadir un nuevo punto indicador: `<span class="dot" data-slide="3"></span>`
3. Actualizar `const totalSlides` en `script.js` si es necesario

### Cambiar imágenes

Reemplaza `imagen-ejemplo.jpg` con tus propias imágenes. Coloca las imágenes en la misma carpeta que `index.html`.

### Ajustar velocidad del efecto máquina de escribir

En `styles.css`, modifica la duración en la animación `typing`:

\`\`\`css
animation: typing 3s steps(40, end); /* Cambia 3s por la duración deseada */
\`\`\`

### Cambiar colores

En `styles.css`, busca las siguientes variables:
- Fondo: `background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);`
- Texto principal: `color: #f0e68c;`
- Borde de máquina de escribir: `border-right: 3px solid #f0e68c;`

### Añadir delays a las animaciones

Usa las clases `delay-1`, `delay-2`, etc.:

\`\`\`html
<p class="typewriter delay-1">Aparece después del primer texto</p>
<p class="typewriter delay-2">Aparece después del segundo texto</p>
\`\`\`

## 🎨 Estructura de archivos

\`\`\`
Teatro/
├── index.html      # Estructura de la presentación
├── styles.css      # Estilos y animaciones
├── script.js       # Lógica de navegación
└── README.md       # Este archivo
\`\`\`

## 💡 Consejos

- Para una presentación profesional, usa imágenes de alta calidad
- Mantén los textos concisos y legibles
- Prueba la presentación en pantalla completa antes del evento
- Considera añadir música de fondo con un elemento `<audio>` si lo deseas
- Practica la navegación antes de la presentación

## 🎬 Modo presentación

Presiona **F11** para entrar en modo pantalla completa durante la presentación.

¡Que tengas una excelente presentación! 🎭✨
