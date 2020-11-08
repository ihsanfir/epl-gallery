const webPush = require('web-push');
 
const vapidKeys = {
    "publicKey":"BDnsO4hoKYVDgii4ZhuH8Kl1c7f2U_G7Z3AN5aV4msEji0u4I6xypwQwsRCRwx8wNUA5kQKlr_3WEu4pIvUoA28",
    "privateKey":"S5WU8NDGv6oxyVj7l4Vcth7SvXHUqbEcxUd3wZR4F50"
};
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/cjrqHIffocw:APA91bGGlzbralhjGejMf-iQaI4L48MPTquU2EH6nUWQ2Zhh2x76v2duZl6PJQPSZbEpqc45pWRcod-5EtRQPM4GJySKSp6RBktBaHvpEnPpe5LJRR_-CC5xr3jVzn3UJHY3z11HXUME",
   "keys": {
       "p256dh": "BPBNUTMbY9o64xKQDL2Lv59B6G4BqWou4JE2KLHB1jXJBiKXB86HeU3SOUkD/ooiK2k3hUYE/gFRye4uBSNqojU=",
       "auth": "PZ/q6OQ+Il+qe7PIuiQB3g=="
   }
};

const payload = 'Hai Selamat datang di EPL Gallery';
 
const options = {
   gcmAPIKey: '857005205507',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);