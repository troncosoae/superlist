const Koa = require('koa');
const KoaRouter = require('koa-router');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs')

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 3000;

// Json Prettier Middleware
app.use(json());

// Simple Middleware Example
// app.use(async ctx => (ctx.body = 'Hello World!'))
// app.use(async ctx => (ctx.body = { msg: 'Hello World!' }));

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
});

// Index
router.get('/', async ctx => {
    await ctx.render('index', {
        code: 'abcd'
    })
});
router.get('/:id', async ctx => {
    console.log(ctx.params)
    await ctx.render('index', {
        code: ctx.params.id,
        userId: null
    })
});
router.get('/:id/:userId', async ctx => {
    console.log(ctx.params)
    await ctx.render('index', {
        code: ctx.params.id,
        userId: ctx.params.userId
    })
});

router.get('/test', ctx => (ctx.body = 'Hello Test'));

// Router Middleware
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => console.log('Server Started...'));
