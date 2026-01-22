// Toggle Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const menuIcon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', () => {
	navLinks.classList.toggle('active');
	
	// Switch icon between hamburger and X
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
const words = ["Mechanical Engineer", "Cyber Security Consultant", "Geometry Geek", "Drone Pilot", "Bug Whisperer", "Night-Shift Coder", "AutoCAD Assassin", "SolidWorks Samurai", "Cinephile" ];
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