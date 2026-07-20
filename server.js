require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => res.send('Backend rodando!'));

// Rota para envio de e-mail
app.post('/api/contato', async (req, res) => {
  const { nome, email, mensagem } = req.body;

  // Validação básica
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    // Configuração do transporte (use e-mail e senha de app)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou outro
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${nome}" <${email}>`,
      to: process.env.EMAIL_DESTINO, // seu e-mail
      subject: 'Nova mensagem do portfólio',
      text: `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensagem: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno ao enviar e-mail' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));