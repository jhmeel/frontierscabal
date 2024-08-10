import webPush from "web-push";


const  PushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/cAwM65oYSqI:APA91bE5nUjLYg18zYy3vXZDB2GLbxucKkSGGRafSVuEBQOfxPy--B38fIyWvdk44R6PWHNXhspmkWtsDSFTDw8zwyLhFXIAfj95CU1Gk64RU8nVyXdH20kWxOuWTY6ZfbDu-ByYH89s","expirationTime":null,"keys":{"p256dh":"BEedZFfQMDnm4KWp74FDaaPRY24pE5hzKFs5hMZ6xmZlIWhT-RS203WtvWq3w7aKYPz8Aun3r29jo1IZ9WK_PPk","auth":"AScvKJ8e24J9-O__Wq-OnQ"}}

const parsedUrl = new URL(PushSubscription.endpoint)

const user = `${parsedUrl.protocol}//${parsedUrl.hostname}`

const vapidHeader = webPush.getVapidHeaders(
    user,
    'mailto:frontierscabal@gmail.com',
   'BP_zBx8Se411U33MhcPWFMPwurhn9mP7YLnQI8CRUJXp35hk3lnYM6ZPfAZ0L4g7Ws7EhBSdqGlcE_nreH7YZNw',
   '_wOrekYu6Gn_XwN0GLlysbwaXhoMbsoZkoONIAgtBrI',
    'aes128gcm'
    )

webPush.sendNotification(PushSubscription, JSON.stringify({message:'hello world', id:2, username:'jhmeel'}),{headers:vapidHeader}).then(()=>{
    console.log('sent')
})