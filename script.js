/* --- ADVANCED SYSTEM CONTROLLER (AUDIO/HAPTICS) --- */
class SystemController {
	constructor() {
		this.ctx = new (window.AudioContext || window.webkitAudioContext)();
		this.masterGain = this.ctx.createGain();
		this.masterGain.connect(this.ctx.destination);
		this.masterGain.gain.value = 0; 
		this.isMuted = true;
		this.canVibrate = !!navigator.vibrate;
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
		
		if (this.canVibrate) navigator.vibrate([20, 30]);
		return !this.isMuted;
	}

	playClick() {
		if (this.canVibrate) navigator.vibrate(10);
		if (this.isMuted) return;
		
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.connect(gain);
		gain.connect(this.masterGain);

		osc.type = 'sine';
		osc.frequency.setValueAtTime(800, t);
		osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
		gain.gain.setValueAtTime(0.3, t);
		gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

		osc.start(t);
		osc.stop(t + 0.05);
	}

	playHover() {
		if (this.isMuted) return;
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.connect(gain);
		gain.connect(this.masterGain);

		osc.type = 'triangle';
		osc.frequency.setValueAtTime(300, t);
		gain.gain.setValueAtTime(0.05, t);
		gain.gain.linearRampToValueAtTime(0, t + 0.05);

		osc.start(t);
		osc.stop(t + 0.05);
	}
}
const sys = new SystemController();

/* --- INTERACTION --- */
document.addEventListener('DOMContentLoaded', () => {
	// Sound Toggle
	const soundBtn = document.getElementById('sound-toggle');
	if (soundBtn) {
		soundBtn.addEventListener('click', () => {
			const isActive = sys.toggleMute();
			soundBtn.classList.toggle('active', isActive);
			const icon = soundBtn.querySelector('i');
			icon.className = isActive ? 'fas fa-volume-up' : 'fas fa-volume-mute';
			sys.playClick();
		});
	}

	// Global Interactive Elements
	document.querySelectorAll('a, button, input, textarea, .stat-card').forEach(el => {
		el.addEventListener('mouseenter', () => sys.playHover());
		el.addEventListener('click', () => sys.playClick());
	});

	// Mobile Menu
	const menuBtn = document.querySelector('.menu-btn');
	const navLinks = document.querySelector('.nav-links');
	const menuIcon = menuBtn.querySelector('i');

	menuBtn.addEventListener('click', () => {
		navLinks.classList.toggle('active');
		if (navigator.vibrate) navigator.vibrate(20);
		menuIcon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
	});
	
	document.querySelectorAll('.nav-links a').forEach(l => {
		l.addEventListener('click', () => {
			navLinks.classList.remove('active');
			menuIcon.className = 'fas fa-bars';
		});
	});
});

/* --- AUTOMATIC TEXT SCRAMBLE --- */
const scrambleTarget = document.getElementById('scramble-target');
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_10";

if (scrambleTarget) {
	const originalText = scrambleTarget.dataset.value;
	
	// Function to run a single scramble sequence
	const runScramble = () => {
		let iteration = 0;
		const interval = setInterval(() => {
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

	// Run immediately on load
	runScramble();
	
	// Run repeatedly every 4 seconds (Automatic Effect)
	setInterval(runScramble, 4000);
}

/* --- TYPEWRITER --- */
const typeText = document.querySelector('.typing-text');
const roles = ["MECHANICAL ENGINEER", "CYBER SECURITY ANALYST", "CAD DESIGNER", "PENETRATION TESTER"];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
	const currentRole = roles[roleIndex];
	const displayed = currentRole.substring(0, charIndex);
	typeText.textContent = displayed;

	let speed = 80;
	if (isDeleting) speed = 30;

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


/* --- HIGH-FIDELITY CANVAS ENGINE --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h, dpr;

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

// --- MATRIX ENGINE ---
const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEF';
const fontSize = 14;
let columns;
let drops = [];

class Drop {
	constructor(x) {
		this.x = x;
		this.y = Math.random() * -100;
		this.speed = Math.random() * 3 + 1;
		this.text = '';
	}

	draw() {
		if (Math.random() < 0.1) {
			this.text = katakana.charAt(Math.floor(Math.random() * katakana.length));
		}

		ctx.shadowBlur = 0;
		ctx.fillStyle = "rgba(0, 243, 255, 0.25)"; 
		ctx.font = fontSize + "px 'JetBrains Mono'";
		ctx.fillText(this.text, this.x, this.y);

		ctx.fillStyle = "#fff"; 
		ctx.fillText(this.text, this.x, this.y + fontSize);

		this.y += this.speed;

		if (this.y > h && Math.random() > 0.98) {
			this.y = -fontSize;
			this.speed = Math.random() * 3 + 1;
		}
	}
}

function initMatrix() {
	columns = Math.floor(w / fontSize);
	drops = [];
	for (let i = 0; i < columns; i++) {
		let d = new Drop(i * fontSize);
		d.y = Math.random() * h;
		drops.push(d);
	}
}

// --- GEAR ENGINE ---
let scrollY = 0;
let targetScrollY = 0;

window.addEventListener('scroll', () => {
	targetScrollY = window.scrollY;
});

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
		ctx.fillStyle = "rgba(5, 5, 5, 0.8)"; 

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

		ctx.beginPath(); ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2); ctx.stroke();
		ctx.beginPath(); ctx.arc(0, 0, holeRadius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill();
		ctx.beginPath(); ctx.moveTo(-innerRadius, 0); ctx.lineTo(innerRadius, 0); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(0, -innerRadius); ctx.lineTo(0, innerRadius); ctx.stroke();

		ctx.restore();
		
		this.baseAngle += 0.002 * this.speedMult;
	}
}

let gears = [];
function initGears() {
	gears = [];
	const isMobile = w < 768;
	
	if (isMobile) {
		gears.push(new Gear(w * 0.9, h * 0.85, 60, 16, 1, "rgba(255, 157, 0, 0.3)"));
		gears.push(new Gear(w * 0.9 - 85, h * 0.85 - 50, 30, 12, -1.5, "rgba(0, 243, 255, 0.3)"));
	} else {
		const cx = w * 0.8;
		const cy = h * 0.5;
		gears.push(new Gear(cx, cy + 100, 100, 32, 1, "rgba(255, 157, 0, 0.4)"));
		gears.push(new Gear(cx + 150, cy - 20, 60, 20, -1.6, "rgba(0, 243, 255, 0.4)"));
		gears.push(new Gear(cx - 120, cy + 20, 40, 12, -2.5, "rgba(255, 157, 0, 0.4)"));
	}
}

// --- MASTER LOOP ---
resize();

function animate() {
	ctx.fillStyle = "rgba(3, 3, 3, 0.1)";
	ctx.fillRect(0, 0, w, h);

	drops.forEach(d => d.draw());

	scrollY += (targetScrollY - scrollY) * 0.1;
	gears.forEach(g => g.draw(scrollY));

	requestAnimationFrame(animate);
}
animate();