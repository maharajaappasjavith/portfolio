// Toggle Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const menuIcon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', () => {
	navLinks.classList.toggle('active');
	
	if (navLinks.classList.contains('active')) {
		menuIcon.classList.remove('fa-bars');
		menuIcon.classList.add('fa-times');
	} else {
		menuIcon.classList.remove('fa-times');
		menuIcon.classList.add('fa-bars');
	}
});

// Typing Effect
const textElement = document.querySelector('.typing-text');
const words = ["Mechanical Engineer", "Cyber Security Consultant", "FEA Analyst", "Drone Pilot", "Python Developer", "CAD Designer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
	const currentWord = words[wordIndex];
	const currentChars = currentWord.substring(0, charIndex);
	
	textElement.textContent = currentChars;

	if (!isDeleting && charIndex < currentWord.length) {
		charIndex++;
		setTimeout(typeEffect, 100);
	} else if (isDeleting && charIndex > 0) {
		charIndex--;
		setTimeout(typeEffect, 50);
	} else {
		isDeleting = !isDeleting;
		if (!isDeleting) {
			wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
		}
		setTimeout(typeEffect, 1200);
	}
};

document.addEventListener('DOMContentLoaded', typeEffect);

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		navLinks.classList.remove('active');
		if (menuIcon) {
			menuIcon.classList.remove('fa-times');
			menuIcon.classList.add('fa-bars');
		}

		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			const headerOffset = 80;
			const elementPosition = target.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
	
			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth"
			});
		}
	});
});

/* --- DYNAMIC IRREGULAR WIREMESH (LOW POLY STYLE) --- */
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width, height;
// Start mouse off-screen
let mouse = { x: -500, y: -500 }; 

// Mesh Configuration
const spacing = 60; // Increased spacing slightly for better irregular look
let rows, cols;
let points = [];
let time = 0; 

// Track mouse
window.addEventListener('mousemove', (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

function resize() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	
	// Add extra cols/rows to cover edges when points are randomized
	cols = Math.ceil(width / spacing) + 2;
	rows = Math.ceil(height / spacing) + 2;
	
	initMesh();
}

// Initialize Grid Points with RANDOM OFFSETS
function initMesh() {
	points = [];
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			
			// Calculate base grid position
			let bx = (x - 1) * spacing; // -1 to start off-screen left
			let by = (y - 1) * spacing; // -1 to start off-screen top

			// Add Randomness (The "Irregular" Part)
			// We shift the point by up to 45% of the spacing in any direction
			// This keeps the topology connected but distorts the shape
			let offsetX = (Math.random() - 0.5) * spacing * 0.9;
			let offsetY = (Math.random() - 0.5) * spacing * 0.9;

			points.push({
				x: bx + offsetX,
				y: by + offsetY,
				originX: bx + offsetX, 
				originY: by + offsetY,
				angle: Math.random() * Math.PI * 2 
			});
		}
	}
}

function getThermalColor(dist) {
	const heatRadius = 350;
	let t = Math.min(dist / heatRadius, 1);
	
	// Thermal Scale: Red(0) -> Blue(240)
	const hue = 240 * t; 
	const lightness = 60 - (t * 45); 
	
	// Alpha: Wireframes need higher opacity
	const alpha = 1.0 - (t * 0.75); 

	return `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
}

function animate() {
	ctx.clearRect(0, 0, width, height);

	// Update Time
	time += 0.015; // Slightly slower for heavier mesh feel

	// 1. Update Point Positions (Organic Wave)
	points.forEach(p => {
		// Wave motion
		const waveX = Math.sin(p.originY * 0.02 + time) * 5; // Reduced amplitude for stability
		const waveY = Math.cos(p.originX * 0.02 + time) * 5;

		p.x = p.originX + waveX;
		p.y = p.originY + waveY;
	});

	// 2. Draw Triangles
	for (let y = 0; y < rows - 1; y++) {
		for (let x = 0; x < cols - 1; x++) {
			
			const idx = y * cols + x;
			const p1 = points[idx];
			const p2 = points[idx + 1];
			const p3 = points[idx + cols];
			const p4 = points[idx + cols + 1];

			// We draw two triangles per grid square to form the mesh
			// Randomizing the split direction for extra irregularity
			if ((x + y) % 2 === 0) {
				drawTriangle(p1, p2, p3);
				drawTriangle(p2, p4, p3);
			} else {
				// Alternate diagonal split
				drawTriangle(p1, p2, p4);
				drawTriangle(p1, p4, p3);
			}
		}
	}

	requestAnimationFrame(animate);
}

function drawTriangle(p1, p2, p3) {
	// Centroid
	const cx = (p1.x + p2.x + p3.x) / 3;
	const cy = (p1.y + p2.y + p3.y) / 3;

	// Mouse Distance
	const dx = cx - mouse.x;
	const dy = cy - mouse.y;
	const dist = Math.sqrt(dx * dx + dy * dy);

	// Color
	const color = getThermalColor(dist);

	// Draw
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.lineTo(p3.x, p3.y);
	ctx.closePath();
	
	// WIREFRAME MODE
	ctx.strokeStyle = color; 
	ctx.lineWidth = 0.8; 
	ctx.stroke();
}

window.addEventListener('resize', resize);

resize();
animate();		setTimeout(typeEffect, 50);
	} else {
		isDeleting = !isDeleting;
		if (!isDeleting) {
			wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
		}
		setTimeout(typeEffect, 1200);
	}
};

document.addEventListener('DOMContentLoaded', typeEffect);

// Smooth Scroll & Auto-Close Menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		
		// Close mobile menu
		navLinks.classList.remove('active');
		
		// Reset icon
		if (menuIcon) {
			menuIcon.classList.remove('fa-times');
			menuIcon.classList.add('fa-bars');
		}

		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			const headerOffset = 80; // Offset for fixed header
			const elementPosition = target.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
	
			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth"
			});
		}
	});
});
