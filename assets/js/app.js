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

  /* monta as opções a partir dos cards — fonte única de verdade */
  function ler(sel, attr){
    return [].map.call(document.querySelectorAll(sel), function(el){
      return {
        nome: el.dataset[attr],
        preco: parseFloat(el.dataset.preco),
        min: el.dataset.min ? parseInt(el.dataset.min,10) : 0
      };
    });
  }
  var servicos = ler('#lista-servicos .srv', 'servico');
  var produtos = ler('#lista-produtos .prod', 'produto');

  function moeda(v){
    return 'R$ ' + (v % 1 ? v.toFixed(2).replace('.',',') : v.toFixed(0));
  }

  function montar(caixa, itens, titulo, prefixo){
    var t = document.createElement('p');
    t.className = 'grupo-titulo';
    t.textContent = titulo;
    caixa.appendChild(t);
    itens.forEach(function(s,i){
      var l = document.createElement('label');
      l.className = 'op';
      l.innerHTML = '<input type="checkbox" data-i="'+i+'" data-tipo="'+prefixo+'">'
        + '<span class="nome"></span><span class="val">'+moeda(s.preco)+'</span>';
      l.querySelector('.nome').textContent = s.nome;
      caixa.appendChild(l);
    });
  }

  var caixaS = document.getElementById('opcoes');
  var caixaP = document.getElementById('opcoes-produtos');
  montar(caixaS, servicos, 'Serviços', 's');
  montar(caixaP, produtos, 'Produtos para levar', 'p');

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
    var s = [], p = [];
    [].forEach.call(document.querySelectorAll('#opcoes input, #opcoes-produtos input'), function(c){
      if(!c.checked) return;
      var i = parseInt(c.dataset.i,10);
      (c.dataset.tipo === 'p' ? p : s).push((c.dataset.tipo === 'p' ? produtos : servicos)[i]);
    });
    return {servicos:s, produtos:p};
  }

  function atualizar(){
    var e = escolhidos();
    var todos = e.servicos.concat(e.produtos);
    var total = todos.reduce(function(a,x){ return a + x.preco; }, 0);
    var min = e.servicos.reduce(function(a,x){ return a + x.min; }, 0);
    elValor.textContent = moeda(total);
    if(!todos.length){ elTempo.textContent = 'nada escolhido ainda'; return; }
    var partes = [];
    if(e.servicos.length) partes.push(e.servicos.length + (e.servicos.length>1?' serviços':' serviço'));
    if(e.produtos.length) partes.push(e.produtos.length + (e.produtos.length>1?' produtos':' produto'));
    if(min) partes.push('cerca de ' + (min>=60 ? Math.floor(min/60)+'h'+(min%60?(min%60):'') : min+' min'));
    elTempo.textContent = partes.join(' · ');
  }

  caixaS.addEventListener('change', atualizar);
  caixaP.addEventListener('change', atualizar);
  atualizar();

  document.getElementById('enviar').addEventListener('click', function(){
    var e = escolhidos();
    if(!e.servicos.length && !e.produtos.length){
      alert('Escolha pelo menos um serviço ou produto.');
      return;
    }
    var nome = (document.getElementById('nome').value || '').trim();
    var dia = document.getElementById('dia').value;
    var hora = document.getElementById('hora').value;
    var total = e.servicos.concat(e.produtos).reduce(function(a,x){ return a + x.preco; }, 0);

    var l = [];
    l.push('Fala Henrique! Vim pelo site e queria marcar um horário.');
    l.push('');
    if(nome) l.push('Nome: ' + nome);
    l.push('Dia: ' + dia + ' às ' + hora);
    if(e.servicos.length){
      l.push('');
      l.push('Serviços:');
      e.servicos.forEach(function(s){ l.push('• ' + s.nome + ' — ' + moeda(s.preco)); });
    }
    if(e.produtos.length){
      l.push('');
      l.push('Produtos para levar:');
      e.produtos.forEach(function(s){ l.push('• ' + s.nome + ' — ' + moeda(s.preco)); });
    }
    l.push('');
    l.push('Total estimado: ' + moeda(total));

    window.open('https://wa.me/' + ZAP + '?text=' + encodeURIComponent(l.join('\n')), '_blank');
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
