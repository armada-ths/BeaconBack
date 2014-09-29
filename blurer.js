var gm = require('gm');
gm('public/images/hero.jpg')
.blur(7, 3)
.write('public/images/hero_blur.jpg', function (err) {
  if (!err) console.log('blurred');
})