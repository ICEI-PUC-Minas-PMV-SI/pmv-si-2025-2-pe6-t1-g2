# Instruções de utilização

## Utilização da API
Antes de iniciar, certifique-se de ter instalado:
* .NET 8
* Visual Studio 2022 (ou superior), com as workloads:
  * ASP.NET and web development
  * Data storage and processing
* SQL Server (LocalDB, Express ou Developer)
* SQL Server Management Studio (SSMS) (opcional, mas recomendado)

1. Clone o repositório original: https://github.com/Lais-lfs/apis-web-services-projeto-saber-mais

2. Configure a string de conexão:
Localize o arquivo "appsettings.json" e no bloco "ConnectionStrings", configure para apontar ao seu SQL Server. Exemplo:
   `"ConnectionStrings": {
      "DefaultConnection": "Server=localhost;Database=API_SABER;Trusted_Connection=True;Encrypt=False;"
    }`
3. Criar o banco de dados
   No terminal do Visual Studio ou PowerShell, execute: `dotnet ef database update`
4. Executar o projeto:
   No Visual Studio, selecione a configuração "https", a API irá iniciar e o swagger aparecerá em uma nova janela do navegador para que seja possível testar os endpoints da API. Link: `https://localhost:7272/swagger`.


## Utilização da Aplicação Mobile
1. Fazer um clone do repositório original: https://github.com/SavioSrg/projeto-6periodo
2. Ter a API instalada em sua máquina, conforme as orientações anteriores
5. Ligar a API em "https"
6. Executar a aplicação web
   Se estiver usando VS Code, instale a extensão Live Server e clique com o botão direito no arquivo `index.html`. A aplicação abrirá em `http://127.0.0.1:5501`.
8. Assim que a aplicação carregar, você poderá interagir com os todos os seus recursos.


## Utilização da Aplicação Mobile
* Para iniciar o projeto, entrar na pasta "frontend-mobile-projeto-saber+", e em um terminal inicializar o Metro: `npx react-native start`
* Em outro terminal iniciar: `npx react-native run-android`
* Caso dê algum problema com dependência usar o comando: `npm ci`
* Ou se tiver algum erro: `npm install`
* Depois disso é só rodar o Metro com o `npx react-native start` e o `npx react-native run-android`
