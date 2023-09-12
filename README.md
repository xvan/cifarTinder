# CIFAR10 Game 

CIFAR10 Game with [react-tinder-card](https://github.com/3DJakob/react-tinder-card) animations.
The game depends on an external images server.

## CIFAR10 SERVER INSTALL INSTRUCTIONS
* Follow [cifar10 server](https://npm.io/package/cifar10) install instructions:
  * Download [cifar10 bininary version images](https://www.cs.toronto.edu/~kriz/cifar.html)
  * Transform cifar10 images using `converter.js`. (place it in same folder than the `*.bin` files)
  * Place the data folder in the root folder (next to the original `converter.js`)
  * Execute `node cifar10-server.js` in dev folder
  * Verify the server is working: it's on `http://localhost:1337` by default. Try to draw from categories... Drawing from the global training dataset isn't working at the time of writting this.

## CIFAR10 GAME INSTALL instructions.
* `npm install`
* Verify the proxy in `package.json` points to the same place as the *CIFAR SERVER*
* Execute with `npm start`
