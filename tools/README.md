# RSVP sheet (Google Apps Script)

Guests reply on the invite page. This script appends each reply to a Google Sheet you own. The page does not send anything until you paste the deployed web app URL into `RSVP_ENDPOINT` in `invite/index.html`.

Use a spreadsheet that is empty, or whose first tab is empty. Replies are written to the first tab. The columns are:

`Timestamp` · `Name` · `Attending` · `Party size` · `Contact` · `Note`

If that tab has no rows yet, the script adds this header row and then the reply.

## Deploy

1. Open the Google Sheet.
2. Choose **Extensions → Apps Script**.
3. Replace the contents of `Code.gs` with the contents of `rsvp-apps-script.gs` in this folder. Save.
4. Choose **Deploy → New deployment**.
5. Next to "Select type", choose **Web app**.
6. Set **Execute as** to **Me**.
7. Set **Who has access** to **Anyone**.
8. Click **Deploy**. The first time, Google asks you to authorize the script. Allow it.
9. Copy the web app URL. It ends in `/exec`.
10. In `invite/index.html`, replace `PASTE_APPS_SCRIPT_URL_HERE` with that URL. It is the `RSVP_ENDPOINT` constant at the top of the page script. Commit and push so GitHub Pages publishes it.

Open the `/exec` URL once in a browser. You should see: `RSVP endpoint is awake. Submissions arrive by POST.`

Then submit a test reply from the invite page (use your own name) and confirm a row appears. Delete the test row when you are done.

## After you change the script

Apps Script keeps serving the version you deployed. After any edit: **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The `/exec` URL stays the same, so you do not need to change `RSVP_ENDPOINT` again.
