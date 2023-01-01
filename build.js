const fse = require('fs-extra');
const fs = require('fs')


// To copy a folder or file, select overwrite accordingly
try {
    fse.copySync('public', 'dist', { overwrite: true })
    if(!fs.existsSync('dist/cros_background.js')){
        console.warn(`please run 'build-background'`)
    }
    if(!fs.existsSync('dist/cros_option.js')){
        console.warn(`please run 'build-option'`)
    }

} catch (err) {
    console.error(err)
}