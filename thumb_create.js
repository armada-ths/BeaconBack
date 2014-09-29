var thumb = require('node-thumbnail').thumb;

// thumb(options, callback);

thumb({
  source: 'public/images',
  destination: 'public/thumbnails',
  width: '150',
  concurrency: 4
}, function(err) {
  console.log('All done!');
});