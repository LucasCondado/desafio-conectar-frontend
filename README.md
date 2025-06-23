# desafio-conectar-frontend

Frontend do desafio Conéctar, desenvolvido em React + TypeScript.

## 🚀 Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [React Router DOM](https://reactrouter.com/)
- [Context API](https://react.dev/reference/react/useContext)
- [Jest](https://jestjs.io/) (para testes)
- [Create React App](https://github.com/facebook/create-react-app)

## 📦 Código Fonte

- [Repositório Backend](https://github.com/LucasCondado/desafio-conectar-backend)
- [Repositório Frontend](https://github.com/LucasCondado/desafio-conectar-frontend)

## 🌐 Demonstração Online

- **Frontend:** [https://conectar-frontend-lucascondado.herokuapp.com/](https://conectar-frontend-lucascondado.herokuapp.com/)
- **Backend:** [https://teste-conectar-back-da3221d35049.herokuapp.com/](https://teste-conectar-back-da3221d35049.herokuapp.com/)

## 👤 Usuário de Teste

- **Admin:**  
  Email: `admin@admin.com`  
  Senha: `adm123`

- **Usuário comum:**  
  (Cadastre um novo usuário via tela de cadastro)

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```
REACT_APP_API_URL=https://teste-conectar-back-da3221d35049.herokuapp.com
```

## 🛠️ Como executar o projeto

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```sh
git clone https://github.com/LucasCondado/desafio-conectar-frontend.git
cd desafio-conectar-frontend
npm install
```

### Execução em desenvolvimento

```sh
npm start
```
Acesse [http://localhost:3000](http://localhost:3000).

### Build de produção

```sh
npm run build
```

### Testes

```sh
npm test
```

### Deploy no Heroku

1. Faça o build:
   ```sh
   npm run build
   ```
2. Faça login no Heroku e crie o app:
   ```sh
   heroku login
   heroku create conectar-frontend-lucascondado
   ```
3. Configure a variável de ambiente:
   ```sh
   heroku config:set REACT_APP_API_URL=https://teste-conectar-back-da3221d35049.herokuapp.com --app conectar-frontend-lucascondado
   ```
4. Faça o deploy:
   ```sh
   git push heroku main
   ```

## 🔗 Integração com Backend

O frontend consome a API do backend NestJS.  
A URL do backend é definida pela variável `REACT_APP_API_URL`.

## 📋 Funcionalidades

- Login e cadastro de usuários
- Listagem, filtro e ordenação de usuários (admin)
- Visualização e edição de perfil (usuário comum)
- Alteração de senha
- Responsivo e seguro

---

Desenvolvido para o desafio Conéctar.