import { Camera, Wifi, Shield, Volume2, Flame, Lock, Server, Building2 } from 'lucide-react'

const SOLUTIONS = [
  {
    Icon: Camera,
    title: 'CCTV & IP Cameras',
    desc: 'Indoor & outdoor surveillance cameras with AI-powered detection for crystal-clear 24/7 monitoring.',
    tags: ['Hikvision', 'Dahua', '4K', 'AI Detection'],
  },
  {
    Icon: Wifi,
    title: 'Network Infrastructure',
    desc: 'Enterprise-grade switches, routers, and access points for robust, high-speed connectivity.',
    tags: ['TP-Link', 'CISCO', 'D-Link', 'Tenda'],
  },
  {
    Icon: Lock,
    title: 'Access Control',
    desc: 'Fingerprint readers, RFID card systems, boom barriers, and turnstiles for complete access management.',
    tags: ['Fingerprint', 'Boom Barrier', 'Turnstile', 'RFID'],
  },
  {
    Icon: Flame,
    title: 'Fire Alarm Systems',
    desc: 'Addressable and conventional fire detection systems with smoke detectors and integrated alerts.',
    tags: ['Addressable', 'Conventional', 'Smoke Detectors', 'Sprinklers'],
  },
  {
    Icon: Volume2,
    title: 'PA & Speaker Systems',
    desc: 'Professional public address systems, ceiling speakers, amplifiers for commercial spaces.',
    tags: ['Ceiling Speakers', 'Amplifiers', 'Wall Speakers', 'PA Systems'],
  },
  {
    Icon: Server,
    title: 'NVR / DVR & Storage',
    desc: 'Network and digital video recorders with high-capacity HDDs for round-the-clock recording.',
    tags: ['NVR', 'DVR', 'HDD', '4U Cabinet'],
  },
  {
    Icon: Building2,
    title: 'Hotel Door Locks',
    desc: 'Smart electronic door locks for hotels and hospitality, with keycard and mobile app access.',
    tags: ['Hotel Locks', 'Smart Locks', 'Electronic', 'Keycard'],
  },
  {
    Icon: Shield,
    title: 'Security Consulting',
    desc: 'Free security audit and tailored system design by our expert team for any scale of project.',
    tags: ['Free Consultation', 'Site Survey', 'System Design', 'Installation'],
  },
]

export default function SolutionsSection() {
  return (
    <section id="solutions" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />

      {/* Side glow */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute -left-32 top-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="font-mono text-xs text-teal-500 tracking-widest uppercase mb-3">
            What We Offer
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-800 text-white mb-4">
            Complete Security Solutions
          </h2>
          <div className="section-divider mx-auto" />
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Whether you need solutions for residential buildings, offices, retail spaces, or public venues,
            we&apos;ve got you covered across all industries.
          </p>
        </div>

        {/* Solutions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SOLUTIONS.map(({ Icon, title, desc, tags }) => (
            <div key={title} className="cyber-card p-6 group relative">
              <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
                <Icon className="w-5 h-5 text-teal-400" />
              </div>

              <h3 className="font-display font-700 text-white text-base mb-2 group-hover:text-teal-400 transition-colors">
                {title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {desc}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="tag text-[10px]">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <div className="inline-block border border-teal-500/30 bg-teal-500/5 p-8 max-w-2xl mx-auto relative">
            <div className="corner-decoration corner-tl" />
            <div className="corner-decoration corner-br" />
            <div className="font-mono text-[10px] text-teal-500 tracking-widest uppercase mb-2">
              🛡️ YOUR SAFETY IS OUR PRIORITY
            </div>
            <h3 className="font-display text-2xl font-700 text-white mb-3">
              Get a FREE Security Consultation
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Contact our expert team to design a tailored security solution that fits your needs perfectly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+233555517658" className="btn-primary">
                📞 Call: 055 551 7658
              </a>
              <a
                href="https://wa.me/233555517658?text=Hello%20Tritech%2C%20I%20would%20like%20a%20free%20security%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
