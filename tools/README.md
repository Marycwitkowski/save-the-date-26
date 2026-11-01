# RSVP

The invite page emails each reply to maryc.witkowski@gmail.com through [FormSubmit](https://formsubmit.co). On submit it `POST`s JSON to `https://formsubmit.co/ajax/maryc.witkowski@gmail.com` (`Content-Type` and `Accept` are `application/json`). The message includes Name, Attending, Plus one, Contact, and Note, plus a subject like `RSVP: Ada Lovelace — Yes`.

The first real submission sends FormSubmit’s activation email to that address. Open it and confirm. Later replies arrive in the inbox. Do not use a throwaway test if you want to avoid an extra activation message; the first genuine RSVP is enough.

The script in this folder is not called by the page right now. It is here if you would rather collect replies in a Google Sheet.

## Switching back to the Google Sheet

1. Deploy `rsvp-apps-script.gs` with the steps below and copy the web app URL. It ends in `/exec`.
2. In `invite/index.html`, replace the FormSubmit `fetch` (the `FORMSUBMIT_URL` constant at the top of the page script) with a `POST` to that URL. Use `mode: 'no-cors'` and a form body, not JSON. Send `Timestamp`, `Name`, `Attending`, `plusOne` (`Yes`, `No`, or blank), `Contact`, and `Note`. The script reads `plusOne`, not `Plus one`.
3. Commit and push so GitHub Pages publishes the change.

## Deploy the script

Use a spreadsheet that is empty, or whose first tab is empty. Replies are written to the first tab. The columns are:

`Timestamp` · `Name` · `Attending` · `Plus one` · `Contact` · `Note`

If that tab has no rows yet, the script adds this header row and then the reply.

1. Open the Google Sheet.
2. Choose **Extensions → Apps Script**.
3. Replace the contents of `Code.gs` with the contents of `rsvp-apps-script.gs` in this folder. Save.
4. Choose **Deploy → New deployment**.
5. Next to "Select type", choose **Web app**.
6. Set **Execute as** to **Me**.
7. Set **Who has access** to **Anyone**.
8. Click **Deploy**. The first time, Google asks you to authorize the script. Allow it.
9. Copy the web app URL. It ends in `/exec`.

Open the `/exec` URL once in a browser. You should see: `RSVP endpoint is awake. Submissions arrive by POST.`

After the page is pointed at that URL, submit a reply with your own name and confirm a row appears. Delete the test row when you are done.

## After you change the script

Apps Script keeps serving the version you deployed. After any edit: **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The `/exec` URL stays the same.
