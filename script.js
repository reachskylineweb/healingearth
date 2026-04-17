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


    // --- SCROLL REVEAL ANIMATIONS (Why Choose Cards) ---
    const revealCards = () => {
        const cards = document.querySelectorAll('.why-card');
        const triggerBottom = window.innerHeight / 5 * 4;

        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerBottom) {
                card.classList.add('reveal');
            }
        });
    };

    window.addEventListener('scroll', revealCards);
    revealCards(); // Run once on load


    // --- FORM SUBMISSION (MOCK) ---
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        submitBtn.innerText = 'Sending Request...';
        submitBtn.disabled = true;

        // Simulate network delay
        setTimeout(() => {
            alert('Your consultation request has been submitted successfully! Our expert physicians will call you shortly.');
            form.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            closeModal();
        }, 1500);
    });

});
