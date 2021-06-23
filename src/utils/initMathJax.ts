/**
 * Initialize MathJax. This should be called onMount
 * Taken from https://svelte.dev/repl/ebd12dbf04574b2bb40003cc8a4299b0?version=3.14.1
 */
export default function initMathJax() {
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
  document.head.append(script);
  
  script.onload = () => {
    window.MathJax = {
      tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
      svg: {fontCache: 'global'}
    };
  };
}