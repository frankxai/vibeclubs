export interface PlaybookEntry {
  slug: string
  title: string
  summary: string
  body: string
}

export const PLAYBOOK: PlaybookEntry[] = [
  {
    slug: 'what-is-a-vibeclub',
    title: "What's a vibeclub?",
    summary: 'A small crew, a shared clock, and something useful to show. A human hosts.',
    body: `A vibeclub is a small crew making things together, using tools they already have. You can work on the same project or bring different projects.

### What you need

- **A crew.** Two to eight people who agree to lock in together.
- **A reachable finish.** A draft, a working change, a track, or an honest next step.
- **A shared clock.** Agree when to focus, take a break, and show what changed.

### Who hosts

A person hosts. Choose Meet, Discord, Zoom, or an in-person spot. The host shares the plan and keeps the clock. Each person chooses what to share.

### Prepare the pack

[Build a host pack](/start) with an invite, agenda, build brief, and recap prompt. It works without an account or extension. Copy the parts you need or download the Markdown pack.

The draft restores on the same device and browser. Keep a downloaded copy if you want to move it elsewhere. Private meeting details belong in the invite you choose to send.

[Read the hosting guide](/playbook/how-to-host) before your first vibeclub.
`,
  },
  {
    slug: 'how-to-host',
    title: 'How to host a vibeclub',
    summary: 'Prepare an invite and a 60-, 90-, or 120-minute plan on your existing tools.',
    body: `### 1. Pick one thing to ship

Make the finish small enough to inspect. "Draft the opening scene" or "fix the broken export" gives the crew something clear to work toward.

### 2. Choose where to meet

Use Meet, Discord, Zoom, or an in-person spot. Check that everyone can use it. No Vibeclubs extension is required.

### 3. Build the host pack

[Open the host-pack builder](/start). Choose your craft, name the finish, and select 60, 90, or 120 minutes. Add the meeting choice, crew size, and optional timing. The builder prepares the invite, agenda, build brief, and recap prompt.

### 4. Keep a copy

Copy the invite and agenda, or download the Markdown pack. The draft can restore on this device and browser; it is not a shared crew document. Hosted publishing is a separate action.

### 5. Invite the crew

Send the invite yourself to people you want to work with. Confirm the time and meeting link. Creating a pack does not send invitations or create a public club listing.

### 6. Host the clock

Read the plan together, agree what each person hopes to finish, and start the focus block. Keep music optional and low enough to hear the crew. Use the breaks in the agenda.

### 7. Show what changed

Ask each person what shipped and what comes next. Private work can stay private. Use the [recap guide](/playbook/the-recap) to record only what people choose to share.
`,
  },
  {
    slug: 'the-mixer',
    title: 'Choose a soundtrack for a vibeclub',
    summary: 'Keep music optional, voice clear, and each person in control of their own audio.',
    body: `You can host with the audio tools you already use. A soundtrack is optional; a quiet lock-in works too.

### Start with voice

Check that the crew can hear the host on the chosen call tool. If music masks speech, lower it or turn it off. There is no single volume setting that fits every device.

### Let each person choose

Each person can play their own music or ambient sound. Agree on a shared playlist only if the crew wants one. Use audio you have permission to play.

### Keep the first setup simple

Try one focus block before adding another audio tool. Avoid broadcasting music into the call unless everyone agrees and the tool supports it.

### What the host pack does

[The host-pack builder](/start) records your soundtrack choice in the plan. It does not stream music, change anyone's volume, synchronize playback, or install the optional extension.

Choose a setup the crew can repeat next time. [The hosting guide](/playbook/how-to-host) covers the rest of the plan.
`,
  },
  {
    slug: 'the-recap',
    title: 'Write a recap after a vibeclub',
    summary: 'Record what the crew chooses to share. Keep unfinished work and the next step visible.',
    body: `The recap starts with what people tell you. The host pack includes a prompt you can copy; it does not watch a call, read private work, or send a recap for you.

### Ask for the finish

At the end of the lock-in, ask what changed. A draft, a repaired bug, or a clear next action can be worth keeping. Let each person choose whether to share a link.

### Keep it short

- **Planned:** the finish you agreed at the start.
- **Made:** what actually changed, with a link only when sharing is allowed.
- **Next:** what needs another pass.

### A worked example

Planned: repair the Markdown export. Made: the file now downloads with the right title; the crew checked it on one browser. Next: check the downloaded file on a phone.

This is an example, not a report of a real gathering. Do not invent attendance, time saved, or finished work.

### Use an assistant only when you choose

You can paste volunteered notes into an assistant and ask for a shorter draft. Review it before sharing. Leave out private meeting links and anything the crew has not agreed to send to that tool.

[Build a host pack](/start) to get the recap prompt alongside the invite and agenda.
`,
  },
  {
    slug: 'build-your-gencreator-stack',
    title: 'Bring a creator project to a vibeclub',
    summary: 'Choose one creator task, prepare the files, and give the crew a finish they can inspect.',
    body: `Bring the tools and project you already use. A vibeclub gives the crew a shared clock and a chance to show what changed.

### Choose one move

- **Writing:** revise an opening and keep the earlier draft for comparison.
- **Design:** finish one screen and inspect it at a narrow width.
- **Music:** make one arrangement decision and export a listening copy.
- **Building:** repair one behavior and show the check that passes.

### Prepare the files

Check that you can open, edit, and save the project before the crew arrives. Keep a copy you can return to if the change goes wrong.

If you are using [GenCreator's creator studio](https://gencreator.ai/creator-studio), bring the draft you want to work on. Vibeclubs does not generate, publish, or distribute that project for you.

### Plan the lock-in

[Build a host pack](/start) around that one finish. Copy the build brief into your own tool if it helps. You choose what leaves your device and what the crew sees.

### Show the result

Compare the result with the finish you named. If it is unfinished, say what remains and keep the files. A useful [recap](/playbook/the-recap) records the work without promising a weekly output count.
`,
  },
]

export function findEntry(slug: string): PlaybookEntry | undefined {
  return PLAYBOOK.find((p) => p.slug === slug)
}
