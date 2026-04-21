import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-14 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-sm">
        <div>
          <div className="flex items-center gap-2 font-semibold mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            Vibeclubs
          </div>
          <p className="text-white/50 leading-relaxed">
            Host a vibeclub. Lock in with your crew. Ship the thing. Open source, MIT, forever.
          </p>
        </div>
        <Col title="Product">
          <A href="/explore">Find a vibeclub</A>
          <A href="/start">Host one</A>
          <A href="/extension">Chrome extension</A>
          <A href="/playbook">How it works</A>
        </Col>
        <Col title="Build">
          <A href="/developers">OSS packages</A>
          <A href="https://github.com/frankxai/vibeclubs">GitHub</A>
          <A href="https://github.com/frankxai/vibeclubs/issues">Issues</A>
        </Col>
        <Col title="Ecosystem">
          <A href="https://frankx.ai">FrankX</A>
          <A href="https://gencreator.ai">GenCreator</A>
          <A href="https://arcanea.ai">Arcanea</A>
        </Col>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/40">
        <div>© 2026 · MIT · Built with lofi at 2am</div>
        <div className="font-mono">
          <Link href="/privacy" className="hover:text-white/70 mr-4">
            privacy
          </Link>
          <Link href="/terms" className="hover:text-white/70">
            terms
          </Link>
        </div>
      </div>
    </footer>
  )
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-semibold mb-3">{title}</div>
      <ul className="space-y-2 text-white/50">{children}</ul>
    </div>
  )
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-white/80 transition">
        {children}
      </Link>
    </li>
  )
}
