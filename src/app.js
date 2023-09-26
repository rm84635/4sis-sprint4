const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');

const PORT = 3000;
const VIEWS_PATH = `${__dirname}/views`;

let userLogged = false;
let isUserCompany = false;

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
      company: 'FIAP',
      job: 'DevOps e Infra',
      progress: [
        '11/09 - Candidatura enviada',
        '12/09 - Currículo selecionado',
        '15/09 - Entrevista com o gestor'
      ]
    },
    {
      company: 'FIAP',
      job: 'Desenvolvedor mobile',
      progress: [
        '12/09 - Candidatura enviada',
        '14/09 - Currículo selecionado',
        '18/09 - Entrevista com o gestor'
      ]
    },
    {
      company: 'Apple',
      job: 'Desenvolvedor iOS mobile',
      progress: [
        '26/09 - Candidatura enviada'
      ]
    }
  ]
};

let fakeCompany = {
  name: 'Faculdade de Informática e Administração Paulista (FIAP)',
  bio: 'A melhor faculdade de tecnologia: uma história que vem sendo construída estimulando mentes a vivenciarem a inovação e o empreendedorismo.',
  avatar: '/static/img/my-profile-company-avatar.png',
  contact: {
    email: 'empower@fiap.com.br',
    tel: '+55 11 3385-8010'
  },
  vagasCadastradas: 2,
  numeroTotalDeCandidatos: 1,
  vagasFinalizadas: 0,
  jobs: [
    {
      job: 'DevOps e Infra',
      description: 'Precisamos de profissionais especializados em DevOps e infraestrutura de sistemas.'
    },
    {
      job: 'Desenvolvedor mobile',
      description: 'Procuramos desenvolvedores talentosos focados em Kotlin e Flutter.'
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

    if (isUserCompany) {
      obj.userName = 'FIAP';
      obj.user = fakeCompany;
    }
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

app.post('/login', (req, res) => {
  if (req.body.email == 'empower@fiap.com.br') {
    userLogged = true;
    isUserCompany = true;
    res.redirect('/empresa')
  } else if (req.body.email == 'pedrodasilva@gmail.com') {
    userLogged = true;
    isUserCompany = false;
    res.redirect('/perfil');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (_, res) => {
  userLogged = false;
  isUserCompany = false;
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

app.get('/empresa', (_, res) => {
  if (userLogged && isUserCompany) {
    renderPage('empresa', 'Empresa', res, {company: fakeCompany});
  } else {
    res.redirect('/');
  }
});

app.get('/me', (_, res) => {
  if (userLogged) {
    if (isUserCompany) {
      res.redirect('/empresa');
    } else {
      res.redirect('/perfil');
    }
  } else {
    res.redirect('/login');
  }
});

app.get('/empresa/1', (_, res) => {
  renderPage('empresa', 'Empresa', res, {company: fakeCompany});
});

app.get('/oportunidades', (_, res) => {
  renderPage('oportunidades', 'Oportunidades', res, {
    oportunidades: oportunidades
  });
});

app.listen(PORT, _ => {
  console.log(`Iniciando aplicação em http://localhost:${PORT}...`);
});