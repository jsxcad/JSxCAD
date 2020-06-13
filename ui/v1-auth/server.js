/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/', (req, res) => res.sendFile('auth.html', { root: __dirname }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) =>
  res.send(`Access Token: ${JSON.stringify(req.user.accessToken)}`)
);

app.get('/error', (req, res) => res.send('error logging in'));

const USERS = new Map();

passport.serializeUser(function (user, done) {
  USERS.set(user.id, user);
  done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  done(undefined, USERS.get(user.id));
});

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

//  GITHUB AUTH

const GitHubStrategy = require('passport-github2').Strategy;

//  GITHUB GIST AUTH

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GIST_CLIENT_ID,
      clientSecret: process.env.GIST_CLIENT_SECRET,
      callbackURL: '/auth/gist/callback',
      name: 'gist',
    },
    (accessToken, refreshToken, profile, done) => {
      const user = { accessToken, refreshToken, profile };
      return done(undefined, user);
    }
  )
);

app.get(
  '/auth/gist',
  function (req, res, next) {
    req.session.gistCallback = req.query.gistCallback;
    return next();
  },
  passport.authenticate('gist', { scope: ['gist'] })
);

app.get(
  '/auth/gist/callback',
  passport.authenticate('gist', { failureRedirect: '/error' }),
  function (req, res) {
    const url = req.session.gistCallback;
    console.log(`gistCallback: ${url}`);
    if (url === undefined) {
      // How does this happen?
    } else if (url.startsWith('http://127.0.0.1:5000/')) {
      console.log(`Redirecting gist to local auth.html`);
      res.redirect(
        `http://127.0.0.1:5000/auth.html?gist=${req.user.accessToken}`
      );
    } else if (url.startsWith('https://jsxcad.js.org/preAlpha3/')) {
      console.log(`Redirecting gist preAlpha3 auth.html`);
      res.redirect(
        `https://jsxcad.js.org/preAlpha3/auth.html?gist=${req.user.accessToken}`
      );
    } else if (url.startsWith('https://jsxcad.js.org/preAlpha4/')) {
      console.log(`Redirecting gist preAlpha4 auth.html`);
      res.redirect(
        `https://jsxcad.js.org/preAlpha4/auth.html?gist=${req.user.accessToken}`
      );
    }
  }
);

//  GITHUB REPOSITORY AUTH

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_REPOSITORY_CLIENT_ID,
      clientSecret: process.env.GITHUB_REPOSITORY_CLIENT_SECRET,
      callbackURL: '/auth/githubRepository/callback',
      name: 'githubRepository',
    },
    (accessToken, refreshToken, profile, done) => {
      const user = { accessToken, refreshToken, profile };
      console.log(`QQ/user: ${JSON.stringify(user)}`);
      return done(undefined, user);
    }
  )
);

app.get(
  '/auth/githubRepository',
  function (req, res, next) {
    req.session.githubRepositoryCallback = req.query.githubRepositoryCallback;
    return next();
  },
  passport.authenticate('githubRepository', {
    scope: ['public_repo', 'repo', 'user'],
  })
);

app.get(
  '/auth/githubRepository/callback',
  passport.authenticate('githubRepository', { failureRedirect: '/error' }),
  function (req, res) {
    const url = req.session.githubRepositoryCallback;
    console.log(`githubRepositoryCallback: ${url}`);
    console.log(`Token: ${req.user.accessToken}`);
    if (url === undefined) {
      // How does this happen?
    } else if (url.startsWith('http://127.0.0.1:5000/')) {
      console.log(`Redirecting github repository to local auth.html`);
      res.redirect(
        `http://127.0.0.1:5000/auth.html?githubRepository=${req.user.accessToken}`
      );
    } else if (url.startsWith('https://jsxcad.js.org/preAlpha4/')) {
      console.log(`Redirecting github repository preAlpha4 auth.html`);
      res.redirect(
        `https://jsxcad.js.org/preAlpha4/auth.html?githubRepository=${req.user.accessToken}`
      );
    }
  }
);
