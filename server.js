'use strict'

const morgan = require('morgan');
const express = require('express');
const PORT = process.env.PORT || 8000;
let currentUser = null;
const app = express();
const { users } = require('./data/users');





const handleHome = (req, res) => {
    if (!currentUser) { res.redirect('/signin'); return; }
    res.render('pages/homepage', {
        title: 'Welcome to Friendface',
        image: currentUser.avatarUrl,
        name: currentUser.name,
        currentUser : currentUser,
        users : users,
    });
};
const handleSignin = (req, res) => {
    if (currentUser) { res.redirect('/'); return; }
    res.render('pages/signin', {
        title: 'Sign in',
    });
};



const handleUser = (req, res) => {
    if (!currentUser) { res.redirect('/signin'); return; }
    const id = req.params.id;
    const user = users.find(user => user.id === id)
    res.render('pages/homepage', {
        title: 'Welcome to Friendface',
        image: user.avatarUrl,
        name: user.name,
        currentUser : user,
        users,
        user : user,
    });
};

const handleName = (req, res) => {
    //the key "firstName" come from the form input name in the html.
    //one endpoint to receive data, one different endpoint to return data
    //read on html 5 form GET vs POST
    const firstName = req.query.firstName;
    currentUser = users.find(user => user.name === firstName) || null;
    res.redirect(`${currentUser ? '/' : '/signin'}`);
}


app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');


app.get('/', handleHome)
app.get('/signin', handleSignin)
app.get('/user/:id', handleUser)
app.get('/getname', handleName)


app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


