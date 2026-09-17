# Henrique Barber Shop — site

Site institucional da Henrique Barber Shop, barbearia na Av. Lindóia, 616 — Jardim Recreio, Bragança Paulista/SP.

Site estático, sem dependências e sem build. HTML, CSS e JavaScript puros.

## Estrutura

```
index.html              página única
assets/css/style.css    estilos e animações
assets/js/app.js        agendador, revelação das seções e status de aberto/fechado
assets/img/             logo (webp e png com transparência), fachada, arte da promoção, favicon
```

## Publicar no GitHub Pages

1. Crie um repositório e suba estes arquivos na raiz (o `index.html` precisa ficar na raiz).
2. No repositório: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `root`** e salve.
3. Em alguns minutos o site fica no ar em `https://<usuario>.github.io/<repositorio>/`.

Para domínio próprio: aponte o DNS para o GitHub Pages e informe o domínio em **Settings → Pages → Custom domain**. Depois disso, atualize os campos marcados em `sitemap.xml` e o `og:image` do `index.html` com a URL final.

## Manutenção

**Preços e serviços** — ficam no `index.html`, na seção `#servicos`. Cada serviço é um bloco assim:

```html
<article class="srv" data-servico="Barba" data-preco="30" data-min="30">
```

`data-preco` é o valor em reais e `data-min` a duração em minutos. O agendador lê esses atributos, então basta alterar em um lugar: o card e a soma do orçamento atualizam juntos.

**WhatsApp** — o número aparece no topo do `assets/js/app.js`, na constante `ZAP`, e nos links `wa.me` do `index.html`. Ao trocar, altere nos dois lugares.

**Horário** — está em três lugares que precisam continuar iguais: a lista da seção "A barbearia", o bloco `openingHoursSpecification` do JSON-LD no fim do `index.html`, e a função de aberto/fechado no `app.js`.

## SEO local

O `index.html` traz dados estruturados `HairSalon` (schema.org) com endereço, telefone, horário e Instagram. Esses dados precisam ser **idênticos** aos do Perfil da Empresa no Google — nome, endereço e telefone com a mesma grafia. Divergência entre site e perfil reduz a confiança do Google no endereço e derruba a posição nas buscas do bairro.

Depois de publicar, cadastre a URL no campo "Site" do Perfil da Empresa.

## Pendências

- Confirmar os preços dos serviços (apenas o corte de R$ 25 de segunda a quinta está confirmado pelo cliente).
- Confirmar o @ do Instagram — hoje o perfil é `henrique_barbeershop`.
- Adicionar fotos de cortes prontos, quando houver, para uma galeria.
