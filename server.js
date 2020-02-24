'use strict'
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const { users } = require('./data/users');
let currentUser = null;


let getOtherFriends = (givenUser) => { 
    let otherFriends = users.filter(user => !givenUser.friends.includes(user.id) && user.id !== givenUser.id)
    return otherFriends
}

const handleHome = (req, res) => {
    if (!currentUser) { res.redirect('/signin'); return; }
let otherFriends = getOtherFriends(currentUser);
    
    //otherFriends = otherFriends.filter(e => !newcurrentUser.id.includes(e))
    res.render('pages/homepage', {
        title: 'Welcome to Friendface',
        image: currentUser.avatarUrl,
        name: currentUser.name,
        currentUser: currentUser,
        users: users,
        otherFriends,
        friend: users.id
    });
};
const handleSignin = (req, res) => {
    if (currentUser) { res.redirect('/'); return; }
    res.render('pages/signin', {
        title: 'Sign in',
        // otherFriends,
    });
};


const handleUser = (req, res) => {
    if (!currentUser) { res.redirect('/signin'); return; }console.log(req.params.id )
    const id = req.params.id !== undefined ? req.params.id : currentUser.id;
    const user = users.find(user => user.id === id)
    const otherFriends = getOtherFriends(user)

    res.render('pages/homepage', {
        title: 'Welcome to Friendface',
        image: user.avatarUrl,
        name: user.name,
        currentUser: user,
        users: users,
        otherFriends,
        friend: users.id
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
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', handleHome)
app.get('/signin', handleSignin)
app.get('/user/:id', handleUser)
app.get('/getname', handleName)

app.post('/addFriend', (req, res) => {
    console.log('REQ *********:')
    console.log(req)
    let newFriend = req.body.newFriend;
    currentUser.friends.push(newFriend)
    res.redirect('/')
});

app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
});



app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


