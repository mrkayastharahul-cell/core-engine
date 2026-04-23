fetch('https://api.github.com/repos/YOUR_USERNAME/core-engine/commits/main')
.then(r => r.json())
.then(d => {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/YOUR_USERNAME/core-engine@' + d.sha + '/script.js';
  document.body.appendChild(s);
});
