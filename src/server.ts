import fastifyCors from "@fastify/cors";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createUser } from "./routes/users/createUser";
import fastifyJwt from "@fastify/jwt";
import { pegarUserPeloId } from "./routes/users/get-user-by-id";
import { login } from "./routes/auth/login";
import { pegarCreditosDoUser } from "./routes/creditos/get-creditos-by-user";
import { AdicionarCreditosAoUser } from "./routes/creditos/add-creditos";
import { removerCreditosDoUser } from "./routes/creditos/remove-creditos";
import { getMensagens } from "./routes/mensagens/get-mensagens";
import { getNoticias } from "./routes/noticias/get-noticias";
import { getPendenciasByUser } from "./routes/users/get-pendencias-by-user";
import { getPresencasSemanaAtual } from "./routes/users/get-presencas-semana";
import { checkinPresenca } from "./routes/users/checkin-presenca";
import fastifyStatic from "@fastify/static";
import path from "path";
import { getAtualUser } from "./routes/users/get-user-data";

const app = fastify({
  logger: true 
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "..", "public"),
  prefix: "/",
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET_KEY || "supersecretkey",
  sign: {
    expiresIn: "1d",
  },
});

app.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({
        error: "Não autorizado. Token inválido ou expirado.",
      });
    }
  }
);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser);
app.register(pegarUserPeloId);
app.register(login);
app.register(pegarCreditosDoUser);
app.register(AdicionarCreditosAoUser);
app.register(removerCreditosDoUser);
app.register(getMensagens);
app.register(getNoticias);
app.register(getPendenciasByUser);
app.register(getPresencasSemanaAtual);
app.register(checkinPresenca);
app.register(getAtualUser);

const port = parseInt(process.env.PORT || '3000', 10);

app.listen({ port, host: '0.0.0.0' }, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${port}`);
});
