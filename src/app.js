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

const oportunidades = [
  {
    company: 'Google',
    job: 'UX/UI designer',
    description: 'Estamos procurando profissionais com experiência em UX/UI design.'
  },
  {
    company: 'FIAP',
    job: 'DevOps e Infra',
    description: 'Precisamos de profissionais especializados em DevOps e infraestrutura de sistemas.'
  },
  {
    company: 'Amazon',
    job: 'QA Tester',
    description: 'À procura de QA Testers para garantir a qualidade e segurança dos nossos sistemas.'
  },
  {
    company: 'InfoSafe',
    job: 'Especialista em segurança',
    description: 'Somos uma nova startup e estamos buscando especialistas em segurança digital.'
  },
  {
    company: 'Twitter',
    job: 'API designer',
    description: 'Procura-se profissionais com experiência em desenvolver APIs REST.'
  },
  {
    company: 'Hirota Mercados',
    job: 'Técnico de T.I.',
    description: 'Técnico de T.I. para manter os sistemas da rede de mercados.'
  },
  {
    company: 'Apple',
    job: 'Desenvolvedor iOS mobile',
    description: 'Em busca de desenvolvedores iOS mobile com experiência em Swift e Objective-C.'
  },
  {
    company: 'FIAP',
    job: 'Desenvolvedor mobile',
    description: 'Procuramos desenvolvedores talentosos focados em Kotlin e Flutter.'
  },
];

const renderPage = (pageName, pageTitle, res, obj) => {
  if (!obj.hasOwnProperty('renderHeader')) {
    obj.renderHeader = true;
  }

  if (!obj.hasOwnProperty('renderFooter')) {
    obj.renderFooter = true;
  }

  obj.userLogged = userLogged;

  if (userLogged) {
    obj.userName = 'Pedro da Silva';
    obj.user = fakeUser;
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
  renderPage('index', 'Início', res, {});
});

app.get('/login', (_, res) => {
  userLogged = false;

  renderPage('login', 'Login', res, {
    renderHeader: false,
    renderFooter: false
  });
});

app.post('/login', (_, res) => {
  userLogged = true;
  res.redirect('/perfil');
});

app.get('/logout', (_, res) => {
  userLogged = false;
  res.redirect('/');
});

app.get('/perfil', (_, res) => {
  if (userLogged) {
    renderPage('perfil', 'Meu Perfil', res, {});
  } else {
    res.redirect('/');
  }
});

app.get('/perfil', (_, res) => {
  if (userLogged) {
    renderPage('perfil', 'Meu Perfil', res, {});
  } else {
    res.redirect('/');
  }
});

app.get('/oportunidades', (_, res) => {
  renderPage('oportunidades', 'Oportunidades', res, {
    oportunidades: oportunidades
  });
});

app.listen(PORT, _ => {
  console.log(`Iniciando aplicação em http://localhost:${PORT}...`);
});