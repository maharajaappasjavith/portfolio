/* --- BOOT SEQUENCE & INITIALIZATION --- */
const bootText = [
	"INITIALIZING KERNEL...",
	"LOADING MODULES: [MECHANICAL_ENG] [CYBER_SEC]...",
	"CHECKING INTEGRITY... OK",
	"ESTABLISHING SECURE CONNECTION...",
	"MOUNTING FILE SYSTEM...",
	"ACCESS GRANTED."
];

const runBootSequence = () => {
	const screen = document.getElementById('boot-screen');
	const textContainer = document.getElementById('boot-text');
	const bar = document.getElementById('boot-progress');
	let i = 0;
	
	if(!screen) return;

	const addLine = () => {
		if (i < bootText.length) {
			textContainer.innerHTML += `> ${bootText[i]}<br>`;
			bar.style.width = `${((i + 1) / bootText.length) * 100}%`;
			i++;
			setTimeout(addLine, 300); // Speed of text
		} else {
			setTimeout(() => {
				screen.style.opacity = '0';
				screen.style.transition = 'opacity 0.8s ease';
				setTimeout(() => screen.remove(), 800);
			}, 500);
		}
	};
	
	addLine();
};

document.addEventListener('DOMContentLoaded', runBootSequence);

/* --- ADVANCED SYSTEM CONTROLLER (AUDIO/HAPTICS) --- */
class SystemController {
	constructor() {
		this.ctx = new (window.AudioContext || window.webkitAudioContext)();
		this.masterGain = this.ctx.createGain();
		this.masterGain.connect(this.ctx.destination);
		this.masterGain.gain.value = 0; 
		this.isMuted = true;
	}

	toggleMute() {
		if (this.ctx.state === 'suspended') this.ctx.resume();
		this.isMuted = !this.isMuted;
		
		const now = this.ctx.currentTime;
		this.masterGain.gain.cancelScheduledValues(now);
		this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
		
		if (this.isMuted) {
			this.masterGain.gain.linearRampToValueAtTime(0, now + 0.1);
		} else {
			this.masterGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
		}
		
		return !this.isMuted;
	}

	playTone(freq, type, duration) {
		if (this.isMuted) return;
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.connect(gain);
		gain.connect(this.masterGain);

		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		gain.gain.setValueAtTime(0.1, t);
		gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

		osc.start(t);
		osc.stop(t + duration);
	}

	playClick() { this.playTone(1200, 'sine', 0.1); }
	playHover() { this.playTone(400, 'triangle', 0.05); }
}
const sys = new SystemController();

/* --- INTERACTION HANDLERS --- */
document.addEventListener('DOMContentLoaded', () => {
	// Sound Toggle
	const soundBtn = document.getElementById('sound-toggle');
	if (soundBtn) {
		soundBtn.addEventListener('click', () => {
			const isActive = sys.toggleMute();
			soundBtn.classList.toggle('active', isActive);
			soundBtn.querySelector('i').className = isActive ? 'fas fa-volume-up' : 'fas fa-volume-mute';
			sys.playClick();
		});
	}

	// Menu Toggle
	const menuBtn = document.querySelector('.menu-btn');
	const navLinks = document.querySelector('.nav-links');
	const menuIcon = menuBtn.querySelector('i');

	menuBtn.addEventListener('click', () => {
		navLinks.classList.toggle('active');
		menuIcon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
		sys.playClick();
	});

	document.querySelectorAll('.nav-links a').forEach(l => {
		l.addEventListener('click', () => {
			navLinks.classList.remove('active');
			menuIcon.className = 'fas fa-bars';
			sys.playClick();
		});
	});

	// Sound Effects on Interactive Elements
	document.querySelectorAll('a, button, input, textarea, .stat-card').forEach(el => {
		el.addEventListener('mouseenter', () => sys.playHover());
		el.addEventListener('click', () => sys.playClick());
	});
});

/* --- SCRAMBLE TEXT EFFECT --- */
const scrambleTarget = document.getElementById('scramble-target');
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_10!@#$%^&*";

if (scrambleTarget) {
	const originalText = scrambleTarget.dataset.value;
	let interval = null;

	const runScramble = () => {
		let iteration = 0;
		clearInterval(interval);
		interval = setInterval(() => {
			scrambleTarget.innerText = originalText
				.split("")
				.map((letter, index) => {
					if(index < iteration) return originalText[index];
					return letters[Math.floor(Math.random() * letters.length)];
				})
				.join("");
			
			if(iteration >= originalText.length) clearInterval(interval);
			iteration += 1 / 3;
		}, 30);
	};
	
	runScramble();
	setInterval(runScramble, 5000);
}

