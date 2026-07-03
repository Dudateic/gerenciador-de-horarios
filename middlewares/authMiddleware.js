const COOKIE_NAME = "horarios_auth";

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((cookies, item) => {
    const [key, ...value] = item.trim().split("=");
    if (key) cookies[key] = decodeURIComponent(value.join("="));
    return cookies;
  }, {});
}

function decodeUser(value) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch (error) {
    return null;
  }
}

function encodeUser(user) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function attachUser(req, res, next) {
  const cookies = parseCookies(req);
  req.user = cookies[COOKIE_NAME] ? decodeUser(cookies[COOKIE_NAME]) : null;
  res.locals.usuario = req.user;
  next();
}

function loginUser(res, user) {
  const value = encodeUser(user);
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}`
  );
}

function logoutUser(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function requireAuth(req, res, next) {
  if (!req.user) return res.redirect("/?erro=Faça login para continuar.");
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.redirect("/?erro=Faça login para continuar.");
    if (req.user.perfil !== role) {
      return res.status(403).render("404", {
        title: "Acesso negado",
        message: "Você não tem permissão para acessar essa área.",
      });
    }
    next();
  };
}

module.exports = { attachUser, loginUser, logoutUser, requireAuth, requireRole };
