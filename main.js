
// In a file environment the import/export mechanism for ES modules can fail due
// to cross‑origin restrictions. Instead of importing from data.js we rely on
// global variables defined on the window object. See data.js where
// `window.services` and `window.team` are assigned.

// Pull the globally defined services and team arrays from the window object. If
// they are not present, default to empty arrays to prevent runtime errors.
const services = window.services || [];
const team = window.team || [];

document.addEventListener('DOMContentLoaded', () => {
    initLucide();
    initUI();
    initReadMore();
    initAnimations();
    handleNavbar();
});

function initLucide() {
    lucide.createIcons();
}

function initUI() {
    const servicesGrid = document.getElementById('services-grid');
    services.forEach(service => {
        // Skip the training entry because it is rendered in its own section
        if (service.title && service.title.toLowerCase().includes('training')) return;
        const card = document.createElement('div');
        // Card styling includes a hover effect on the icon and reveal animation
        card.className = 'service-card bg-white p-10 border border-slate-100 group reveal-up';
        // Build the HTML for the service card. Always include a summary; if a full
        // description exists, include a hidden container and a learn more button.
        let inner = `
            <div class="service-icon text-navy/20 mb-6 transition-all duration-500">
                <i data-lucide="${service.icon}" class="w-12 h-12"></i>
            </div>
            <h3 class="text-2xl font-serif text-navy mb-4 group-hover:text-gold transition-colors">${service.title}</h3>
            <p class="text-slate-500 leading-relaxed summary">${service.summary}</p>
        `;
        if (service.full) {
            inner += `
                <div class="full hidden text-slate-500 leading-relaxed mt-4 whitespace-pre-line">${service.full}</div>
                <button class="learn-more text-gold underline mt-4">Learn more</button>
            `;
        }
        card.innerHTML = inner;
        servicesGrid.appendChild(card);
    });

    // Render training cards dynamically into the training grid. These cards mirror
    // the style of the service cards, providing an icon, title, summary and a
    // toggleable full description. The data is stored on the window.trainings
    // array defined in data.js.
    const trainingGrid = document.getElementById('training-grid');
    if (trainingGrid && window.trainings) {
        window.trainings.forEach(training => {
            const card = document.createElement('div');
            card.className = 'service-card bg-white p-10 border border-slate-100 group reveal-up';
            let inner = `
                <div class="service-icon text-navy/20 mb-6 transition-all duration-500">
                    <i data-lucide="${training.icon}" class="w-12 h-12"></i>
                </div>
                <h3 class="text-2xl font-serif text-navy mb-4 group-hover:text-gold transition-colors">${training.title}</h3>
                <p class="text-slate-500 leading-relaxed summary">${training.summary}</p>
            `;
            if (training.full) {
                inner += `
                    <div class="full hidden text-slate-500 leading-relaxed mt-4 whitespace-pre-line">${training.full}</div>
                    <button class="learn-more text-gold underline mt-4">Learn more</button>
                `;
            }
            card.innerHTML = inner;
            trainingGrid.appendChild(card);
        });
    }

    const teamGrid = document.getElementById('team-grid');
    // Only render dynamic team cards if a container exists (used in older layouts)
    if (teamGrid) {
        team.forEach(t => {
            const card = document.createElement('div');
            card.className = 'team-card group reveal-up';
            card.innerHTML = `
                <div class="relative overflow-hidden mb-6 aspect-[3/4]">
                    <img src="${t.image}" alt="${t.name}" class="team-portrait w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 class="text-2xl font-serif text-white mb-2">${t.name}</h3>
                <p class="text-gold uppercase tracking-widest text-xs mb-4">${t.role}</p>
                <p class="text-white/60 text-sm leading-relaxed">${t.bio}</p>
            `;
            teamGrid.appendChild(card);
        });
    }


    lucide.createIcons();
}

// Initialise the “learn more” interactions for the About section and each team profile.
function initReadMore() {
    // Toggle additional text in the About section
    const aboutBtn = document.getElementById('about-learn-more');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => {
            const more = document.getElementById('about-more');
            if (!more) return;
            const isHidden = more.classList.contains('hidden');
            more.classList.toggle('hidden');
            // Update button text accordingly
            aboutBtn.textContent = isHidden ? 'Read less' : 'Learn more';
        });
    }
    // Set up toggles for each team member’s detailed bio
    const profiles = document.querySelectorAll('#team-container .team-profile');
    profiles.forEach(profile => {
        const btn = profile.querySelector('.learn-more');
        const summary = profile.querySelector('.summary');
        const details = profile.querySelector('.details');
        if (btn && summary && details) {
            btn.addEventListener('click', () => {
                const isHidden = details.classList.contains('hidden');
                details.classList.toggle('hidden');
                summary.classList.toggle('hidden');
                btn.textContent = isHidden ? 'Read less' : 'Learn more';
            });
        }
    });

    // Set up toggles for service cards with extended descriptions
    const serviceButtons = document.querySelectorAll('.service-learn-more');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.service-card');
            if (!card) return;
            const full = card.querySelector('.full');
            const summary = card.querySelector('.summary');
            if (!full || !summary) return;
            const isHidden = full.classList.contains('hidden');
            full.classList.toggle('hidden');
            summary.classList.toggle('hidden');
            btn.textContent = isHidden ? 'Read less' : 'Learn more';
        });
    });

    // Set up toggles for each service card. Each service card may have a summary,
    // a hidden full description and a learn‑more button. When the button is
    // clicked, toggle the visibility of summary and full text and update the
    // button label.
    // Select both service and training cards for toggling their extended descriptions
    const serviceCards = document.querySelectorAll('#services-grid .service-card, #training-grid .service-card');
    serviceCards.forEach(card => {
        const btn = card.querySelector('.learn-more');
        const summary = card.querySelector('.summary');
        const full = card.querySelector('.full');
        if (btn && summary && full) {
            btn.addEventListener('click', () => {
                const isHidden = full.classList.contains('hidden');
                full.classList.toggle('hidden');
                summary.classList.toggle('hidden');
                btn.textContent = isHidden ? 'Read less' : 'Learn more';
            });
        }
    });
}

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);


    const heroTl = gsap.timeline();
    heroTl.to('.hero-reveal', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out'
    });


    gsap.to('#hero-bg', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        scale: 1.2
    });


    const reveals = document.querySelectorAll('.reveal-up');
    reveals.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        });
    });
}

function handleNavbar() {
    const nav = document.getElementById('navbar');
    const logoText = document.getElementById('logo-text');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            logoText.classList.remove('text-white');
            logoText.classList.add('text-gold');
            navLinks.classList.remove('text-white/80');
            navLinks.classList.add('text-white');
        } else {
            nav.classList.remove('scrolled');
            logoText.classList.remove('text-gold');
            logoText.classList.add('text-white');
            navLinks.classList.remove('text-white');
            navLinks.classList.add('text-white/80');
        }
    });
}
