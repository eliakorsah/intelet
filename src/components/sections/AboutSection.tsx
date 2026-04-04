import { CheckCircle2, Building, GraduationCap, Heart, Hotel, ShoppingBag, Globe } from 'lucide-react'

const INDUSTRIES = [
  { Icon: Building, label: 'Commercial' },
  { Icon: GraduationCap, label: 'Educational' },
  { Icon: Heart, label: 'Healthcare' },
  { Icon: Hotel, label: 'Hospitality' },
  { Icon: ShoppingBag, label: 'Retail' },
  { Icon: Globe, label: 'Government' },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 relative overflow-hidden bg-navy-900/50">
      <div className="absolute inset-0 cyber-grid-bg opacity-15" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="font-mono text-xs text-teal-500 tracking-widest uppercase mb-3">
              About Tritech
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-800 text-white mb-2">
              20+ Years of IT Excellence
            </h2>
            <div className="section-divider mb-6" />

            <p className="text-slate-400 leading-relaxed mb-6">
              Welcome to Tritech Technologies Ghana Limited, your one-stop-shop for all your
              Information Technology needs. We have been in the industry for over 20 years,
              providing quality IT equipment and accessories at affordable prices to our customers.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              At Tritech Technologies, we understand the importance of timely delivery — that&apos;s why
              we provide efficient delivery services throughout Ghana and beyond. Our goal is to
              provide quality IT products and services at the lowest possible price.
            </p>

            <div className="space-y-3">
              {[
                'Authorized distributor for 8+ global IT brands',
                'Free security consultation and site surveys',
                'Professional installation and after-sales support',
                'Nationwide delivery across Ghana',
                'Retail and wholesale pricing available',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <div className="border border-teal-500/20 p-8 bg-navy-900/80 relative">
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-br" />

              <div className="font-mono text-xs text-teal-500 tracking-widest uppercase mb-5">
                Industries We Serve
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {INDUSTRIES.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-4 bg-teal-500/5 border border-teal-500/10 hover:border-teal-500/30 transition-colors"
                  >
                    <Icon className="w-6 h-6 text-teal-400" />
                    <span className="font-body text-sm text-slate-300">{label}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-teal-500/10 pt-6">
                {[
                  { value: '20+', label: 'Years in Business' },
                  { value: '500+', label: 'Happy Clients' },
                  { value: '8', label: 'Brand Partnerships' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="font-display font-900 text-3xl text-gradient">{value}</div>
                    <div className="font-mono text-[11px] text-slate-500 tracking-wider mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
