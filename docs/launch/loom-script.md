# Loom walkthrough — 75 seconds

Record at 1080p, 30fps. Built-in mic is fine if the room is quiet. Don't show your face — screen-only is cleaner for HN.

Background: lo-fi at low volume, set in the extension itself during the recording (eat your own dog food).

---

## 0:00 — 0:08 · The website (8s)

**Visual:** vibeclubs.ai homepage, top of fold. Hero text legible.

**Voiceover:**
> Vibeclubs is a format for builders who want to make stuff together. Three pieces — a directory, a chrome extension, and five npm packages.

---

## 0:08 — 0:18 · The directory (10s)

**Visual:** Scroll to the "Listed tonight" rail. Click into one club (lofi-coders-amsterdam).

**Voiceover:**
> The directory is just markdown files. Drop a PR with a club description, your vibeclub goes live. No backend required. Each club has a join link, a rhythm, and a stack the crew uses.

---

## 0:18 — 0:30 · The extension installs (12s)

**Visual:** Open chrome://extensions, drag the .crx, pin the icon. Click the icon, type a slug into the popup.

**Voiceover:**
> Install the extension. Pin it. Type the slug of the vibeclub you're hosting. Now the overlay knows which crew you're synced with.

---

## 0:30 — 0:50 · The runtime (20s)

**Visual:** Open google meet (or any tab). Click somewhere on the page to boot AudioContext. The overlay appears bottom-right. Demonstrate:
- Three faders move (ambient up, music up, page leave alone)
- Hit start on the timer
- Cmd-J to collapse, Cmd-J to reopen
- Show the ship moment overlay (you may need to fast-forward or use a custom 30-second preset)

**Voiceover:**
> Three faders mix ambient, AI music, and your call audio. The timer broadcasts to anyone else in the same club via supabase realtime — everyone hits the same focus block. At the end, you get a 60-second ship moment. Type one line about what you shipped. Hit enter.

---

## 0:50 — 1:00 · The recap + card (10s)

**Visual:** Show the recap line in the overlay ("Cycle 2 shipped. Stretch."). Cut to /u/frank or /dev/cards showing a finished session card.

**Voiceover:**
> Claude writes a one-line recap. Never interrupts. Never coaches. The session card lands on your profile. You post the card. That's the distribution.

---

## 1:00 — 1:15 · The packages + close (15s)

**Visual:** /developers page, then click into one package detail page (vibe-mix or pomodoro-sync).

**Voiceover:**
> Everything is MIT. Five packages on npm — the mixer, the sync, the recap prompt builder, the card renderer, the music bridge. Drop them into electron, raycast, your own thing. Nothing requires vibeclubs.ai.
>
> Free forever to host. Pro ships in a few weeks for suno music gen and full claude recaps. Vibeclubs.ai. Lock in.

---

## End-card (still frame, 2s)

**Visual:** Just the URL `vibeclubs.ai` on the dark gradient with the launch mark.

---

## Editing checklist

- [ ] Cut every "um", "uh", "so" (use loom's built-in trimmer or descript)
- [ ] Add captions (loom auto-generates)
- [ ] Loop the lo-fi at -24 dB so the voice stays clear
- [ ] Final length 60–90 seconds. If you go over, cut tweet 6 or tweet 7 of the script.
- [ ] Thumbnail: the moment in 0:30 with all three faders mid-move. High contrast, eye lands on the amber fader.

## Where to use it

- Pinned on the homepage hero (right side, replacing or alongside the static session card preview)
- Embedded in show-hn.md body if HN allows (it does — paste the loom URL, it auto-embeds)
- Tweet 1 of the X thread as the headline image / video
- /extension landing page hero
