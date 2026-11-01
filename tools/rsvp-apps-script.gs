/**
 * RSVP collector for the Visitors invite page.
 *
 * Bind this script to the host's Google Sheet (Extensions → Apps Script),
 * then deploy it as a web app. Setup steps are in tools/README.md.
 *
 * Each submission appends one row:
 *   Timestamp | Name | Attending | Party size | Contact | Note
 *
 * Concurrent posts take a script lock so two guests cannot write the same row.
 */

var HEADERS = ['Timestamp', 'Name', 'Attending', 'Party size', 'Contact', 'Note'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    lock.waitLock(30000);
    locked = true;

    var params = (e && e.parameter) ? e.parameter : {};
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      parseTimestamp_(first_(params, ['Timestamp', 'timestamp'])),
      clean_(first_(params, ['Name', 'name']), 200),
      clean_(first_(params, ['Attending', 'attending']), 20),
      parseParty_(first_(params, ['Party size', 'partySize', 'party'])),
      clean_(first_(params, ['Contact', 'contact']), 200),
      clean_(first_(params, ['Note', 'note']), 2000)
    ]);
    SpreadsheetApp.flush();

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    if (locked) lock.releaseLock();
  }
}

/** Lets the host open the /exec URL and confirm the deployment is awake. */
function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint is awake. Submissions arrive by POST.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function first_(params, keys) {
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]] != null && params[keys[i]] !== '') return params[keys[i]];
  }
  return '';
}

function parseTimestamp_(value) {
  if (value) {
    var when = new Date(value);
    if (!isNaN(when.getTime())) return when;
  }
  return new Date();
}

function parseParty_(value) {
  var text = String(value == null ? '' : value).trim();
  if (!text) return '';
  var n = Number(text);
  if (isFinite(n)) return n;
  return text.slice(0, 10);
}

function clean_(value, max) {
  var text = String(value == null ? '' : value).replace(/\r\n/g, '\n').trim();
  if (text.length > max) text = text.slice(0, max);
  return text;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
