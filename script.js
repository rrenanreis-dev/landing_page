"use strict";

document.documentElement.classList.add("js");

// 1. Navegação Ativa (Scrollspy)
function inicializarNavegacaoAtiva() {
  const links = document.querySelectorAll(".menu-link");
  const secoes = document.querySelectorAll("main section[id]");
  if (!links.length || !secoes.length) return;

  function atualizarLinkAtivo() {
    let secaoAtual = "";
    secoes.forEach((secao) => {
      const topoSecao = secao.offsetTop - 120;
      if (window.scrollY >= topoSecao) {
        secaoAtual = secao.getAttribute("id");
      }
    });

    links.forEach((link) => {
      const href = link.getAttribute("href").replace("#", "");
      if (href === secaoAtual) {
        link.classList.add("menu-link--ativo");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("menu-link--ativo");
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", atualizarLinkAtivo);
  atualizarLinkAtivo();
}

// 2. Botão Voltar ao Topo
function inicializarVoltarTopo() {
  const botaoVoltar = document.querySelector(".voltar-topo");
  if (!botaoVoltar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight / 2) {
      botaoVoltar.classList.add("voltar-topo--visivel");
    } else {
      botaoVoltar.classList.remove("voltar-topo--visivel");
    }
  });
}

// 3. Ano do Rodapé Automático
function atualizarAnoRodape() {
  const anoRodape = document.querySelector("[data-ano]");
  if (anoRodape) {
    anoRodape.textContent = new Date().getFullYear();
  }
}

// 4. Formulário de Contato
function inicializarFormulario() {
  const formulario = document.querySelector("#form-contato");
  if (!formulario) return;

  const campos = [...formulario.querySelectorAll("input, select, textarea")];
  const feedback = document.querySelector("#feedback-formulario");
  const abrirRascunho = document.querySelector("#abrir-rascunho");
  const botaoPreparar = formulario.querySelector('[type="submit"]');

  formulario.noValidate = true;
  if (botaoPreparar) botaoPreparar.disabled = false;

  function validarCampo(campo) {
    let mensagemErro = "";
    const valor = campo.value.trim();

    if (!valor) {
      mensagemErro = campo.tagName === "SELECT"
        ? "Selecione um assunto."
        : "Preencha este campo (apenas espaços não são aceitos).";
    } else if (campo.type === "email" && campo.validity.typeMismatch) {
      mensagemErro = "Informe um e-mail válido.";
    }

    const erro = document.querySelector(`#erro-${campo.id}`);
    if (erro) {
      erro.textContent = mensagemErro;
      erro.hidden = mensagemErro === "";
    }
    campo.setAttribute("aria-invalid", String(mensagemErro !== ""));
    return mensagemErro === "";
  }

  campos.forEach((campo) => {
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
      if (abrirRascunho) {
        abrirRascunho.hidden = true;
        abrirRascunho.removeAttribute("href");
      }
      if (feedback) feedback.hidden = true;
      if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (abrirRascunho) {
      abrirRascunho.hidden = true;
      abrirRascunho.removeAttribute("href");
    }

    const camposInvalidos = campos.filter((campo) => !validarCampo(campo));

    if (feedback) {
      feedback.hidden = false;
      if (camposInvalidos.length > 0) {
        feedback.textContent = "Revise os campos em destaque.";
        camposInvalidos[0].focus();
        return;
      }
    }

    const dados = new FormData(formulario);
    const nome = dados.get("nome").trim();
    const email = dados.get("email").trim();
    const assunto = dados.get("assunto").trim();
    const mensagem = dados.get("mensagem").trim();

    const titulo = `Contato pelo Portfólio — ${assunto}`;
    const corpo = [`Nome: ${nome}`, `E-mail: ${email}`, "", mensagem].join("\n");

    if (abrirRascunho) {
      abrirRascunho.href = `${formulario.action}?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(corpo)}`;
      abrirRascunho.hidden = false;
    }

    if (feedback) {
      feedback.textContent = "Rascunho gerado! Clique no botão abaixo para concluir o envio.";
    }
  });
}

// 5. Copiar E-mail
function inicializarCopiaEmail() {
  const botaoCopiar = document.querySelector("#copiar-email");
  const linkEmail = document.querySelector('address a[href^="mailto:"]');
  const feedback = document.querySelector("#feedback-copia");

  if (!botaoCopiar || !linkEmail || !feedback) return;

  botaoCopiar.addEventListener("click", async () => {
    const email = linkEmail.getAttribute("href").replace("mailto:", "");
    try {
      await navigator.clipboard.writeText(email);
      feedback.textContent = "E-mail copiado com sucesso!";
    } catch {
      feedback.textContent = `Selecione e copie manualmente: ${email}`;
    }
  });
}

// Execução ao carregar a página
inicializarNavegacaoAtiva();
inicializarVoltarTopo();
atualizarAnoRodape();
inicializarFormulario();
inicializarCopiaEmail();