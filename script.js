/* --- NAVIGATION LOGIC --- */
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

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
	link.addEventListener('click', () => {
		navLinks.classList.remove('active');
		menuIcon.classList.remove('fa-times');
		menuIcon.classList.add('fa-bars');
	});
});

/* --- TYPEWRITER EFFECT --- */
const textElement = document.querySelector('.typing-text');
const words = ["MECHANICAL ENGINEER", "CYBER SECURITY ANALYST", "CAD DESIGNER", "WHITE HAT HACKER"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
	const currentWord = words[wordIndex];
	const currentChars = currentWord.substring(0, charIndex);
	textElement.textContent = currentChars;

	if (!isDeleting && charIndex < currentWord.length) {
		charIndex++;
		setTimeout(typeEffect, 80);
	} else if (isDeleting && charIndex > 0) {
		charIndex--;
		setTimeout(typeEffect, 40);
	} else {
		isDeleting = !isDeleting;
		if (!isDeleting) {
			wordIndex = (wordIndex + 1) % words.length;
			setTimeout(typeEffect, 1500); 
		} else {
			setTimeout(typeEffect, 500); 
		}
	}
}
document.addEventListener('DOMContentLoaded', typeEffect);

/* --- AUTO-SCRAMBLE HEADER --- */
const target = document.getElementById('scramble-target');
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scrambleText() {
	let iterations = 0;
	const originalText = target.dataset.value;
	
	const interval = setInterval(() => {
		target.innerText = originalText.split("").map((letter, index) => {
			if(index < iterations) return originalText[index];
			return letters[Math.floor(Math.random() * letters.length)];
		}).join("");

		if(iterations >= originalText.length) clearInterval(interval);
		iterations += 1 / 3;
	}, 30);
}
setInterval(scrambleText, 5000);

/* --- RESPONSIVE CANVAS ANIMATION --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let w, h;
let isMobile = false;

function resize() { 
	w = canvas.width = window.innerWidth; 
	h = canvas.height = window.innerHeight;
	// Check if mobile (width < 768px)
	isMobile = w < 768;
	
	initMatrix(); // Re-calc columns
	initGears();  // Re-position gears
}
window.addEventListener('resize', resize);

// --- MATRIX RAIN ---
const matrixChars = "101101001";
const fontSize = 14;
let columns;
let drops = [];

function initMatrix() {
	// Desktop: cover half width. Mobile: cover full width
	const areaWidth = isMobile ? w : w / 2;
	columns = Math.floor(areaWidth / fontSize);
	drops = Array(columns).fill(1);
}

function drawMatrix() {
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	// Fade depends on mode
	ctx.fillRect(0, 0, isMobile ? w : w/2, h); 
	
	ctx.fillStyle = isMobile ? "rgba(0, 243, 255, 0.15)" : "#00f3ff"; // Dimmer on mobile
	ctx.font = fontSize + "px monospace";

	for(let i=0; i<drops.length; i++) {
		const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
		ctx.fillText(text, i*fontSize, drops[i]*fontSize);
		
		if(drops[i]*fontSize > h && Math.random() > 0.98) drops[i] = 0;
		drops[i]++;
	}
}

// --- GEARS ---
class Gear {
	constructor(x, y, radius, teeth, speed, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.teeth = teeth;
		this.speed = speed;
		this.color = color;
		this.angle = 0;
	}

	update() {
		this.angle += this.speed;
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		ctx.fillStyle = "rgba(255, 157, 0, 0.05)"; // Very subtle fill

		// Gear Body
		ctx.beginPath();
		const outerRadius = this.radius;
		const innerRadius = this.radius * 0.85;
		const holeRadius = this.radius * 0.3;

		for (let i = 0; i < this.teeth; i++) {
			const a = (Math.PI * 2 * i) / this.teeth;
			const ta = (Math.PI * 2) / (this.teeth * 2); 
			
			const x1 = Math.cos(a) * (outerRadius + 8);
			const y1 = Math.sin(a) * (outerRadius + 8);
			const x2 = Math.cos(a + ta) * outerRadius;
			const y2 = Math.sin(a + ta) * outerRadius;

			if (i === 0) ctx.moveTo(x1, y1);
			else ctx.lineTo(x1, y1);
			
			ctx.lineTo(x2, y2);
			ctx.arc(0, 0, outerRadius, a + ta, a + (Math.PI * 2) / this.teeth);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.fill();

		// Inner Rims
		ctx.beginPath(); ctx.arc(0, 0, innerRadius, 0, Math.PI * 2); ctx.stroke();
		ctx.beginPath(); ctx.arc(0, 0, holeRadius, 0, Math.PI * 2); 
		ctx.fillStyle = "#050505"; ctx.fill(); ctx.stroke();

		ctx.restore();
	}
}

let gears = [];

function initGears() {
	gears = [];
	
	if (isMobile) {
		// MOBILE: Place one large gear at bottom right, barely visible
		gears.push(new Gear(w * 0.9, h * 0.9, 80, 20, 0.005, "rgba(255, 157, 0, 0.2)"));
		gears.push(new Gear(w * 0.9 - 100, h * 0.9 - 60, 40, 12, -0.01, "rgba(255, 157, 0, 0.2)"));
	} else {
		// DESKTOP: Original complex linkage on the right side
		const centerX = w * 0.75;
		const centerY = h * 0.5;
		gears.push(new Gear(centerX, centerY + 100, 80, 24, 0.01, "#ff9d00"));
		gears.push(new Gear(centerX + 130, centerY - 10, 50, 16, -0.016, "#ff9d00"));
		gears.push(new Gear(centerX - 100, centerY + 20, 30, 12, -0.026, "#ff9d00"));
	}
}

// --- ANIMATION LOOP ---
// Initial Setup
resize();

function animate() {
	// 1. Draw Matrix Rain
	drawMatrix();

	// 2. Handle Right Side / Overlay
	if (!isMobile) {
		// Clear Right Side for Gears
		ctx.clearRect(w/2, 0, w/2, h);
		ctx.fillStyle = "#050505";
		ctx.fillRect(w/2, 0, w/2, h);
		
		// Grid on Right Side
		ctx.strokeStyle = "rgba(255, 157, 0, 0.05)";
		ctx.lineWidth = 1;
		for(let x = w/2; x < w; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
		for(let y = 0; y < h; y+=40) { ctx.beginPath(); ctx.moveTo(w/2,y); ctx.lineTo(w,y); ctx.stroke(); }

		// Divider Line
		ctx.strokeStyle = "#00f3ff";
		ctx.lineWidth = 2;
		ctx.beginPath(); ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); ctx.stroke();
	}

	// 3. Draw Gears (On top of everything)
	gears.forEach(gear => {
		gear.update();
		gear.draw();
	});

	requestAnimationFrame(animate);
}

animate();
