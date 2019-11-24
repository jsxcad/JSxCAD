/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.get('/', (req, res) => res.sendFile('auth.html', { root: __dirname }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success',
        (req, res) => res.send(`Access Token: ${JSON.stringify(req.user.accessToken)}`));

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

/*  GITHUB AUTH  */

const GitHubStrategy = require('passport-github2').Strategy;

const GITHUB_CLIENT_ID = process.env.CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.CLIENT_SECRET;

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/gist/callback'
},
                                function (accessToken, refreshToken, profile, done) {
                                  const user = { accessToken, refreshToken, profile };
                                  return done(undefined, user);
                                }));

app.get('/auth/gist',
        function (req, res, next) {
	  console.log(`QQ/headers: ${JSON.stringify(req.headers)}`);
          req.session.gistCallback = req.query.gistCallback;
          return next();
        },
        passport.authenticate('github', { scope: ['gist'] }));

app.get('/auth/gist/callback',
        passport.authenticate('github', { failureRedirect: '/error' }),
        function (req, res) {
          const url = req.session.gistCallback;
          console.log(`gistCallback: ${url}`);
	  if (url === undefined) {
	    // How does this happen?
	  } else if (url.startsWith('http://127.0.0.1:5000/')) {
            console.log(`Redirecting gist to local auth.html`);
            res.redirect(`http://127.0.0.1:5000/auth.html?gist=${req.user.accessToken}`);
          } else if (url.startsWith('https://jsxcad.js.org/preAlpha3/')) {
            console.log(`Redirecting gist preAlpha3 auth.html`);
            res.redirect(`https://jsxcad.js.org/preAlpha3/auth.html?gist=${req.user.accessToken}`);
          }
        });

// @octokit/rest
