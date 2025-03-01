const cron = require("node-cron");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { subDays, startOfDay, endOfDay } = require("date-fns");

const sendEmail = require("./sendEmail");

const connectionRequestModel = require("../models/connectionRequest");

cron.schedule("49 21 * * *", async () => {
  try {
    //using today date for test purposes onli :3
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequests = await connectionRequestModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log(listOfEmails);

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New friends await for " + email,
          "check inbox now to review"
        );
      } catch (error) {
        console.error(error);
      }
      await delay(60000);
    }
  } catch (error) {
    console.error(error);
  }
});
