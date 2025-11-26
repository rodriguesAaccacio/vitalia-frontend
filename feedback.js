// chave pública do EmailJS
const PUBLIC_KEY = "67FNIpiHZOcS5nIob";  
// id do serviço criado no EmailJS
const SERVICE_ID = "service_skijbi6";  
// id do template de email que vai ser usado
const TEMPLATE_ID = "template_ukxb9ts"; 

// inicializa o EmailJS com a chave pública
(function() {
  emailjs.init(PUBLIC_KEY);
})();

// função que envia o feedback do usuário
function enviarFeedback() {
  const nome = document.getElementById("nome").value.trim(); // pega o nome e tira espaços
  const email = document.getElementById("email").value.trim(); // pega o email e tira espaços
  const feedback = document.getElementById("feedback").value.trim(); // pega o feedback e tira espaços

  // se algum campo estiver vazio, mostra alerta e sai da função
  if (!nome || !email || !feedback) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // cria o objeto que vai ser enviado pro email
  const payload = { nome, email, feedback };

  console.log("Enviando payload:", payload); // só pra testar no console

  // envia o email usando EmailJS
  emailjs.send(SERVICE_ID, TEMPLATE_ID, payload)
    .then(function(response) {
      console.log("EmailJS success:", response); // sucesso no console
      alert("🎉 Bem-vindo ao serviço Vitalia!\n\n💌 Muito obrigada pelo seu feedback, ele é muito importante para nós!"); // alerta bonitinho
      // limpa os campos depois de enviar
      document.getElementById("nome").value = "";
      document.getElementById("email").value = "";
      document.getElementById("feedback").value = "";
    })
    .catch(function(error) {
      console.error("EmailJS error:", error); // erro no console
      alert("Erro ao enviar."); // alerta de erro
    });
}
