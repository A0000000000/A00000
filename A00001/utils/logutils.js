module.exports = {
    logError (err, filename, location, time) {
        console.log('===== Error =====');
        console.log('error message: ', err);
        console.log('error filename: ', filename);
        console.log('error location: ', location);
        if (time instanceof Date) {
            console.log('error time: ', time.toLocaleString());
        }
        console.log('===== Error =====');
    },
    logWarning (warn, filename, location, time) {
        console.log('===== Warning =====');
        console.log('warning message: ', warn);
        console.log('warning filename: ', filename);
        console.log('warning location: ', location);
        if (time instanceof Date) {
            console.log('warning time: ', time.toLocaleString());
        }
        console.log('===== Warning =====');
    },
    logInfo (info, filename, location, time) {
        console.log('===== Info =====');
        console.log('info message: ', info);
        console.log('info filename: ', filename);
        console.log('info location: ', location);
        if (time instanceof Date) {
            console.log('info time: ', time.toLocaleString());
        }
        console.log('===== Info =====');
    }
}