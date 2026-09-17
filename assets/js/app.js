(function(){
  var ZAP = "5511955806413";

  document.getElementById('ano').textContent = new Date().getFullYear();

  /* animação de entrada da capa */
  requestAnimationFrame(function(){ document.body.classList.add('brilho'); });

  /* topo grudado */
  var topo = document.querySelector('.topo');
  var marcarTopo = function(){ topo.classList.toggle('grudado', window.scrollY > 40); };
  marcarTopo();
  window.addEventListener('scroll', marcarTopo, {passive:true});

  /* revelação por seção */
  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(ents){
      ents.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    },{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('visivel'); });
  }

  /* monta as opções a partir dos cards de serviço — fonte única de verdade */
  var servicos = [].map.call(document.querySelectorAll('#lista-servicos .srv'), function(el){
    return {
      nome: el.dataset.servico,
      preco: parseFloat(el.dataset.preco),
      min: parseInt(el.dataset.min,10)
    };
  });

  var caixa = document.getElementById('opcoes');
  servicos.forEach(function(s,i){
    var l = document.createElement('label');
    l.className = 'op';
    l.innerHTML = '<input type="checkbox" data-i="'+i+'">'
      + '<span class="nome"></span>'
      + '<span class="val">R$ '+s.preco.toFixed(0)+'</span>';
    l.querySelector('.nome').textContent = s.nome;
    caixa.appendChild(l);
  });

  /* horários de 8h às 18h30 */
  var sel = document.getElementById('hora');
  for(var h=8; h<=18; h++){
    ['00','30'].forEach(function(m){
      var o = document.createElement('option');
      o.textContent = (h<10?'0':'')+h+':'+m;
      sel.appendChild(o);
    });
  }
  sel.value = '09:00';

  var elValor = document.getElementById('valor');
  var elTempo = document.getElementById('tempo');

  function escolhidos(){
    return [].filter.call(caixa.querySelectorAll('input'), function(c){ return c.checked; })
             .map(function(c){ return servicos[parseInt(c.dataset.i,10)]; });
  }

  function atualizar(){
    var sel = escolhidos();
    var total = sel.reduce(function(a,s){ return a + s.preco; }, 0);
    var min = sel.reduce(function(a,s){ return a + s.min; }, 0);
    elValor.textContent = 'R$ ' + total.toFixed(0);
    if(!sel.length){ elTempo.textContent = 'nenhum serviço escolhido'; return; }
    var txt = min >= 60 ? Math.floor(min/60) + 'h' + (min%60 ? (min%60) : '') : min + ' min';
    elTempo.textContent = sel.length + (sel.length>1 ? ' serviços' : ' serviço') + ' · cerca de ' + txt;
  }

  caixa.addEventListener('change', atualizar);
  atualizar();

  document.getElementById('enviar').addEventListener('click', function(){
    var sel = escolhidos();
    if(!sel.length){
      alert('Escolha pelo menos um serviço para montar o atendimento.');
      return;
    }
    var nome = (document.getElementById('nome').value || '').trim();
    var dia = document.getElementById('dia').value;
    var hora = document.getElementById('hora').value;
    var total = sel.reduce(function(a,s){ return a + s.preco; }, 0);

    var linhas = [];
    linhas.push('Fala Henrique! Vim pelo site e queria marcar um horário.');
    linhas.push('');
    if(nome) linhas.push('Nome: ' + nome);
    linhas.push('Dia: ' + dia + ' às ' + hora);
    linhas.push('');
    linhas.push('Serviços:');
    sel.forEach(function(s){ linhas.push('• ' + s.nome + ' — R$ ' + s.preco.toFixed(0)); });
    linhas.push('');
    linhas.push('Total estimado: R$ ' + total.toFixed(0));

    window.open('https://wa.me/' + ZAP + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank');
  });

  /* aberto agora? */
  (function(){
    var agora = new Date();
    var d = agora.getDay(), h = agora.getHours() + agora.getMinutes()/60;
    var aberto = d >= 1 && d <= 6 && h >= 8 && h < 19;
    var box = document.getElementById('status');
    var bol = box.querySelector('.bolinha');
    var txt = box.querySelector('span:last-child');
    if(aberto){
      txt.textContent = 'Aberto agora — fecha às 19h';
    } else {
      bol.classList.add('off');
      txt.textContent = d === 0 ? 'Fechado hoje — abre segunda às 8h' : (h < 8 ? 'Fechado — abre hoje às 8h' : 'Fechado — abre amanhã às 8h');
    }
  })();
})();
