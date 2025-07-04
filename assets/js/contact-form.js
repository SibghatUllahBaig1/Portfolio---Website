/**
 * Contact Form Handler
 * Handles form submission with AJAX and provides user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.querySelector('#contact-form input[type="submit"]');
    const originalButtonText = submitButton.value;

    // Add event listener to form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Validate form before sending
        if (!validateForm(formData)) {
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Send form data via AJAX
        fetch('send-email.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoadingState();
            
            if (data.success) {
                showSuccessMessage(data.message);
                contactForm.reset(); // Clear form
            } else {
                showErrorMessage(data.message);
            }
        })
        .catch(error => {
            hideLoadingState();
            console.error('Error:', error);
            showErrorMessage('An unexpected error occurred. Please try again later.');
        });
    });

    /**
     * Validate form data
     */
    function validateForm(formData) {
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        // Clear previous error messages
        clearErrorMessages();
        
        let isValid = true;
        
        // Validate name
        if (!name) {
            showFieldError('name', 'Name is required');
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!message) {
            showFieldError('message', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showFieldError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        return isValid;
    }

    /**
     * Check if email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show loading state
     */
    function showLoadingState() {
        submitButton.disabled = true;
        submitButton.value = 'Sending...';
        submitButton.style.opacity = '0.7';
    }

    /**
     * Hide loading state
     */
    function hideLoadingState() {
        submitButton.disabled = false;
        submitButton.value = originalButtonText;
        submitButton.style.opacity = '1';
    }

    /**
     * Show success message
     */
    function showSuccessMessage(message) {
        const messageDiv = createMessageDiv(message, 'success');
        insertMessageDiv(messageDiv);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    /**
     * Show error message
     */
    function showErrorMessage(message) {
        const messageDiv = createMessageDiv(message, 'error');
        insertMessageDiv(messageDiv);
        
        // Auto-hide after 7 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 7000);
    }

    /**
     * Create message div
     */
    function createMessageDiv(message, type) {
        const div = document.createElement('div');
        div.className = `form-message form-message-${type}`;
        div.innerHTML = `
            <p>${message}</p>
            <button type="button" class="close-message" onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add styles
        div.style.cssText = `
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 5px;
            position: relative;
            font-weight: 500;
            ${type === 'success' ? 
                'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        // Style close button
        const closeBtn = div.querySelector('.close-message');
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
        `;
        
        return div;
    }

    /**
     * Insert message div into DOM
     */
    function insertMessageDiv(messageDiv) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Insert new message before the form
        contactForm.parentNode.insertBefore(messageDiv, contactForm);
    }

    /**
     * Show field-specific error
     */
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.style.borderColor = '#dc3545';
            
            // Create error message element
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #dc3545;
                font-size: 0.875em;
                margin-top: 5px;
                margin-bottom: 10px;
            `;
            
            // Insert after the field
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
    }

    /**
     * Clear all error messages
     */
    function clearErrorMessages() {
        // Remove field errors
        const fieldErrors = document.querySelectorAll('.field-error');
        fieldErrors.forEach(error => error.remove());
        
        // Reset field border colors
        const fields = ['name', 'email', 'message'];
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.style.borderColor = '';
            }
        });
    }
});

/**
 * Toggle Read More functionality for project descriptions
 */
function toggleReadMore(button) {
    const workItem = button.closest('.work-item');
    const description = workItem.querySelector('.project-description');

    if (description.classList.contains('expanded')) {
        // Collapse
        description.classList.remove('expanded');
        workItem.classList.remove('expanded');
        button.textContent = 'Read More';

        // Smooth transition back to fixed height
        setTimeout(() => {
            workItem.style.height = '350px';
        }, 10);
    } else {
        // Expand
        description.classList.add('expanded');
        workItem.classList.add('expanded');
        button.textContent = 'Read Less';

        // Calculate and set the new height
        const currentHeight = workItem.offsetHeight;
        workItem.style.height = 'auto';
        const newHeight = workItem.offsetHeight;
        workItem.style.height = currentHeight + 'px';

        // Animate to new height
        setTimeout(() => {
            workItem.style.height = newHeight + 'px';
        }, 10);
    }
}
