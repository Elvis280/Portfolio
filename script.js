import { animate, scroll, stagger } from "https://cdn.skypack.dev/motion";

document.addEventListener('DOMContentLoaded', () => {

    // LOAD AND RENDER JSON DATA
    let portfolioData = null;
    let currentSlide = 0;
    const projectsPerSlide = 3;

    async function loadPortfolioData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            portfolioData = data;

            renderProjects(data.projects);
            renderSkills(data.skills);
            renderExperience(data.experience);
            renderCertificates(data.certificates);

            // Initialize carousel after projects are rendered
            initializeCarousel(data.projects.length);
        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }

    function renderProjects(projects) {
        const container = document.getElementById('projects-container');
        if (!container || !projects) return;

        container.innerHTML = projects.map(project => `
            <div class="p-card">
                <div class="p-preview" style="${project.image && !project.image.includes('project-') ? `background: url('${project.image}') center/cover no-repeat;` : `background: linear-gradient(135deg, ${getProjectGradient(project.id)});`}">
                </div>
                <div class="p-content">
                    <div class="p-header">${project.name}</div>
                    <div class="p-body">${project.description}</div>
                    <div class="p-tech-stack">
                        ${project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                    <div class="p-links">
                        ${project.caseStudyPage ? `<a href="${project.caseStudyPage}" class="p-link case-study">Case Study →</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank" class="p-link demo">Live Demo →</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function initializeCarousel(totalProjects) {
        const track = document.getElementById('projects-container');
        const prevBtn = document.getElementById('projects-prev');
        const nextBtn = document.getElementById('projects-next');
        const dotsContainer = document.getElementById('carousel-dots');

        const totalSlides = Math.ceil(totalProjects / projectsPerSlide);

        // Create dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        // Navigation buttons
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        });

        // Initial position
        updateCarousel();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    function updateCarousel() {
        const track = document.getElementById('projects-container');
        const dots = document.querySelectorAll('.carousel-dot');

        // Calculate transform based on card width + gap
        const cardWidth = 320; // minmax(320px, 1fr)
        const gap = 30;
        const offset = currentSlide * projectsPerSlide * (cardWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function getProjectGradient(id) {
        const gradients = {
            'carbontwin': '#1B5E20, #4CAF50',
            'crud-flask': '#D84315, #FF6F00',
            'nexa-ai': '#6A1B9A, #AB47BC',
            'ecowaste': '#00695C, #26A69A',
            'agrowise': '#2E7D32, #66BB6A'
        };
        return gradients[id] || '#FF7D36, #00FFAA';
    }

    function renderSkills(skills) {
        const container = document.getElementById('skills-container');
        if (!container || !skills) return;

        container.innerHTML = skills.map(skill => {
            const techInfo = getTechInfo(skill);
            return `
                <div class="tech-card">
                    ${techInfo.hasIcon ?
                    `<img src="${techInfo.icon}" alt="${skill}" class="tech-card-logo"/>` :
                    `<div class="tech-card-placeholder">${skill.charAt(0)}</div>`
                }
                    <span class="tech-card-name">${skill}</span>
                </div>
            `;
        }).join('');
    }

    function getTechInfo(techName) {
        // Map technology names to Simple Icons slugs
        const iconMap = {
            // Programming Languages
            'python': 'python',
            'javascript': 'javascript',
            'typescript': 'typescript',

            // Frontend Frameworks
            'react': 'react',
            'next.js': 'nextdotjs',
            'html/css': 'html5',

            // Backend Frameworks
            'node.js': 'nodedotjs',
            'express.js': 'express',
            'fastapi': 'fastapi',
            'flask': 'flask',

            // Databases
            'mysql': 'mysql',
            'mongodb': 'mongodb',
            'postgresql': 'postgresql',

            // APIs & Tools
            'rest apis': 'postman',
            'graphql': 'graphql',
            'git': 'git',
            'github': 'github',
            'docker': 'docker',

            // Cloud Platforms
            'aws': 'amazonaws',
            'google cloud': 'googlecloud',
            'vercel': 'vercel',

            // AI/ML Technologies
            'tensorflow': 'tensorflow',
            'pytorch': 'pytorch',
            'langchain': 'langchain',
            'openai apis': 'openai',
            'gemini api': 'googlegemini',
            'ai agents': 'probot',
            'llm integration': 'openai',
            'machine learning': 'scikitlearn',

            // Computer Science Fundamentals
            'data structures': 'databricks',
            'algorithms': 'thealgorithms',

            // Design Tools (legacy, if needed)
            'figma': 'figma',
            'canva': 'canva',
            'adobe express': 'adobe'
        };

        const normalized = techName.toLowerCase();
        const slug = iconMap[normalized];

        if (slug) {
            return {
                hasIcon: true,
                icon: `https://cdn.simpleicons.org/${slug}`
            };
        }

        return {
            hasIcon: false,
            text: techName
        };
    }

    function renderExperience(experiences) {
        const container = document.getElementById('experience-container');
        if (!container || !experiences) return;

        container.innerHTML = experiences.map(exp => `
            <div class="exp-block ${exp.current ? 'current' : ''}">
                <h4>${exp.title} — ${exp.organization}</h4>
                <span class="exp-meta">${exp.period}</span>
                <p>${exp.description}</p>
                ${exp.detailsPage ? `<a href="${exp.detailsPage}" class="exp-details-btn">View Details →</a>` : ''}
            </div>
        `).join('');
    }

    // Certificate Carousel State
    let certCarousel = {
        currentSlide: 0,
        certsPerPage: 1,
        totalCerts: 0,
        certificates: []
    };

    function renderCertificates(certificates) {
        const container = document.getElementById('certificates-container');
        if (!container || !certificates) return;

        certCarousel.certificates = certificates;
        certCarousel.totalCerts = certificates.length;

        container.innerHTML = certificates.map(cert => `
            <div class="cert-card-glass">
                <div class="cert-header">
                    <div class="cert-status ${cert.verified ? 'verified' : 'pending'}">
                        <span class="status-dot"></span>
                        ${cert.verified ? 'VERIFIED' : 'PENDING'}
                    </div>
                    ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" class="cert-link-icon" title="View Credential">↗</a>` : ''}
                </div>
                
                <div class="cert-body">
                    <div class="cert-thumb">
                        ${cert.image ? `<img src="${cert.image}" alt="${cert.name}" loading="lazy">` : '<div class="cert-placeholder">📄</div>'}
                    </div>
                    
                    <div class="cert-info">
                        <h4>${cert.name}</h4>
                        <div class="cert-issuer">
                            <span class="data-label">ISSUER:</span> ${cert.issuer}
                        </div>
                         <div class="cert-date">
                            <span class="data-label">DATE:</span> ${cert.date}
                        </div>
                    </div>
                </div>

                <div class="cert-footer">
                    ${cert.skills ? `
                        <div class="cert-tags">
                            ${cert.skills.slice(0, 3).map(skill => `<span class="glass-tag">${skill}</span>`).join('')}
                            ${cert.skills.length > 3 ? `<span class="glass-tag">+${cert.skills.length - 3}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        initializeCertCarousel();
    }

    function initializeCertCarousel() {
        const totalPages = Math.ceil(certCarousel.totalCerts / certCarousel.certsPerPage);

        // Create dots
        const dotsContainer = document.getElementById('cert-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = Array(totalPages).fill(0).map((_, i) =>
                `<span class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></span>`
            ).join('');

            // Add click handlers to dots
            dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    goToCertSlide(parseInt(dot.dataset.slide));
                });
            });
        }

        // Add button listeners
        const prevBtn = document.querySelector('.cert-prev');
        const nextBtn = document.querySelector('.cert-next');

        if (prevBtn) prevBtn.addEventListener('click', () => certPrevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => certNextSlide());

        updateCertCarousel();
    }

    function goToCertSlide(slideIndex) {
        const totalPages = Math.ceil(certCarousel.totalCerts / certCarousel.certsPerPage);
        certCarousel.currentSlide = (slideIndex + totalPages) % totalPages;
        updateCertCarousel();
    }

    function certPrevSlide() {
        goToCertSlide(certCarousel.currentSlide - 1);
    }

    function certNextSlide() {
        goToCertSlide(certCarousel.currentSlide + 1);
    }

    function updateCertCarousel() {
        const container = document.getElementById('certificates-container');
        if (container) {
            // Get actual card width from DOM to support responsive sizes
            const card = container.querySelector('.cert-card-glass');
            const cardWidth = card ? card.offsetWidth : 800;
            const gap = 30; // Matches CSS gap

            const offset = -certCarousel.currentSlide * (cardWidth + gap);
            container.style.transform = `translateX(${offset}px)`;
        }

        // Update dots
        const dots = document.querySelectorAll('#cert-dots .carousel-dot');
        dots.forEach((dot, index) => {
            if (index === certCarousel.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update buttons state
        const prevBtn = document.querySelector('.cert-prev');
        const nextBtn = document.querySelector('.cert-next');

        if (prevBtn) {
            prevBtn.style.opacity = certCarousel.currentSlide === 0 ? '0.5' : '1';
            prevBtn.style.pointerEvents = certCarousel.currentSlide === 0 ? 'none' : 'auto';
        }

        if (nextBtn) {
            const maxSlide = Math.ceil(certCarousel.totalCerts / certCarousel.certsPerPage) - 1;
            nextBtn.style.opacity = certCarousel.currentSlide >= maxSlide ? '0.5' : '1';
            nextBtn.style.pointerEvents = certCarousel.currentSlide >= maxSlide ? 'none' : 'auto';
        }
    }

    // Call the loading function
    loadPortfolioData();

    const lensContainer = document.querySelector('.lens-container');
    const ringCount = 25;

    // 0. GENERATE THE NEURAL NETWORK
    for (let i = 0; i < ringCount; i++) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add('lens-ring');
        svg.setAttribute("viewBox", "0 0 100 100");

        const r = 35 + (i % 5) * 3;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "50");
        circle.setAttribute("cy", "50");
        circle.setAttribute("r", r);

        svg.appendChild(circle);

        if (i % 4 === 0) {
            svg.classList.add('impulse-ring');
        } else if (i % 3 === 0) {
            svg.classList.add('static-ring');
        } else if (i === ringCount - 1) {
            svg.classList.add('outer-shell');
        } else {
            svg.classList.add('neural-path');
        }

        svg.style.transform = `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`;

        lensContainer.appendChild(svg);
    }

    // const nucleus = document.createElement('div');
    // nucleus.classList.add('neural-nucleus');
    // lensContainer.appendChild(nucleus);


    // 1. SCROLL ANIMATION

    // A. Expansion of the Network 
    document.querySelectorAll('.lens-ring').forEach((ring, i) => {
        const zTarget = (i + 1) * 20; // Reduced depth (was 30)
        const scaleTarget = 1 + (i * 0.04); // Reduced scaling (was 0.1) - keeps it smaller

        scroll(
            animate(ring, {
                translateZ: [0, zTarget],
                scale: [0.1, scaleTarget],
                opacity: [0, Math.min(1, i / 5 + 0.2)]
            }, {
                easing: "linear"
            }),
            { target: document.body, offset: ["0 0", "0.3 0"] }
        );
    });

    // B. Nucleus Fade
    // scroll(
    //     animate('.neural-nucleus', {
    //         scale: [1, 0],
    //         opacity: [1, 0]
    //     }),
    //     { offset: ["0 0", "0.2 0"] }
    // );

    // C. Container Rotation
    scroll(
        animate('.lens-container', {
            rotateX: [0, 90],
            rotateY: [0, 360]
        }, {
            easing: "linear"
        })
    );

    // D. Initial UI Fade Out (keep this one - it works)
    scroll(
        animate('.main-title', { opacity: [1, 0] }),
        { offset: ["0 0", "0.2 0"] }
    );

    // E-I. MANUAL SECTION SCROLL ANIMATIONS
    // Define section ranges and animation functions
    const sections = {
        '.hero-section': { start: 0, fadeOut: 0.08, end: 0.12, direction: 'y', distance: -50 },
        '.projects-module': { start: 0.12, fadeIn: 0.17, fadeOut: 0.28, end: 0.33, direction: 'x', distance: 100 },
        '.skills-module': { start: 0.33, fadeIn: 0.38, fadeOut: 0.48, end: 0.53, direction: 'x', distance: -100 },
        '.experience-module': { start: 0.53, fadeIn: 0.58, fadeOut: 0.65, end: 0.70, direction: 'y', distance: 50 },
        '.certificates-module': { start: 0.70, fadeIn: 0.75, fadeOut: 0.82, end: 0.87, direction: 'y', distance: 50 },
        '.contact-module': { start: 0.87, fadeIn: 0.92, end: 1, direction: 'y', distance: 50 }
    };

    function updateSectionVisibility() {
        const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);

        Object.entries(sections).forEach(([selector, config]) => {
            const element = document.querySelector(selector);
            if (!element) return;

            let opacity = 0;
            let translateValue = config.distance;
            let scale = 0.95;

            // Hero section (starts visible, no fade in)
            if (selector === '.hero-section') {
                if (scrollProgress < config.fadeOut) {
                    opacity = 1;
                    translateValue = 0;
                    scale = 1;
                } else if (scrollProgress < config.end) {
                    opacity = 1 - ((scrollProgress - config.fadeOut) / (config.end - config.fadeOut));
                    translateValue = -config.distance * opacity;
                    scale = 1 + (1.02 - 1) * (1 - opacity);
                }
            }
            // Contact section (fades in, stays visible)
            else if (selector === '.contact-module') {
                if (scrollProgress < config.start) {
                    opacity = 0;
                } else if (scrollProgress < config.fadeIn) {
                    opacity = (scrollProgress - config.start) / (config.fadeIn - config.start);
                    translateValue = config.distance * (1 - opacity);
                    scale = 0.95 + (1 - 0.95) * opacity;
                } else {
                    opacity = 1;
                    translateValue = 0;
                    scale = 1;
                }
            }
            // All other sections (fade in, visible, fade out)
            else {
                if (scrollProgress < config.start) {
                    opacity = 0;
                } else if (scrollProgress < config.fadeIn) {
                    // Fade in
                    opacity = (scrollProgress - config.start) / (config.fadeIn - config.start);
                    translateValue = config.distance * (1 - opacity);
                    scale = 0.95 + (1 - 0.95) * opacity;
                } else if (scrollProgress < config.fadeOut) {
                    // Visible
                    opacity = 1;
                    translateValue = 0;
                    scale = 1;
                } else if (scrollProgress < config.end) {
                    // Fade out
                    opacity = 1 - ((scrollProgress - config.fadeOut) / (config.end - config.fadeOut));
                    translateValue = -config.distance * (1 - opacity);
                    scale = 1 + (1.02 - 1) * (1 - opacity);
                } else {
                    opacity = 0;
                }
            }

            // Apply styles
            element.style.opacity = opacity;
            element.style.transform = `translate${config.direction.toUpperCase()}(${translateValue}px) scale(${scale})`;
        });
    }

    // Add scroll listener
    window.addEventListener('scroll', updateSectionVisibility, { passive: true });
    // Initial call
    updateSectionVisibility();

    // J. ADD POINTER-EVENT CONTROL BASED ON OPACITY
    // Update pointer-events based on computed opacity (visibility is always on)
    function updateModuleInteractivity() {
        document.querySelectorAll('.module').forEach(module => {
            const computedOpacity = parseFloat(window.getComputedStyle(module).opacity);
            if (computedOpacity > 0.1) {
                module.style.pointerEvents = 'auto';
            } else {
                module.style.pointerEvents = 'none';
            }
        });
    }

    // Call on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            updateModuleInteractivity();
        });
    }, { passive: true });

    // Initial call
    updateModuleInteractivity();


    // 2. IDLE ANIMATIONS 
    document.querySelectorAll('.lens-ring').forEach((ring, i) => {
        const duration = 10 + Math.random() * 20;
        const dir = i % 2 === 0 ? 360 : -360;

        animate(ring,
            { rotateZ: dir },
            { duration: duration, repeat: Infinity, easing: "linear" }
        );
    });

    // animate('.neural-nucleus',
    //     { boxShadow: ['0 0 20px var(--accent-primary)', '0 0 50px var(--accent-secondary)'] },
    //     { duration: 2, direction: "alternate", repeat: Infinity }
    // );

    // 3. NAVIGATION HANDLER
    document.querySelectorAll('.top-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetRatio = parseFloat(e.target.dataset.target);
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

            window.scrollTo({
                top: maxScroll * targetRatio,
                behavior: 'smooth'
            });
        });
    });

});

// Mobile hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}
