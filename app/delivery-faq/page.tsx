import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatGhs } from '@/lib/currency';
import { Truck, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function DeliveryFaqPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  const regions = await prisma.deliveryRegion.findMany({
    where: { isActive: true },
    orderBy: { baseFeeInGhs: 'asc' },
  });

  const whatsappNumber = (settings?.whatsappNumber || '233502547133').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="space-y-3 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Clear & Honest Information
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Delivery Guide & Ordering FAQ
        </h1>
        <p className="text-sm text-[#94a3b8] max-w-xl mx-auto">
          Everything you need to know about placing an order, delivery timelines, and receiving your perfume in Ghana.
        </p>
      </div>

      {/* Online Business Model Notice */}
      <div className="bg-[#151821] border border-[#d4af37]/30 rounded-2xl p-6 sm:p-8 space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#d4af37]" />
          <span>Our Store Model</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
          We operate as an <span className="text-white font-semibold">online perfume business</span>. We do not have a walk-in retail showroom. Instead, we pack your fragrance with care and dispatch directly to your doorstep, workplace, or preferred parcel station across Ghana.
        </p>
      </div>

      {/* Delivery Regions & Standard Fees Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Estimated Delivery Rates in Ghana</h2>
        <p className="text-xs text-[#94a3b8]">
          Delivery fees are set to cover direct dispatch via dispatch riders in Accra/Tema and bus terminal parcel services nationwide.
        </p>

        <div className="bg-[#151821] border border-[#262b3d] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0d0e12] text-[#94a3b8] uppercase text-[11px] font-bold border-b border-[#262b3d]">
              <tr>
                <th className="p-3 sm:p-4">Destination Region</th>
                <th className="p-3 sm:p-4">Delivery Fee</th>
                <th className="p-3 sm:p-4">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2330]">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-[#1a1f2e] transition-colors">
                  <td className="p-3 sm:p-4 font-semibold text-white">{reg.regionName}</td>
                  <td className="p-3 sm:p-4 text-[#d4af37] font-bold">{formatGhs(reg.baseFeeInGhs)}</td>
                  <td className="p-3 sm:p-4 text-[#cbd5e1]">{reg.estimatedDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common FAQ Accordion / Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>

        <div className="space-y-3">
          <div className="bg-[#151821] border border-[#262b3d] p-5 rounded-xl space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white">How do I order on WhatsApp?</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              When you browse a perfume on our website, simply tap the green &quot;Order on WhatsApp&quot; button. It automatically opens WhatsApp on your phone with the product name and price filled out so you can immediately chat with the seller.
            </p>
          </div>

          <div className="bg-[#151821] border border-[#262b3d] p-5 rounded-xl space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white">How do I pay?</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              For WhatsApp orders, payment is confirmed directly with the seller via Mobile Money (MTN MoMo, Telecel Cash) or cash on delivery where agreed in Accra. For online orders, checkout can be processed directly on the website.
            </p>
          </div>

          <div className="bg-[#151821] border border-[#262b3d] p-5 rounded-xl space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white">Can I inspect the perfume when delivered?</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Yes. Every photograph displayed on this website is taken of the physical stock. You can inspect your package upon delivery to ensure it matches the scent ordered.
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="bg-[#181c28] border border-[#25D366]/30 p-6 rounded-xl text-center space-y-3">
        <h3 className="text-base font-bold text-white">Have a specific question or custom location?</h3>
        <p className="text-xs text-[#94a3b8]">
          Send a quick message to our WhatsApp team for an instant response.
        </p>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#25D366] text-black font-bold text-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp: {settings?.whatsappNumber}</span>
        </a>
      </div>
    </div>
  );
}
