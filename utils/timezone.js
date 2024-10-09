const moment = require('moment-timezone');

function setTimezone(date, fromTimeZone = "America/New_York", toTimeZone = "Europe/Madrid") {
    // Convert the date to a moment object in the source timezone
    const fromTimeZoneMoment = moment.tz(date, fromTimeZone);
    // Convert it to the target timezone
    const toTimeZoneMoment = fromTimeZoneMoment.clone().tz(toTimeZone);
    // Return the native JavaScript Date object
    return new Date(toTimeZoneMoment.format());
}
module.exports = { setTimezone }