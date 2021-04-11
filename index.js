require("dotenv").config();
const { Telegraf } = require("telegraf");
const pm2 = require("pm2");
const clone = require("git-pull-or-clone");
const { Keyboard } = require("telegram-keyboard");
const bot = new Telegraf(process.env.BOT_TOKEN || getApi());
let adminId = process.env.ADMIN || 635096382;

Array.prototype.last = function () {
  return this[this.length - 1];
};

bot.start((ctx) => ctx.reply("اهلا بك جرب الاوامر الخاصة بنا"));

bot.command("update", (ctx) => {
  if (ctx.from.id === adminId) {
    pm2.list((err, list) => {
      let array = [];
      list.forEach((e) => {
        let path = e.pm2_env.pm_cwd;
        let name = path.split("\\").last();
        array.push(name);
        bot.action(name, (ctx) => {
          clone(e.pm2_env.versioning.url, path, (err) => {
            if (err) {
              ctx.reply(err);
              return;
            }
            ctx.reply("SUCCESS!");
          });
        });
      });
      ctx.reply("اختر ماتريد تحديثة", Keyboard.make(array).inline());
    });
  }
});
bot.launch().then();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

function getApi() {
  const prompt = require("prompt-sync")();

  const fs = require("fs");

  const api = prompt("What is your api bot? => ");

  const content = "BOT_TOKEN=" + api;

  fs.writeFile(".env", content, () => {});

  return api;
}
