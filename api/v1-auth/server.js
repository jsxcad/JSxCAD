/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

app.get('/', (req, res) => res.sendFile('auth.html', { root: __dirname }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send('You have successfully logged in'));
app.get('/error', (req, res) => res.send('error logging in'));

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
  callbackURL: '/auth/github/callback'
},
                                function (accessToken, refreshToken, profile, cb) {
                                  return cb(null, profile);
                                }
));

app.get('/auth/github',
        passport.authenticate('github'));

app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/error' }),
        function (req, res) {
          res.redirect('/success');
        });
