const Koa = require('koa');
const KoaRouter = require('koa-router');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs')

const app = new Koa();
const router = new KoaRouter();

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
    await ctx.render('index')
});

router.get('/test', ctx => (ctx.body = 'Hello Test'));

// Router Middleware
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('Server Started...'));
