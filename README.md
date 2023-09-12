# CIFAR Game 

CIFAR Game with [react-tinder-card](https://github.com/3DJakob/react-tinder-card) animations.

## CIFAR SERVER INSTALL INSTRUCTIONS
* Follow [cifar server](https://npm.io/package/cifar10) install instructions:
  * Download [cifar bininary version images](https://www.cs.toronto.edu/~kriz/cifar.html)
  * Transform cifar10 images using `converter.js`. (place it in same folder than the `*.bin` files)
  * Place the data folder in the root folder (next to the original `converter.js`)
  * Execute `node cifar10-server.js` in dev folder
  * Verify the server is working: it's on `http://localhost:1337` by default. Try to draw from categories... Drawing from the global training dataset wasn't working.

## CIFAR GAME INSTALL instructions.
* `npm install`
* Verify the proxy in `package.json` points to the same place as the *CIFAR SERVER*
* Execute with `npm start`
