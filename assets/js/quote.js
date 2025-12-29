        emailjs.init('dKBLEA2E9qbiFUgNl');
        
        // Pricing Structure
        const pricing = {
            serviceTypes: {
                standard: { base: 120, perBedroom: 20, perBathroom: 20, name: 'Standard Cleaning' },
                deep: { base: 170, perBedroom: 35, perBathroom: 35, name: 'Deep Cleaning' },
                moveInOut: { base: 150, perBedroom: 35, perBathroom: 35, name: 'Move-in/Move-out' },
               //  office: { base: 150, perBedroom: 25, perBathroom: 20, name: 'Office Cleaning' }
            },
            frequencyDiscounts: {
                oneTime: { discount: 0, name: 'One-time' },
                weekly: { discount: 0.20, name: 'Weekly' },
                biweekly: { discount: 0.15, name: 'Bi-weekly' },
                monthly: { discount: 0.10, name: 'Monthly' }
            }
        };

        let currentPage = 1;
        let calculatedQuote = 0;

        // Calculate Quote
        function calculateQuote() {
            const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
            const bedrooms = parseInt(document.getElementById('bedrooms').value) || 0;
            const bathrooms = parseFloat(document.getElementById('bathrooms').value) || 0;
            const frequency = document.querySelector('input[name="frequency"]:checked').value;
            
            if (!bedrooms || !bathrooms) {
                document.getElementById('quoteAmount').textContent = '$0';
                document.getElementById('quoteDetails').textContent = 'Complete property details to calculate';
                return 0;
            }

            const servicePrice = pricing.serviceTypes[serviceType];
            let total = servicePrice.base + 
                       (bedrooms * servicePrice.perBedroom) + 
                       (bathrooms * servicePrice.perBathroom);

            const sqft = parseInt(document.getElementById('sqft').value) || 0;
            if (sqft > 2000) {
                total += (sqft - 2000) * 0.07;
            }

            const addons = document.querySelectorAll('.checkbox-option input[type="checkbox"]:checked');
            let addonTotal = 0;
            addons.forEach(addon => {
                addonTotal += parseInt(addon.value);
            });
            total += addonTotal;

            const discount = pricing.frequencyDiscounts[frequency].discount;
            const discountAmount = total * discount;
            total -= discountAmount;

            calculatedQuote = Math.round(total);

            document.getElementById('quoteAmount').textContent = `${calculatedQuote}`;
            
            let details = '';
            if (discount > 0) {
                details = `Includes ${Math.round(discount * 100)}% recurring service discount | `;
            }
            details += `${bedrooms} bed, ${bathrooms} bath`;
            if (addonTotal > 0) {
                details += ` | +${addonTotal} in add-ons`;
            }
            
            document.getElementById('quoteDetails').textContent = details;

            return calculatedQuote;
        }

        // Update Summary on Page 3
        function updateSummary() {
            const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
            const bedrooms = parseInt(document.getElementById('bedrooms').value) || 0;
            const bathrooms = parseFloat(document.getElementById('bathrooms').value) || 0;
            const frequency = document.querySelector('input[name="frequency"]:checked').value;
            const addons = Array.from(document.querySelectorAll('.checkbox-option input[type="checkbox"]:checked'));

            document.getElementById('summaryService').textContent = pricing.serviceTypes[serviceType].name;
            document.getElementById('summaryProperty').textContent = `${bedrooms} Bedroom${bedrooms !== 1 ? 's' : ''}, ${bathrooms} Bathroom${bathrooms !== 1 ? 's' : ''}`;
            document.getElementById('summaryFrequency').textContent = pricing.frequencyDiscounts[frequency].name;
            
            if (addons.length > 0) {
                const addonNames = addons.map(a => a.parentElement.querySelector('label').textContent.split('(')[0].trim());
                document.getElementById('summaryAddons').textContent = addonNames.join(', ');
                document.getElementById('summaryAddonsRow').style.display = 'flex';
            } else {
                document.getElementById('summaryAddonsRow').style.display = 'none';
            }

            document.getElementById('summaryTotal').textContent = `${calculatedQuote}`;
        }

        // Validate Page 1
        function validatePage1() {
            const bedrooms = document.getElementById('bedrooms').value;
            const bathrooms = document.getElementById('bathrooms').value;

            if (!bedrooms || !bathrooms) {
                document.getElementById('page1Error').classList.add('show');
                return false;
            }

            document.getElementById('page1Error').classList.remove('show');
            return true;
        }

        // Navigate to Page
         function navigateToPage(targetPage) {
         document.getElementById(`page${currentPage}`).classList.remove('active');
         document.getElementById(`page${targetPage}`).classList.add('active');

         currentPage = targetPage;
         updateProgressIndicator();
         }


        // Update Progress Indicator
        function updateProgressIndicator() {
            for (let i = 1; i <= 3; i++) {
                const stepEl = document.getElementById(`step${i}Indicator`);
                if (i < currentPage) {
                    stepEl.classList.add('completed');
                    stepEl.classList.remove('active');
                } else if (i === currentPage) {
                    stepEl.classList.add('active');
                    stepEl.classList.remove('completed');
                } else {
                    stepEl.classList.remove('active', 'completed');
                }
            }

            const progressPercentage = ((currentPage - 1) / 2) * 100;
            document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        }

        // Page Navigation
        document.getElementById('page1NextBtn').addEventListener('click', function() {
            if (!validatePage1()) return;
            calculateQuote();
            navigateToPage(2);
        });

        document.getElementById('page2BackBtn').addEventListener('click', function() {
            navigateToPage(1);
        });

        document.getElementById('page2NextBtn').addEventListener('click', function() {
            calculateQuote();
            updateSummary();
            navigateToPage(3);
        });

        document.getElementById('page3BackBtn').addEventListener('click', function() {
            navigateToPage(2);
        });

        // Event Listeners for real-time calculation
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(element => {
            element.addEventListener('change', function() {
                if (currentPage === 2) {
                    calculateQuote();
                }
            });
        });

        // Form Submission
        document.getElementById('quoteForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            hearAbout: document.getElementById('hearAbout').value,
            serviceType: pricing.serviceTypes[
            document.querySelector('input[name="serviceType"]:checked').value
            ].name,
            bedrooms: document.getElementById('bedrooms').value,
            bathrooms: document.getElementById('bathrooms').value,
            sqft: document.getElementById('sqft').value || 'N/A',
            frequency: pricing.frequencyDiscounts[
            document.querySelector('input[name="frequency"]:checked').value
            ].name,
            addons: Array.from(document.querySelectorAll('.checkbox-option input:checked'))
            .map(cb => cb.parentElement.textContent.trim())
            .join(', ') || 'None',
            notes: document.getElementById('notes').value || 'None',
            quote: calculatedQuote
        };

        //CUSTOMER AUTO REPLY
        emailjs.send(
            'service_p7540ga',
            'template_j48mqct',
            formData
        )

        //ADMIN QUOTE NOTIFICATION
        .then(() => {
        return emailjs.send(
            'service_p7540ga',
            'template_g79ovtp',
            formData
        );
        })
        
        .then(() => {

            // Save for thank-you page
            sessionStorage.setItem('quoteData', JSON.stringify(formData));

            // Redirect
            window.location.href = '/thank-you.html';

        }).catch(error => {
            console.error('EmailJS error:', error);
            alert('Something went wrong sending your quote. Please try again.');
        });
        });




         function resetForm() {
         document.getElementById('quoteForm').reset();

         // Reset pages
         document.querySelectorAll('.form-page').forEach(p => p.classList.remove('active'));
         document.getElementById('page1').classList.add('active');
         currentPage = 1;

         // Reset progress
         updateProgressIndicator();

         // Reset quote
         calculatedQuote = 0;
         document.getElementById('quoteAmount').textContent = '$0';
         document.getElementById('quoteDetails').textContent = 'Select your options above to calculate';

         // Reset summary
         document.getElementById('summaryAddonsRow').style.display = 'none';

         // Scroll form into view (optional, controlled)
         document.getElementById('quoteForm').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
         });
         }


        // Initial calculation
        calculateQuote();