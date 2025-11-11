// Fetch e renderiza badges de um arquivo JSON local
(function(){
  var badgesDataUrl = 'data/badges.json';
  var containerSelector = '#badges-container';

  function renderBadges(badges) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    if (!badges || badges.length === 0) {
      container.innerHTML = '<p>Nenhuma badge disponível no momento.</p>';
      return;
    }

    var html = '<div class="badges-grid">';
    badges.forEach(function(badge) {
      html += '<div class="badge-item">';
      html += '<a href="' + (badge.assertion_url || '#') + '" target="_blank" title="' + badge.name + '">';
      html += '<img src="' + badge.image_url + '" alt="' + badge.name + '" class="badge-image" />';
      html += '<h4 class="badge-name">' + badge.name + '</h4>';
      if (badge.issuer) {
        html += '<p class="badge-issuer">' + badge.issuer + '</p>';
      }
      html += '</a>';
      html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function fetchBadges() {
    fetch(badgesDataUrl)
      .then(function(response) {
        if (!response.ok) throw new Error('Erro ao carregar badges.json: ' + response.status);
        return response.json();
      })
      .then(function(data) {
        var badges = data.badges || [];
        renderBadges(badges);
      })
      .catch(function(error) {
        console.error('Erro ao carregar badges:', error);
        var container = document.querySelector(containerSelector);
        if (container) {
          container.innerHTML = '<p>Erro ao carregar badges. Verifique o arquivo data/badges.json.</p>';
        }
      });
  }

  // Executar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchBadges);
  } else {
    fetchBadges();
  }
})();


