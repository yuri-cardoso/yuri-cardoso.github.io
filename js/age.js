// Atualiza o elemento com id="age" com a idade calculada a partir do atributo data-birth (YYYY-MM-DD)
(function(){
  function updateAge(){
    var el = document.getElementById('age');
    if(!el) return;
    var birth = el.getAttribute('data-birth');
    if(!birth) return;
    var parts = birth.split('-');
    if(parts.length < 3) return;
    var y = parseInt(parts[0],10), m = parseInt(parts[1],10)-1, d = parseInt(parts[2],10);
    var b = new Date(y,m,d);
    if(isNaN(b)) return;
    var today = new Date();
    var age = today.getFullYear() - b.getFullYear();
    var monthDiff = today.getMonth() - b.getMonth();
    if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < b.getDate())){
      age--;
    }
    el.textContent = age + ' anos';
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', updateAge);
  } else {
    updateAge();
  }
})();
