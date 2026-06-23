// Bloqueia acesso se não houver cliente logado
function autenticarCliente(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
}

// Bloqueia acesso se não houver admin logado
function autenticarAdmin(req, res, next) {
    if (!req.session.admin) {
        return res.redirect('/login');
    }
    next();
}

module.exports = { autenticarCliente, autenticarAdmin };