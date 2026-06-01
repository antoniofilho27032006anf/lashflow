const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri =
  "mongodb+srv://lashflow:Aa996214958@cluster0.fwo8sgj.mongodb.net/lashflow?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  try {
    console.log("Conectando...");

    await mongoose.connect(uri);

    console.log("CONECTOU COM SUCESSO!");

    process.exit(0);
  } catch (err) {
    console.error("ERRO:", err);
    process.exit(1);
  }
}

run();