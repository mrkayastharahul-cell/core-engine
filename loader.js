fetch('https://api.github.com/repos/mrkayastharahul-cell/core-engine/commits/main')
.then(r => r.json())
.then(d => {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/mrkayastharahul-cell/core-engine@' + d.sha + '/script.js';
  document.body.appendChild(s);
});
