import Express from "express";
import httpProxy from "http-proxy";
import morgan from "morgan";
import config from "./configuration";
import { USER_AUTH_URLS } from "./service-proxy/user-auth"
import { BOOK_URLS } from "./service-proxy/book";
import { Authenticated } from "./middleware/authenticated";
import { AdminOnly } from "./middleware/adminOnly";

const app = Express();

const proxy = httpProxy.createProxyServer();

app.use(morgan('combined'));

app.get('/', (req, res) => res.send('Hello World!'));

//////////////////////////// USER-AUTH SERVICE PROXY ////////////////////////////
app.post("/api/v1/auth/login", (req, res) => {
    proxy.web(req, res, { target: USER_AUTH_URLS.login, prependPath: false});
});

app.post("/api/v1/auth/register", (req, res) => {
    proxy.web(req, res, { target: USER_AUTH_URLS.register, prependPath: false});
});

app.get("/api/v1/user", AdminOnly, async (req, res) : Promise<any> => {
    proxy.web(req, res, { target: USER_AUTH_URLS.listUser, prependPath: false});
});

app.get("/api/v1/user/:userID", Authenticated, (req, res) => {
    proxy.web(req, res, { target: USER_AUTH_URLS.getUser(req.params.userID), prependPath: false});
});


//////////////////////////// BOOK SERVICE PROXY ////////////////////////////
app.post("/api/v1/book/create", AdminOnly, async (req, res) : Promise<any> => {
    console.log(BOOK_URLS.createBook);
    proxy.web(req, res, { target: BOOK_URLS.createBook, prependPath: false});
});

app.get("/api/v1/book", async (req, res) : Promise<any> => {
    proxy.web(req, res, { target: BOOK_URLS.listBook, prependPath: false});
});

app.get("/api/v1/book/:bookID", (req, res) => {
    proxy.web(req, res, { target: BOOK_URLS.bookDetails(req.params.bookID), prependPath: false});
});

app.get("/api/v1/book/author/:authorID", (req, res) => {
    proxy.web(req, res, { target: BOOK_URLS.listBookByAuthor(req.params.authorID), prependPath: false});
});

app.post("/api/v1/author/create", AdminOnly, async (req, res) : Promise<any> => {
    proxy.web(req, res, { target: BOOK_URLS.createAuthor, prependPath: false});
});

app.get("/api/v1/author", async (req, res) : Promise<any> => {
    proxy.web(req, res, { target: BOOK_URLS.listAuthor, prependPath: false});
});

app.get("/api/v1/author/:authorID", (req, res) => {
    proxy.web(req, res, { target: BOOK_URLS.authorDetails(req.params.authorID), prependPath: false});
});

export default app;