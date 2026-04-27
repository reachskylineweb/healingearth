/* =========================================
   Healing Earth - Piles Landing Page
   Custom Interactivity Script
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- MODAL LOGIC ---
    const modal = document.getElementById('popupModal');
    const closeBtn = document.getElementById('closeModal');
    const triggers = document.querySelectorAll('.cta-trigger');

    // Open Modal
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal Function
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    // Close on Click Button
    closeBtn.addEventListener('click', closeModal);

    // Close on Background Overlay Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on ESC Key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });


    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-body').style.display = 'none';
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                item.querySelector('.faq-body').style.display = 'block';
            }
        });
    });


    // --- SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, {
        threshold: 0.15
    });

    const revealElements = document.querySelectorAll('.reveal, .why-card, .herbal-card, .therapy-card-box, .comfort-item, .specialist-image, .diet-item, .trust-card, .life-tip, .kshara-premium-card, .cause-text-card');
    revealElements.forEach(el => revealObserver.observe(el));


    // --- UNIVERSAL FORM SUBMISSION (EmailJS) ---
    // Rule 5: Targeting all forms on the page (popup, section, etc.)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Rule 4: Prevents page reload
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // Rule 3: Required field validation
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Rule 4: Visual feedback while sending
            submitBtn.innerText = 'Sending Request...';
            submitBtn.disabled = true;

            /* 
               Rule 1 & 6: EXACT FIELD MAPPING VERIFICATION
               The EmailJS sendForm method uses the 'name' attributes of input fields 
               as keys for the templateParams object. 
               
               Mapped Keys -> Template Variables:
               - name="full_name" -> {{full_name}}
               - name="phone"     -> {{phone}}
               - name="email"     -> {{email}}
               - name="condition" -> {{condition}}
               - name="message"   -> {{message}}
            */

            if (typeof emailjs !== 'undefined') {
                // Rule 3: Using Service ID and Template ID (template_dz6vjmn)
                emailjs.sendForm('service_ui7w1ja', 'template_dz6vjmn', form)
                    .then(() => {
                        // Rule 4: Success Handling
                        alert('Your consultation request has been submitted successfully! Our team will call you shortly.');
                        form.reset(); // Rule 4: Form reset after success
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        
                        // Close modal if triggered from popup
                        if(modal && modal.style.display === 'flex') closeModal();
                    }, (error) => {
                        // Rule 4: Failure Handling
                        console.error('EmailJS Error:', error);
                        alert('Submission failed. Reason: ' + (error.text || 'Unknown error') + '. Please try again or call us at +91 78999 03943.');
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                    });
            } else {
                console.error('EmailJS not loaded');
                alert('Form service is currently unavailable. Please call us directly at +91 78999 03943.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    });

    // --- VIDEO TICKER INTERACTION (Manual + Auto-Scroll) ---
    const videoGrid = document.querySelector('.video-grid');
    const videoCards = document.querySelectorAll('.video-card');
    
    let isAutoScrolling = true;
    let scrollSpeed = 0.8; 
    let isHovered = false;
    let startX;

    // Handle Playback Click
    videoCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent play if we were dragging
            if (this.dataset.dragging === 'true') {
                delete this.dataset.dragging;
                return;
            }

            const videoId = this.getAttribute('data-video-id');
            const wrapper = this.querySelector('.video-thumbnail-wrapper');
            
            if (videoId && wrapper) {
                // STOP auto-scroll permanently on click
                isAutoScrolling = false;

                wrapper.innerHTML = `
                    <div class="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                        </iframe>
                    </div>
                `;
                this.classList.add('is-playing');
            }
        });
    });

    // Auto-Scroll Loop
    function autoScroll() {
        if (isAutoScrolling && !isHovered) {
            videoGrid.scrollLeft += scrollSpeed;
            
            // Infinite Loop Logic
            const cardWidth = 280;
            const gap = 25;
            const loopThreshold = (cardWidth + gap) * 5;

            if (videoGrid.scrollLeft >= loopThreshold) {
                videoGrid.scrollLeft -= loopThreshold;
            }
        }
        requestAnimationFrame(autoScroll);
    }

    // Interaction Listeners for Pause-on-Hover
    videoGrid.addEventListener('mouseenter', () => isHovered = true);
    videoGrid.addEventListener('mouseleave', () => isHovered = false);
    
    // Manual Drag/Scroll Detection
    const handleDragStart = (e) => {
        isHovered = true;
        startX = (e.pageX || e.touches[0].pageX);
    };

    const handleDragMove = (e) => {
        if (!startX) return;
        const x = (e.pageX || e.touches[0].pageX);
        const walk = (x - startX); 
        
        // If moved more than 10px, it's a drag
        if (Math.abs(walk) > 10) {
            isAutoScrolling = false; // Stop auto-scroll permanently
            videoCards.forEach(card => card.dataset.dragging = 'true');
        }
    };

    const handleDragEnd = () => {
        isHovered = false;
        startX = null;
        setTimeout(() => {
            videoCards.forEach(card => delete card.dataset.dragging);
        }, 100);
    };

    videoGrid.addEventListener('mousedown', handleDragStart);
    videoGrid.addEventListener('touchstart', handleDragStart, {passive: true});
    
    window.addEventListener('mousemove', handleDragMove);
    videoGrid.addEventListener('touchmove', handleDragMove, {passive: true});
    
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);

    // Stop on mouse wheel as well
    videoGrid.addEventListener('wheel', () => {
        isAutoScrolling = false;
    }, {passive: true});

    // Start the loop
    autoScroll();

});
