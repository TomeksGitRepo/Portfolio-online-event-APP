import cron from "node-cron";
import axios from "axios";

async function checkMainPageConnection() {
  console.log("in checkMainPageConnection function");
  var result = await axios.get(
    "https://xxxx/app/pages/token/f7590156-d83d-47d1-acd4-c979d43c366c"
  );

  var data: string = result.data;
  if (
    data.includes(
      "Wyślij mail w celu wygenerowania nowego linku dostępowego do portalu"
    )
  ) {
    throw Error("Connection should be allowed but is rejected");
  }

  //console.log(`data is ${data}`);
  var time = new Date();
  console.log(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
}

cron.schedule("00,30 * * * * *", () => {
  console.log("running every 30 sek");
  checkMainPageConnection();

  //   test("test if good user connection is allowed", async () => {
  //     var result = await axios.get(
  //       "https://xxxx.xxxx.org/app/pages/token/f7590156-d83d-47d1-acd4-c979d43c366c"
  //     );

  //     console.log(`result.data is ${result.data}`);

  //     // expect(result.data)
  //   });
});
