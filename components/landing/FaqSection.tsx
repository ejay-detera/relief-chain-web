"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import FadeInSection from "@/components/landing/FadeInSection";

const faqItems = [
  {
    question: "What is Relief Chain, and how does the platform work?",
    answer:
      "Relief Chain is a blockchain-powered disaster relief distribution platform designed for Philippine Local Government Units (LGUs) and humanitarian organizations. It connects three key groups: government agencies that create relief programs, displaced beneficiaries who receive programmable digital vouchers, and accredited local merchants who fulfill those vouchers. The platform combines an Expo-powered mobile app for field operations with a Next.js Super Admin web portal for accreditation and audit oversight.",
  },
  {
    question: "How does the mobile app operate in disaster zones without internet?",
    answer:
      "Relief Chain is built with an offline-first architecture. Beneficiary vouchers and cryptographic keys are stored securely on the mobile device. In blackout or low-connectivity zones, accredited merchants and field staff validate transaction signatures locally using cryptographic QR verification and peer-to-peer sync. As soon as cellular data or connection is detected, all pending transaction records are synchronized securely to the control plane and recorded on the Stellar ledger.",
  },
  {
    question: "What is the difference between the Web Application and the Mobile Application?",
    answer:
      "The Web Application serves as the Super Admin Control Plane. It is used by governing authorities to review and accredit LGUs and NGOs, audit overall relief programs, monitor real-time distribution metrics, and enforce compliance before vouchers are issued. The Mobile Application is the main operational tool used on the ground by LGUs (field enrollment & disbursement), Beneficiaries (QR vouchers & redemption), and Merchants (point-of-sale voucher scanning).",
  },
  {
    question: "Why does Relief Chain use the Stellar blockchain and Soroban?",
    answer:
      "Disaster relief requires low costs, rapid confirmation, and absolute trust. Stellar provides 3 to 5 second transaction finality and sub-cent network fees, making high-frequency micro-vouchers practical. Soroban smart contracts enforce strict mathematical conservation invariants: vouchers cannot be counterfeited, diverted, or double-spent, ensuring every peso of relief aid is auditable from donor allocation to merchant redemption.",
  },
  {
    question: "How does Relief Chain prevent duplicate claims and ghost beneficiaries?",
    answer:
      "During beneficiary enrollment, the platform verifies applicant data against National ID, Barangay clearance, and DSWD registry standards. An algorithmic duplicate detection system flags matching household heads, duplicate ID numbers, and suspicious address overlaps before vouchers can be approved, effectively eliminating ghost beneficiaries.",
  },
  {
    question: "How do local merchants get accredited and receive settlement?",
    answer:
      "Local sari-sari stores, groceries, and pharmacies apply through accredited LGUs or humanitarian organizations by presenting business permits (DTI/SEC/Barangay permit). Once verified, merchants are provisioned on the platform. When a beneficiary redeems a voucher, the transaction is cryptographically recorded on the ledger, allowing merchants to cash out through participating partner financial institutions.",
  },
];

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <FadeInSection
      id="faq"
      className="min-h-[100dvh] flex flex-col justify-center bg-muted px-6 py-12 sm:px-12 lg:py-16"
    >
      <div className="mx-auto max-w-3xl w-full">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-0.5 text-[11px] font-bold text-secondary uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-dark/70">
            Clear answers regarding how Relief Chain handles disaster logistics, offline
            operations, and blockchain settlement.
          </p>
        </div>

        <div className="mt-6 space-y-2.5">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-xl border border-dark/10 bg-white transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-3.5 sm:p-4 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-secondary pr-3">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-0 text-[11px] sm:text-xs leading-relaxed text-dark/75 border-t border-dark/5 mt-1">
                    <p className="pt-2">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </FadeInSection>
  );
}
