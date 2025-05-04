import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const porta = 3000;
const host = "0.0.0.0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Calculadora de Reajuste Salarial</title>
      </head>
      <body>
        <h1>Calculadora de Reajuste Salarial</h1>
        <form action="/reajuste" method="get">
          <label>Idade: <input type="number" name="idade" required></label><br><br>
          <label>Sexo:
            <select name="sexo" required>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </label><br><br>
          <label>Salário Base: <input type="number" name="salario_base" step="0.01" required></label><br><br>
          <label>Ano de Contratação: <input type="number" name="anoContratacao" required></label><br><br>
          <label>Matrícula: <input type="number" name="matricula" required></label><br><br>
          <button type="submit">Calcular Reajuste</button>
        </form>
      </body>
    </html>
  `);
});


app.get("/reajuste", (req, res) => {
  let { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  idade = Number(idade);
  salario_base = Number(salario_base);
  anoContratacao = Number(anoContratacao);
  matricula = Number(matricula);


  if (
    isNaN(idade) || idade <= 16 ||
    isNaN(salario_base) || salario_base <= 0 ||
    isNaN(anoContratacao) || anoContratacao <= 1960 ||
    isNaN(matricula) || matricula <= 0 ||
    (sexo !== "F" && sexo !== "M")
  ) {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Erro de Validação</title>
        </head>
        <body>
          <h1>Erro nos dados informados!</h1>
          <p>Por favor, preencha corretamente todos os campos:</p>
          <ul>
            <li>Idade maior que 16</li>
            <li>Salário válido e positivo</li>
            <li>Ano de contratação maior que 1960</li>
            <li>Matrícula maior que 0</li>
            <li>Sexo: F ou M</li>
          </ul>
          <a href="/">Voltar</a>
        </body>
      </html>
    `);
    return;
  }


  let percentualReajuste = 0;

  if (salario_base < 2000) {
    percentualReajuste = 0.15;
  } else if (salario_base < 4000) {
    percentualReajuste = 0.10;
  } else {
    percentualReajuste = 0.05;
  }

  const salario_reajustado = salario_base * (1 + percentualReajuste);

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Resultado do Reajuste</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .salario-reajustado { color: green; font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Dados do Funcionário</h1>
        <ul>
          <li><strong>Idade:</strong> ${idade}</li>
          <li><strong>Sexo:</strong> ${sexo}</li>
          <li><strong>Salário Base:</strong> R$ ${salario_base.toFixed(2)}</li>
          <li><strong>Ano de Contratação:</strong> ${anoContratacao}</li>
          <li><strong>Matrícula:</strong> ${matricula}</li>
        </ul>
        <p class="salario-reajustado">
          Novo Salário: R$ ${salario_reajustado.toFixed(2)}
        </p>
        <a href="/">Calcular novamente</a>
      </body>
    </html>
  `);
});


app.listen(porta, host, () => {
  console.log(`Servidor rodando em http://${host}:${porta}`);
});
