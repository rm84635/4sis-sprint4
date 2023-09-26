const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');

const PORT = 3000;
const VIEWS_PATH = `${__dirname}/views`;

let userLogged = false;

let fakeUser = {
  firstName: 'Pedro',
  lastName: 'da Silva',
  bio: 'Olá. Me chamo Pedro. Adoro tecnologia, especialmente desenvolvimento mobile para Android e iOS. Sempre estou a procura de novos desafios. Vamos trabalhar juntos!',
  avatar: '/static/img/my-profile-avatar.png',
  contact: {
    email: 'pedrodasilva@gmail.com',
    tel: '+55 11 91234-5678'
  },
  experiences: [
    {
      startYear: 2015,
      endYear: 2022,
      name: 'Módulo',
      description: 'Trabalhei como desenvolvedor iOS e Android para o colégio Módulo, desenvolvendo diversos aplicativos mobile para alunos e professores.'
    },
    {
      startYear: 2011,
      endYear: 2014,
      name: 'Faculdade FIAP',
      description: 'Sou formado em Sistemas de Informação pela Faculdade de Informática e Administração Paulista (FIAP).'
    }
  ],
  applications: [
    {
      company: 'Google',
      job: 'Desenvolvedor Flutter',
      progress: [
        '11/05 - Candidatura enviada',
        '12/05 - Currículo selecionado',
        '15/05 - Entrevista com o gestor'
      ]
    },
    {
      company: 'Apple',
      job: 'Desenvolvedor iOS',
      progress: [
        '12/05 - Candidatura enviada',
        '14/05 - Currículo selecionado',
        '18/05 - Entrevista com o gestor'
      ]
    }
  ]
};

const renderPage = (pageName, pageTitle, res, obj) => {
  if (!obj.hasOwnProperty('renderHeader')) {
    obj.renderHeader = true;
  }

  if (!obj.hasOwnProperty('renderFooter')) {
    obj.renderFooter = true;
  }

  if (userLogged) {
    obj.userName = 'Pedro da Silva';
  }

  obj.pageCSS = `/static/css/pages/${pageName}.css`;
  obj.pageTitle = pageTitle;

  res.render(pageName, obj);
};

const app = express();

app.set('views', VIEWS_PATH);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress(`${VIEWS_PATH}/partials`));
app.use (bodyParser.urlencoded({extended : true}));
app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', (_, res) => {
  renderPage('index', 'Início', res, {userLogged: userLogged});
});

app.get('/login', (_, res) => {
  userLogged = false;

  renderPage('login', 'Login', res, {
    renderHeader: false,
    renderFooter: false
  });
});

app.post('/login', (req, res) => {
  userLogged = true;
  res.redirect('/perfil');
});

app.get('/perfil', (_, res) => {
  if (userLogged) {
    renderPage('perfil', 'Meu Perfil', res, {user: fakeUser, userLogged: userLogged});
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, _ => {
  console.log(`Iniciando aplicação em http://localhost:${PORT}...`);
});