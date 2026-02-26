/**
 * Image Optimization Script
 * Automatically adds lazy loading to images and optimizes image loading
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add lazy loading to all images
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    // Add loading="lazy" attribute for native lazy loading
    img.setAttribute('loading', 'lazy');
    
    // Add decoding="async" for better performance
    img.setAttribute('decoding', 'async');
    
    // Add alt text if missing (accessibility)
    if (!img.alt) {
      console.warn('Image missing alt text:', img.src);
      img.alt = 'Image';
    }
  });
  
  // Optimize SVG images
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    // Ensure SVGs are responsive
    if (!svg.hasAttribute('viewBox') && svg.hasAttribute('width') && svg.hasAttribute('height')) {
      const width = svg.getAttribute('width');
      const height = svg.getAttribute('height');
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.removeAttribute('width');
      svg.removeAttribute('height');
    }
  });
  
  // Add intersection observer for advanced lazy loading fallback
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // If image has data-src, load it
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Add loaded class for animations
          img.classList.add('loaded');
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.01
    });
    
    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Log image optimization stats
  const totalImages = document.querySelectorAll('img').length;
  const lazyImages = document.querySelectorAll('img[loading="lazy"]').length;
  console.log(`Image Optimization: ${lazyImages}/${totalImages} images with lazy loading`);
});

// Preload critical images (above the fold)
window.addEventListener('load', function() {
  // Find images in the first viewport
  const viewportHeight = window.innerHeight;
  const criticalImages = Array.from(document.querySelectorAll('img')).filter(img => {
    const rect = img.getBoundingClientRect();
    return rect.top < viewportHeight;
  });
  
  // Remove lazy loading from critical images for faster initial render
  criticalImages.forEach(img => {
    if (img.hasAttribute('loading')) {
      img.removeAttribute('loading');
    }
  });
});
