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


    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = () => {
        const elements = document.querySelectorAll('.why-card, .root-cause-image, .root-cause-content, .herbal-card, .therapy-card-box, .comfort-item, .specialist-image, .diet-item, .trust-card, .life-tip, .kshara-premium-card');
        const triggerBottom = window.innerHeight / 5 * 4.5; // Slightly higher trigger for smoother reveal

        elements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('reveal');
                
                // Specific transitions if not already in CSS
                if(!el.classList.contains('why-card')) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            }
        });
    };

    window.addEventListener('scroll', revealElements);
    revealElements(); // Run once on load


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
                        alert('Your consultation request has been submitted successfully! Our expert physicians will call you shortly.');
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

});
