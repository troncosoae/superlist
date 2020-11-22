const Koa = require('koa');
const KoaRouter = require('koa-router');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 3000;

// for local connections...
// mongoose
//     .connect('mongodb://localhost:27017/TestAPI', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }).then(() => {
//         console.log('Mongodb connected...');
//     });

// mongodb atlas connections...
mongoose
    .connect(process.env.DB_HOST, {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Mongodb connected...');
    });

// Json Prettier Middleware
app.use(json());

// Body Parser Middleware
app.use(bodyParser());

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
});

let userSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
});

let User = mongoose.model("User", userSchema);

// Index
router
    .get('/', async ctx => {
        await ctx.render('index', {
            code: null,
            userId: null,
            items: ['hello']
        })
    })
    .get('/index/', async ctx => {
        await ctx.render('index', {
            code: null,
            userId: null,
            items: []
        })
    })
    .get('/index/:id', async ctx => {
        console.log(ctx.params)
        await ctx.render('index', {
            code: ctx.params.id,
            userId: null,
            items: []
        })
    })
    .get('/index/:id/:userId', async ctx => {
        console.log(ctx.params)
        await ctx.render('index', {
            code: ctx.params.id,
            userId: ctx.params.userId,
            items: []
        })
    })
    .get('/user/:id', async ctx => {
        let response = null;
        await User.find((err, res) => {
            if (err) {
                console.log(err);
            }
            response = res;
        });
        console.log('#######')
        console.log(response);
        await ctx.render('index', {
            code: ctx.params.id,
            userId: null,
            items: response
        })
    })
    .post('/user/:id', async ctx => {
        // console.log(ctx.request.body);
        console.log(ctx.params);
        ctx.body = ctx.request.body;

        let post_info = ctx.request.body;

        console.log(post_info);

        if (!post_info.name || !post_info.age || !post_info.nationality) {
            ctx.body = {message: 'wrong info'}
        } else {
            ctx.body = ctx.request.body;
            let newUser = new User({
                name: post_info.name,
                age: post_info.age,
                nationality: post_info.nationality
            });
            newUser.save((err, res) => {
                if (err) {
                    ctx.body = {message: 'error'}
                } else {
                    ctx.body = {
                        message: 'error',
                        content: post_info
                    }
                }
            });
        }
    });

router.get('/test', ctx => (ctx.body = 'Hello Test'));


// Router Middleware
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => console.log('Server Started...'));
