let navbar = document.querySelector('.header .navbar');
document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.add('active');
}
document.querySelector('#nav-close').onclick = () =>{
    navbar.classList.remove('active');
}


//----------- Toggle Search Form Updated----------------//
const searchBtn = document.getElementById('search-btn');
const closeSearch = document.getElementById('close-search');
const searchForm = document.querySelector('.search-form');

searchBtn.addEventListener('click', () => {
    searchForm.classList.add('active');
});

closeSearch.addEventListener('click', () => {
    searchForm.classList.remove('active');
});

window.onscroll=()=>{
    navbar.classList.remove('active');
    if(window.scrollY>0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
};
window.onload=()=>{
    if(window.scrollY>0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
};


// back to top cta
const ctaTop = document.querySelector('#ctaTop');

// debounce helper to improve scroll performance
function debounce(fn, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

window.addEventListener("scroll", debounce(() => {
    if (window.scrollY > 300) {
        ctaTop.classList.add("show");
    } else {
        ctaTop.classList.remove("show");
    }
}, 100));

ctaTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

const EMAILJS_CONFIG = {
    service_id: 'service_xzxw80k', // replace with your real EmailJS service ID
    template_id: 'template_yibvcuc', // replace with your real EmailJS template ID
    user_id: 'RA6ZLSg9-1tQ706mH' // replace with your EmailJS public key / user ID
};

const EMAILJS_RECIPIENT_EMAIL = 'parmar360000@gmail.com'; // exact inbox address to receive contact form messages
const EMAILJS_FROM_NAME = 'Hetvi Travels Contact Form'; // visible sender name

if (EMAILJS_RECIPIENT_EMAIL !== 'parmar360000@gmail.com') {
    console.warn('EMAILJS_RECIPIENT_EMAIL is not set to the intended inbox address. Update js/script.js to use parmar360000@gmail.com');
}

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function setFormStatus(message, isError = false) {
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.style.color = isError ? '#b91c1c' : '#2f6f4f';
    }
}

function sendEmailJS(templateParams) {
    return fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            service_id: EMAILJS_CONFIG.service_id,
            template_id: EMAILJS_CONFIG.template_id,
            user_id: EMAILJS_CONFIG.user_id,
            template_params: templateParams
        })
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';
        }

        setFormStatus('Sending your message...');

        const userName = contactForm.querySelector('[name="name"]').value.trim();
        const userEmail = contactForm.querySelector('[name="email"]').value.trim();

        const templateParams = {
            from_name: EMAILJS_FROM_NAME,
            sender_name: userName,
            sender_email: userEmail,
            reply_to: userEmail,
            reply_to_name: userName,
            phone: contactForm.querySelector('[name="phone"]').value.trim(),
            subject: contactForm.querySelector('[name="subject"]').value.trim(),
            message: contactForm.querySelector('[name="message"]').value.trim(),
            to_email: EMAILJS_RECIPIENT_EMAIL
        };

        sendEmailJS(templateParams)
            .then(function(response) {
                if (!response.ok) {
                    return response.text().then(text => {
                        const message = text || 'EmailJS request failed';
                        throw new Error(response.status + ' ' + message);
                    });
                }
                setFormStatus('Message sent successfully!');
                contactForm.reset();
            })
            .catch(function(error) {
                const errorText = String(error.message || error);
                let displayMessage = 'Failed to send message. Please try again later.';

                if (errorText.includes('Invalid grant') || errorText.includes('Gmail_API')) {
                    displayMessage = 'Email service is not authorized. Reconnect your Gmail account in EmailJS dashboard.';
                } else if (errorText.includes('service_id') || errorText.includes('Service ID not found')) {
                    displayMessage = 'EmailJS service ID is invalid. Check your EmailJS service settings.';
                } else if (errorText.includes('Bad Request')) {
                    displayMessage = 'EmailJS request was malformed. Check your template and service IDs.';
                }

                setFormStatus(displayMessage, true);
                console.error('EmailJS send error:', errorText);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
    });
}


