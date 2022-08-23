/* eslint-disable */
import nodemon from 'nodemon'

nodemon({
  exec: 'yarn vite',
  ignore: '*', // no watch
  delay: 5, // 5sec
})

nodemon.on('start', function () {
  console.log('[nodemon] start')
}).on('quit', function () {
  console.log('[nodemon] quit')
  process.exit()
}).on('crash', function (files) {
  console.log('[nodemon] crash wait 5sec...')
  nodemon.emit('restart')
}).on('restart', function (files) {
  console.log('[nodemon] restart')
})