/* --- TYPEWRITER EFFECT --- */
const typeText = document.querySelector('.typing-text');
const roles = ["MECHANICAL ENGINEER", "CYBER SECURITY ANALYST", "CAD DESIGNER", "ETHICAL HACKER"];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
	const currentRole = roles[roleIndex];
	const displayed = currentRole.substring(0, charIndex);
	typeText.textContent = displayed;

	let speed = 80;
	if (isDeleting) speed = 40;

	if (!isDeleting && charIndex < currentRole.length) {
		charIndex++;
	} else if (isDeleting && charIndex > 0) {
		charIndex--;
	} else {
		isDeleting = !isDeleting;
		speed = isDeleting ? 2000 : 500;
		if (!isDeleting) roleIndex = (roleIndex + 1) % roles.length;
	}
	setTimeout(typeLoop, speed);
}
document.addEventListener('DOMContentLoaded', typeLoop);

/* --- HYBRID CANVAS ENGINE (MATRIX + GEARS) --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h, dpr;

// Scroll Physics for Gears
let scrollY = 0;
let targetScrollY = 0;
window.addEventListener('scroll', () => {
	targetScrollY = window.scrollY;
});

function resize() {
	dpr = window.devicePixelRatio || 1;
	w = window.innerWidth;
	h = window.innerHeight;
	canvas.width = w * dpr;
	canvas.height = h * dpr;
	ctx.scale(dpr, dpr);
	initMatrix();
	initGears();
}
window.addEventListener('resize', resize);

// --- 1. MATRIX ENGINE ---
const katakana = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
const fontSize = 14;
let columns;
let drops = [];

function initMatrix() {
	columns = Math.floor(w / fontSize);
	drops = [];
	for (let i = 0; i < columns; i++) {
		drops[i] = Math.random() * -100; 
	}
}

function drawMatrix() {
	// We do NOT clearRect here because we want the matrix trails. 
	// Instead we draw a semi-transparent black rect over everything.
	ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
	ctx.fillRect(0, 0, w, h);
	
	ctx.font = fontSize + 'px monospace';
	
	for (let i = 0; i < drops.length; i++) {
		const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
		
		// Random coloring
		if(Math.random() > 0.98) ctx.fillStyle = '#FFF';
		else if(Math.random() > 0.95) ctx.fillStyle = '#00F3FF'; 
		else ctx.fillStyle = 'rgba(0, 243, 255, 0.2)'; // Faint Cyan

		ctx.fillText(text, i * fontSize, drops[i] * fontSize);
		
		if (drops[i] * fontSize > h && Math.random() > 0.975) {
			drops[i] = 0;
		}
		drops[i]++;
	}
}

// --- 2. GEAR ENGINE ---
class Gear {
	constructor(x, y, radius, teeth, speedMult, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.teeth = teeth;
		this.baseAngle = 0;
		this.speedMult = speedMult;
		this.color = color;
	}

	draw(currentScroll) {
		const rotation = this.baseAngle + (currentScroll * 0.005 * this.speedMult);
		
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(rotation);
		
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		ctx.fillStyle = "rgba(5, 5, 5, 0.9)"; // Dark center to block matrix behind it

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
			const x3 = Math.cos(a + ta) * innerRadius;
			const y3 = Math.sin(a + ta) * innerRadius;

			if (i === 0) ctx.moveTo(x1, y1);
			else ctx.lineTo(x1, y1);
			
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.arc(0, 0, innerRadius, a + ta, a + (Math.PI * 2) / this.teeth);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// Inner Details
		ctx.beginPath(); ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2); ctx.stroke();
		ctx.beginPath(); ctx.arc(0, 0, holeRadius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill();
		
		// Spokes
		ctx.beginPath(); ctx.moveTo(-innerRadius, 0); ctx.lineTo(innerRadius, 0); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(0, -innerRadius); ctx.lineTo(0, innerRadius); ctx.stroke();

		ctx.restore();
		
		// Auto rotate slowly, plus scroll speed
		this.baseAngle += 0.002 * this.speedMult;
	}
}

let gears = [];
function initGears() {
	gears = [];
	const isMobile = w < 768;
	
	if (isMobile) {
		// Mobile Placement: Bottom right, subtle
		gears.push(new Gear(w * 0.85, h * 0.9, 50, 16, 1, "rgba(255, 157, 0, 0.5)"));
		gears.push(new Gear(w * 0.85 - 70, h * 0.9 - 40, 25, 12, -1.5, "rgba(0, 243, 255, 0.5)"));
	} else {
		// Desktop Placement: Right side, large mechanical backdrop
		const cx = w * 0.85;
		const cy = h * 0.5;
		gears.push(new Gear(cx, cy + 100, 100, 32, 1, "rgba(255, 157, 0, 0.3)"));
		gears.push(new Gear(cx + 150, cy - 20, 60, 20, -1.6, "rgba(0, 243, 255, 0.3)"));
		gears.push(new Gear(cx - 120, cy + 20, 40, 12, -2.5, "rgba(255, 157, 0, 0.3)"));
	}
}

// --- MASTER ANIMATION LOOP ---
resize();

function animate() {
	// 1. Draw Matrix Rain (Background)
	drawMatrix();

	// 2. Physics: Smooth Scroll Interpolation
	scrollY += (targetScrollY - scrollY) * 0.1;

	// 3. Draw Gears (Foreground of canvas)
	gears.forEach(g => g.draw(scrollY));

	requestAnimationFrame(animate);
}
animate();