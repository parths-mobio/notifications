const userToken = document.cookie;
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const publicVapidKey = 'BDQ1vn6eYm_2FenbitkhwLyZtqdQ8FJDddCJJiVGzzo5xGu9XwuuyVMQ7puD9WMLnuhbw806IYXwTP_vzgj3iOc';

const triggerPush = document.querySelector('.trigger-push');

triggerPushNotification = async (req, res) => {
  if ('serviceWorker' in navigator) {
    const register = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('waiting for acceptance');
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log('acceptance complete');

    const mytoken = userToken.split("token=");

    if (!mytoken[1]) {
      console.log("user not logged In");
    }

    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + mytoken[1],
      },
    });
  } else {
    console.error('Service workers are not supported in this browser');
  }
}


triggerPush.addEventListener('click', () => {
  triggerPushNotification().catch(error => console.error(error));
});