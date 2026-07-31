/**
 * AegisCode lead sink — Google Apps Script Web App.
 *
 * Receives POC / partnership applications from the website
 * (src/lib/sheets-lead.ts) and appends one row per submission.
 *
 * SECURITY NOTES
 * --------------
 * A Web App deployed with "Anyone" access is a publicly reachable endpoint.
 * The shared secret below is the only access control, so:
 *   - The secret lives in Script Properties, NEVER in this file. This file is
 *     committed to the website repo; a hardcoded secret would be a leaked
 *     credential the moment it is pushed.
 *   - Rotate by changing the Script Property AND the Vercel env var
 *     GOOGLE_SHEETS_WEBHOOK_SECRET. No redeploy needed for a secret change.
 *   - Requests failing the secret check get a generic 'forbidden' with no
 *     detail, and are not written to the sheet.
 *
 * See docs/google-apps-script/README.md for deployment steps.
 */

/** Column order for the sheet. Adding a field to LeadRow in
 *  src/lib/sheets-lead.ts requires adding it here too, or it silently
 *  won't land in the sheet. Append new columns at the END so existing
 *  rows keep their meaning. */
var COLUMNS = [
  { header: '送出時間', key: 'submittedAt' },
  { header: '申請類型', key: 'track' },
  { header: '公司名稱', key: 'companyName' },
  { header: '聯絡信箱', key: 'contactEmail' },
  { header: '聯絡電話', key: 'contactPhone' },
  { header: 'Code Tier', key: 'tier' },
  { header: '團隊規模', key: 'teamSize' },
  { header: 'Domain 數', key: 'domainCount' },
  { header: '已有外部評分', key: 'hasExternalRating' },
  { header: '月報時程', key: 'monthlyReportEta' },
  { header: '主要驅動方', key: 'decisionMaker' },
  { header: '合作類型', key: 'partnerType' },
  { header: '公司網站', key: 'partnerWebsite' },
  { header: '需求說明', key: 'partnerNote' },
  { header: '處理方式', key: 'fulfillment' },
  { header: 'License ID', key: 'licenseId' },
];

/** Tab name inside the spreadsheet. Created on first write if absent. */
var SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'empty body' });
    }

    var payload = JSON.parse(e.postData.contents);

    var expected = PropertiesService.getScriptProperties().getProperty(
      'WEBHOOK_SECRET'
    );
    if (!expected) {
      // Misconfiguration, not an attack. Log it so the operator can see why
      // every submission is being rejected.
      console.error('WEBHOOK_SECRET script property is not set');
      return jsonResponse({ ok: false, error: 'not configured' });
    }
    if (payload.secret !== expected) {
      return jsonResponse({ ok: false, error: 'forbidden' });
    }

    appendRow(payload);
    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('lead-sink failed: ' + err);
    return jsonResponse({ ok: false, error: 'internal error' });
  }
}

function appendRow(payload) {
  // Concurrent submissions would otherwise race on getLastRow().
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getOrCreateSheet();
    var row = COLUMNS.map(function (col) {
      return formatCell(payload[col.key]);
    });
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    var headers = COLUMNS.map(function (col) {
      return col.header;
    });
    sheet.appendRow(headers);
    sheet
      .getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0D9488')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function formatCell(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'boolean') return value ? '是' : '否';
  if (typeof value === 'object') return JSON.stringify(value);
  // Prefix anything Sheets would evaluate as a formula. A submitted value of
  // =IMPORTXML(...) would otherwise execute with the sheet owner's privileges
  // and could exfiltrate the rest of the sheet.
  var s = String(value);
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
