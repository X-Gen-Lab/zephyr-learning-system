// Initialize Mermaid for diagram rendering
document$.subscribe(function() {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: document.body.getAttribute('data-md-color-scheme') === 'slate' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Noto Sans SC, sans-serif'
    });
    
    // Re-render mermaid diagrams on theme change
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'data-md-color-scheme') {
          var theme = document.body.getAttribute('data-md-color-scheme') === 'slate' ? 'dark' : 'default';
          mermaid.initialize({ theme: theme });
          
          // Re-render all mermaid diagrams
          document.querySelectorAll('.mermaid').forEach(function(element) {
            var code = element.textContent;
            element.removeAttribute('data-processed');
            element.innerHTML = code;
          });
          mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-md-color-scheme']
    });
  }
});
