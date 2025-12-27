document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.fade-in');
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // console.log('Element is in view:', entry.target); // Debugging check
          entry.target.classList.add('fade-in-visible'); // Add class when visible
          observer.unobserve(entry.target); // Stop observing after element is in view
        }
      });
    }, {
      threshold: 0.1 // 10% of the element is visible
    });
  
    sections.forEach(section => {
      observer.observe(section);
    });
  });
  