import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";

export const Route = createFileRoute("/supplier-terms")({
  head: () => ({
    meta: [
      { title: "Supplier Terms & Conditions — Aircraft Program" },
      {
        name: "description",
        content: "Aircraft Program Supplier Terms and Conditions. General terms governing all aircraft parts procurement and supplier network transactions.",
      },
    ],
  }),
  component: SupplierTermsPage,
});

function SupplierTermsPage() {
  return (
    <PublicLayout>
      <section className="bg-background py-16 px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Eyebrow>Version 1.0 · Effective July 8, 2026</Eyebrow>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Supplier Terms & Conditions
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              These Terms apply to all parts enquiries, quotations, purchase orders, and supply transactions placed by Aircraft Program with any supplier.
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-10 text-foreground/80 leading-7 font-sans">
            {/* Boxed introduction */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-foreground">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">
                Important — Please read before responding to any Request for Quotation
              </p>
              <p className="text-sm leading-relaxed mb-3">
                By responding to an RFQ from Aircraft Program, accepting a purchase order, or supplying any part in response to an Aircraft Program request, you agree to be bound by these Supplier Terms and Conditions. If you do not agree to these Terms, do not respond to the RFQ or accept the purchase order.
              </p>
              <p className="text-sm leading-relaxed mb-0 text-muted-foreground">
                These Terms apply in addition to, and take precedence over, any supplier standard terms unless Aircraft Program has separately agreed otherwise in writing.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                1. Interpretation
              </h2>
              <p className="mb-4">In these Terms the following words have these meanings:</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground w-1/3">Term</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Aircraft Program"</td>
                      <td className="px-4 py-2">
                        Moon Jet Group Ltd (Company No. 15121199) trading as Aircraft Program, registered address: Rmt Accountants & Business Advisors Ltd, Gosforth Park Avenue, Newcastle Upon Tyne, NE12 8EG. References to "us", "we", or "our" mean Aircraft Program.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Supplier" / "you"</td>
                      <td className="px-4 py-2">
                        The company, firm, or individual who receives and responds to an RFQ from Aircraft Program or who accepts a Purchase Order from Aircraft Program.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Client (Owner or Operator)"</td>
                      <td className="px-4 py-2">
                        The aircraft owner or operator on whose behalf Aircraft Program is sourcing the Part. References to "Client" in these Terms mean the Client (Owner or Operator) as defined here. Aircraft Program acts as the Client's disclosed procurement agent. The Client is the ultimate principal to whom the Part is supplied.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Part"</td>
                      <td className="px-4 py-2">
                        Any aircraft component, assembly, consumable, life-limited part, rotable, or repair article quoted for or supplied under a Purchase Order.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"RFQ"</td>
                      <td className="px-4 py-2">
                        A Request for Quotation issued by Aircraft Program to the Supplier identifying the required Part, applicable aircraft type, and minimum documentation standard.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Purchase Order" / "PO"</td>
                      <td className="px-4 py-2">
                        A formal written order issued by Aircraft Program to the Supplier confirming the Part, price, delivery terms, and documentation requirements. No purchase obligation arises unless and until a PO is issued.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Release Documentation"</td>
                      <td className="px-4 py-2">
                        The regulatory release certificate required for the Part — FAA Form 8130-3, EASA Form 1, UK CAA Form 1, or dual-release, as specified in the PO.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Back-to-Birth Trace"</td>
                      <td className="px-4 py-2">
                        For life-limited parts (LLPs): the complete chain of documentation establishing the part's full operational history from manufacture to the current transaction, sufficient to verify cycles consumed and remaining life with no unaccountable gaps.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Serviceable"</td>
                      <td className="px-4 py-2">
                        The Part is in a condition fit for installation on a certificated aircraft, meets all applicable airworthiness standards, and is accompanied by Release Documentation that satisfies the regulatory requirements of the Client's registration authority.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold text-foreground">"Airworthiness Authority"</td>
                      <td className="px-4 py-2">
                        The civil aviation authority having jurisdiction over the Client's aircraft registration — including but not limited to the FAA (USA), EASA (EU), UK CAA (United Kingdom), and GCAA (UAE).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                2. Status of Aircraft Program — Disclosed Agent
              </h2>
              <p className="mb-3">
                Aircraft Program acts in all sourcing transactions as the disclosed procurement agent of the Client. This means:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Aircraft Program is not buying the Part for its own account or for resale.</li>
                <li>The beneficial title to any Part acquired passes directly to the Client on delivery.</li>
                <li>The Supplier's legal relationship in respect of the Part itself is with the Client, not with Aircraft Program.</li>
                <li>Aircraft Program's role is to identify, negotiate, and coordinate the supply of the Part on the Client's behalf.</li>
              </ul>
              <p className="mb-3">
                <strong>Disclosure of the Client's identity:</strong> Aircraft Program does not disclose the identity of the Client to the Supplier except where required for regulatory compliance (for example, for dual-release documentation). The Supplier acknowledges and accepts this structure.
              </p>
              <p>
                The Supplier should not seek to contact the Client directly. Any commercial, warranty, or quality claims arising from the supply of a Part must be directed to Aircraft Program in the first instance. Aircraft Program will liaise with the Client and direct claims appropriately.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                3. Request for Quotation
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">3.1 RFQ Content</h3>
              <p className="mb-2">Each RFQ issued by Aircraft Program will specify:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>The required Part — part number, nomenclature, applicable aircraft type and engine variant</li>
                <li>The minimum condition standard required (Serviceable, Overhauled, Repaired, New)</li>
                <li>The Release Documentation required — 8130-3, EASA Form 1, UK CAA Form 1, or dual-release</li>
                <li>For life-limited parts: the minimum remaining cycles or hours required and the requirement for Back-to-Birth Trace</li>
                <li>The delivery location and any freight or lead time requirements</li>
                <li>The RFQ reference number and response deadline</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">3.2 Quotation Response</h3>
              <p className="mb-2">A Supplier's quotation in response to an RFQ must include:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Part number, description, and condition</li>
                <li>Condition tag or traceability statement</li>
                <li>The Release Documentation that will accompany the Part</li>
                <li>For LLPs: the number of cycles or hours remaining and a statement confirming Back-to-Birth Trace availability</li>
                <li>Unit price in the currency quoted — exclusive of freight unless freight is included</li>
                <li>Lead time to readiness and estimated delivery date</li>
                <li>Country of despatch and export/import requirements if applicable</li>
                <li>Whether a core return is required as a condition of sale, and the core charge if applicable</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">3.3 No Purchase Obligation</h3>
              <p>
                An RFQ is an invitation to quote. Aircraft Program is under no obligation to accept any quotation or to place a Purchase Order with any Supplier who responds. No purchase obligation exists until a Purchase Order is issued and accepted.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                4. Purchase Orders
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">4.1 Formation of Contract</h3>
              <p className="mb-4">
                A contract for the supply of a Part arises when Aircraft Program issues a Purchase Order and the Supplier either accepts it in writing or commences preparation of the Part for despatch, whichever is earlier. The PO constitutes the complete agreement between the parties in respect of that transaction. The Supplier's standard terms do not apply unless Aircraft Program has expressly agreed to incorporate specific provisions in writing.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">4.2 PO Content</h3>
              <p className="mb-2">Every Purchase Order will specify:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>The PO reference number</li>
                <li>Part number, description, condition, and quantity</li>
                <li>The agreed unit price and total price in the quoted currency</li>
                <li>Delivery address and method</li>
                <li>Required Release Documentation — this is a binding specification, not a preference</li>
                <li>For LLPs: the minimum remaining life requirement and Back-to-Birth Trace requirement</li>
                <li>Any core return requirement and applicable credit terms</li>
                <li>The payment terms agreed for that transaction</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">4.3 Amendments</h3>
              <p className="mb-4">
                No amendment to a Purchase Order is valid unless confirmed in writing by Aircraft Program. The Supplier must not vary the Part specification, substitute an alternative part, or change the agreed documentation without prior written consent from Aircraft Program.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">4.4 Cancellation</h3>
              <p>
                Aircraft Program may cancel a Purchase Order at any time before the Part is despatched by giving written notice to the Supplier. Where the Supplier has incurred documented, reasonable direct costs in reliance on the PO before cancellation, Aircraft Program will reimburse those costs on receipt of a valid invoice with supporting evidence. No other cancellation fees or loss of profit claims will be accepted.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                5. Part Condition, Documentation, and Regulatory Compliance
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">5.1 Condition Warranty</h3>
              <p className="mb-2">By accepting a Purchase Order, the Supplier warrants that the Part:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Is in the condition stated in the quotation and confirmed in the PO</li>
                <li>Is Serviceable and fit for installation on a certificated aircraft of the type specified</li>
                <li>Has no known defects, damage, or unresolved maintenance actions that would affect airworthiness</li>
                <li>Has not been involved in any accident, incident, or exposure to unusual stress, heat, or chemical contamination</li>
                <li>Has not been scrapped, condemned, or previously rejected by any airworthiness authority or approved maintenance organisation</li>
                <li>Is not a suspected unapproved part (SUP) and is not the subject of any airworthiness directive, alert service bulletin, or mandatory modification that requires removal or replacement</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">5.2 Release Documentation — Mandatory</h3>
              <p className="mb-4">
                The Release Documentation specified in the Purchase Order is a mandatory requirement, not a preference. The Supplier must supply the Part with the exact documentation type specified. No substitution is acceptable without Aircraft Program's prior written approval.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground">Registration Authority</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">Required Documentation</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">Acceptable / Not Acceptable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2 font-semibold">N-registered (USA)</td>
                      <td className="px-4 py-2">FAA Form 8130-3</td>
                      <td className="px-4 py-2 text-emerald-600 font-medium">✓ FAA Form 8130-3 from FAA Part 145 AMO or DAR</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">G-registered / EASA</td>
                      <td className="px-4 py-2">EASA Form 1 or UK CAA Form 1</td>
                      <td className="px-4 py-2 text-emerald-600 font-medium">
                        ✓ EASA Form 1 from EASA Part 145 AMO<br />
                        ✓ UK CAA Form 1 from UK CAA Part 145 AMO
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">US Supplier / Non-US Aircraft</td>
                      <td className="px-4 py-2">Dual-release where specified</td>
                      <td className="px-4 py-2 text-emerald-600 font-medium">
                        ✓ Both FAA 8130-3 AND EASA Form 1 / UK CAA Form 1 required when specified
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Manufacturer CoC Only</td>
                      <td className="px-4 py-2">Certificate of Conformance</td>
                      <td className="px-4 py-2 text-destructive font-medium">
                        ✕ NOT acceptable as sole release document
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Trace Only</td>
                      <td className="px-4 py-2">Trace documents without regulatory release</td>
                      <td className="px-4 py-2 text-destructive font-medium">
                        ✕ NOT acceptable (work orders, inspection records, or trace alone)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold text-foreground mb-2">5.3 Life-Limited Parts — Additional Requirements</h3>
              <p className="mb-3 text-amber-600 font-semibold">
                CRITICAL — LIFE-LIMITED PARTS (LLPs): These requirements are non-negotiable. Failure to comply will result in rejection and return at the Supplier's cost.
              </p>
              <p className="mb-2">For any Part identified as life-limited in the Purchase Order, the Supplier must supply:</p>
              <ol className="list-decimal pl-5 mb-4 space-y-1">
                <li>Back-to-Birth Trace — complete unbroken documentation chain from manufacture to current owner, establishing cycles consumed and remaining life with no unaccountable gaps</li>
                <li>Time Since New (TSN) and Cycles Since New (CSN) clearly stated on the Release Documentation</li>
                <li>Any overhaul records showing time since overhaul (TSO/CSO) where applicable</li>
                <li>Written confirmation that the Part has never been exposed to conditions that would require retirement or inspection under applicable airworthiness directives</li>
                <li>The original manufacturer's life limit and the remaining life in cycles and hours</li>
              </ol>
              <p className="mb-4">
                Aircraft Program will not accept an LLP without complete Back-to-Birth Trace. A gap in the trace chain is grounds for rejection regardless of the Release Documentation.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">5.4 Suspected Unapproved Parts</h3>
              <p className="mb-4">
                The Supplier warrants that no Part supplied under these Terms is or contains a suspected unapproved part as defined by the FAA (AC 21-29), EASA, or UK CAA. If at any time the Supplier becomes aware or has reason to suspect that a Part previously supplied to Aircraft Program may be an unapproved part, the Supplier must notify Aircraft Program immediately in writing, providing all available information. The Supplier must cooperate fully with any investigation by an airworthiness authority.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">5.5 Export and Import Compliance</h3>
              <p>
                The Supplier is responsible for compliance with all applicable export control regulations — including but not limited to the International Traffic in Arms Regulations (ITAR), the Export Administration Regulations (EAR), and UK Strategic Export Controls — for any Part supplied under these Terms. The Supplier must notify Aircraft Program before accepting a PO if any export licence or restriction applies to the Part. Aircraft Program will not accept liability for delays or non-delivery caused by the Supplier's failure to obtain necessary export authorisations.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                6. Delivery
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">6.1 Packing and Labelling</h3>
              <p className="mb-2">
                The Supplier must pack the Part in a manner appropriate for its type and value — protecting it from damage, electrostatic discharge where applicable, and environmental exposure during transit. Packing must include:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>The Part clearly identified by part number and serial number (where applicable) on the external packaging</li>
                <li>The Release Documentation physically with the Part — not sent separately unless agreed in writing</li>
                <li>The PO reference number on all outer packaging and shipping documentation</li>
                <li>For LLPs: all trace documentation in a clearly marked envelope inside the package</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">6.2 Airway Bill and Tracking</h3>
              <p className="mb-4">
                The Supplier must provide the Airway Bill (AWB) number and courier tracking details to Aircraft Program immediately on despatch — by email to info@aircraftprogram.com with the PO reference in the subject line. Failure to provide tracking details promptly delays the AOG resolution and is treated as a material failure to perform.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">6.3 Lead Time</h3>
              <p className="mb-4">
                Time is of the essence for all deliveries under these Terms. The Supplier must notify Aircraft Program immediately if any confirmed lead time cannot be met. Aircraft Program reserves the right to cancel a PO without cancellation fee if the Supplier fails to meet a confirmed lead time by more than 12 hours without prior notification and agreement.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">6.4 Risk and Title</h3>
              <p>
                Risk in the Part passes to the Client on delivery to the delivery address specified in the PO. Title to the Part passes to the Client on Aircraft Program's receipt of the Release Documentation and confirmation that payment has cleared.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                7. Price and Payment
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">7.1 Price</h3>
              <p className="mb-4">
                The price payable for each Part is the price confirmed in the Purchase Order. No price variation is acceptable after PO issuance unless agreed in writing by Aircraft Program before despatch.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">7.2 Payment Terms</h3>
              <p className="mb-2">
                Aircraft Program's standard payment terms are payment within 30 days of receipt of a valid invoice. For urgent AOG transactions, Aircraft Program may agree shorter payment terms at the time of PO issuance — such agreed terms will be stated in the PO. A valid invoice must:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Reference the PO number</li>
                <li>Show the Part number, description, quantity, and unit price</li>
                <li>Show the Aircraft Program company details correctly: Moon Jet Group Ltd t/a Aircraft Program, Company No. 15121199</li>
                <li>Be addressed to: Aircraft Program, info@aircraftprogram.com</li>
                <li>Be submitted within 7 days of despatch</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">7.3 Payment Before Order</h3>
              <p className="mb-4">
                Aircraft Program does not place a Purchase Order until the Client's funds have cleared. This means Aircraft Program's payment to the Supplier is funded at the time of order. The Supplier should not commence preparation of a Part for Aircraft Program on the basis of a verbal commitment only — a written Purchase Order is required.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">7.4 Currency</h3>
              <p className="mb-4">
                Payment will be made in the currency confirmed in the Purchase Order. Aircraft Program will not accept retrospective currency conversion requests.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">7.5 Core Returns</h3>
              <p>
                Where a core return is required as a condition of sale, the PO will specify the core charge and return timeframe. Aircraft Program will use reasonable endeavours to arrange return of the core unit. The Supplier must issue a credit note for the core charge within 5 business days of confirmed core receipt. Failure to issue a credit promptly entitles Aircraft Program to deduct the core charge from any future payment due.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                8. Warranties and Remedies
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">8.1 Supplier Warranties</h3>
              <p className="mb-2">The Supplier warrants to Aircraft Program and the Client that:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>The Part corresponds to the description, part number, and condition stated in the quotation and confirmed in the PO</li>
                <li>The Part is free from material defects in material and workmanship</li>
                <li>The Release Documentation is genuine, accurate, and has been issued by an organisation holding the relevant regulatory approval</li>
                <li>All statements made in the quotation regarding condition, trace, cycles, and history are true and complete</li>
                <li>The Supplier has title to the Part and the right to sell it</li>
                <li>The Supplier is not aware of any outstanding lien, encumbrance, or dispute affecting title to the Part</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">8.2 Warranty Period</h3>
              <p className="mb-4">
                The Supplier's warranty runs for 12 months from the date of delivery of the Part to the delivery address, or until installation, whichever is earlier. For parts that are not installed within 3 months of delivery, the Supplier's warranty runs from the date of installation for a period of 12 months or the remaining warranty period, whichever is longer.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">8.3 Remedy for Defective or Incorrectly Documented Parts</h3>
              <p className="mb-4">
                If a Part is found to be defective, not as described, or accompanied by documentation that is incorrect, incomplete, or fraudulent, Aircraft Program will notify the Supplier in writing. The Supplier must, within 5 business days of notification:
                <br />
                1. Arrange collection of the Part at the Supplier's cost
                <br />
                2. Provide a full replacement Part with correct documentation, or
                <br />
                3. Issue a full refund of the purchase price
                <br />
                <br />
                Where a defective or incorrectly documented Part has caused an extended AOG, the Supplier is liable for reasonably foreseeable losses caused by the delay, including the cost of alternative sourcing and additional freight. This clause does not limit any other legal remedy available to Aircraft Program or the Client.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">8.4 Fraudulent Documentation — Strict Liability</h3>
              <p className="mb-3 text-destructive font-semibold">
                FRAUDULENT DOCUMENTATION: If a Supplier provides false Release Documentation, a fraudulent Back-to-Birth Trace, or any document that misrepresents the condition, history, origin, or regulatory status of a Part, the Supplier accepts unlimited liability for all losses arising from that fraud.
              </p>
              <p className="mb-4">
                This includes but is not limited to: cost of removal and replacement of the Part; inspection and rectification costs; any regulatory action, fine, or enforcement cost; legal costs; and reputational damage to Aircraft Program. No limitation of liability applies where the Supplier has provided fraudulent documentation. Aircraft Program will report any confirmed documentation fraud to the relevant airworthiness authority (FAA, EASA, UK CAA) without prior notice.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                9. Quality Assurance and Record Keeping
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">9.1 Regulatory Approvals</h3>
              <p className="mb-4">
                The Supplier must hold and maintain the regulatory approvals necessary to supply Parts with the Release Documentation specified in Aircraft Program's Purchase Orders. Aircraft Program may request evidence of current approval status at any time. Failure to maintain required approvals is grounds for immediate suspension from the Aircraft Program supplier network.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">9.2 Record Retention</h3>
              <p className="mb-2">
                The Supplier must retain all records relating to Parts supplied to Aircraft Program for a minimum of 8 years from the date of supply. Records must include:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>The original quotation and Purchase Order</li>
                <li>Release Documentation (copy)</li>
                <li>Traceability records — including Back-to-Birth Trace for LLPs</li>
                <li>Overhaul and repair records where applicable</li>
                <li>Export documentation</li>
                <li>Any inspection records, test results, or condition assessments</li>
              </ul>
              <p className="mb-4">
                On Aircraft Program's request, the Supplier must produce any such records within 5 business days. This obligation survives termination of any supply relationship between the parties.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">9.3 Recall and Airworthiness Directives</h3>
              <p>
                If any Part supplied to Aircraft Program is subsequently subject to a recall, mandatory action, or Airworthiness Directive requiring inspection, modification, or removal, the Supplier must notify Aircraft Program in writing within 24 hours of becoming aware of the requirement. The Supplier must provide all available documentation to support compliance action.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                10. Confidentiality
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">10.1 Supplier Confidentiality Obligations</h3>
              <p className="mb-2">The Supplier must treat as strictly confidential:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>The identity of the Client on whose behalf Aircraft Program is sourcing the Part</li>
                <li>The pricing, terms, and details of any Purchase Order placed by Aircraft Program</li>
                <li>Any information about Aircraft Program's supply chain, customer base, or operational procedures that comes to the Supplier's attention</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">10.2 Direct Contact with Operators</h3>
              <p>
                The Supplier must not seek to identify or contact the Client directly — whether during or after the transaction — for the purpose of offering parts or services outside the Aircraft Program supply arrangement. If the Supplier becomes aware of the Client's identity through the course of a transaction, that information must not be used for any commercial purpose outside the specific transaction.
                <br />
                <br />
                Breach of this clause entitles Aircraft Program to terminate all supply arrangements with the Supplier immediately and to pursue recovery of any losses arising from the breach.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                11. Limitation of Liability
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">11.1 Aircraft Program's Liability to the Supplier</h3>
              <p className="mb-4">
                Aircraft Program's maximum liability to the Supplier for any claim arising from these Terms or any purchase transaction — whether in contract, tort, or otherwise — is limited to the price paid by Aircraft Program for the specific Part to which the claim relates. Aircraft Program is not liable for loss of profit, anticipated profit, loss of opportunity, loss of contract, or consequential, indirect, or special losses.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">11.2 No Limitation on Supplier's Liability for Fraud or Wilful Misconduct</h3>
              <p>
                Nothing in these Terms limits the Supplier's liability to Aircraft Program or the Client for fraudulent misrepresentation, deliberate concealment, or wilful misconduct. Where the Supplier has provided fraudulent documentation, clause 8.4 applies and no limitation of liability is available to the Supplier.
              </p>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                12. Compliance, Anti-Bribery, and Sanctions
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">12.1 Anti-Bribery</h3>
              <p className="mb-4">
                The Supplier warrants that it has not offered, given, or agreed to give any payment, gift, or advantage to any person at Aircraft Program in connection with obtaining any supply arrangement or Purchase Order. The Supplier must comply with the Bribery Act 2010 (UK) and all equivalent legislation in the Supplier's jurisdiction. Breach of this clause entitles Aircraft Program to terminate all arrangements with the Supplier immediately without liability.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">12.2 Sanctions Compliance</h3>
              <p>
                The Supplier warrants that neither the Supplier nor any Part supplied under these Terms is subject to any applicable sanctions, trade restrictions, or export prohibitions imposed by the United Nations, the United States, the European Union, or the United Kingdom. Aircraft Program will not knowingly transact with any sanctioned party or in respect of any sanctioned aircraft or jurisdiction. The Supplier must notify Aircraft Program immediately if any sanctions issue arises in connection with a Purchase Order.
              </p>
            </div>

            {/* Section 13 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                13. Aircraft Program Supplier Network
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">13.1 Network Approval</h3>
              <p className="mb-4">
                Aircraft Program maintains an approved supplier network. Suppliers who regularly transact with Aircraft Program may be formally approved following assessment of regulatory compliance, documentation quality, response times, and transaction history. Approval is at Aircraft Program's discretion and may be withdrawn at any time.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">13.2 Performance Standards</h3>
              <p className="mb-2">Suppliers in the Aircraft Program network are assessed on:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Documentation accuracy — Release Documentation complete and correct on first presentation</li>
                <li>Response time — quotation provided within the RFQ deadline</li>
                <li>Lead time adherence — Parts despatched within confirmed lead time</li>
                <li>Communication — AWB and tracking details provided on despatch</li>
                <li>Core compliance — core charges credited within agreed timeframe</li>
                <li>Dispute resolution — warranty claims handled promptly and without unnecessary escalation</li>
              </ul>

              <h3 className="text-base font-bold text-foreground mb-2">13.3 Removal from Network</h3>
              <p>
                Aircraft Program may remove a Supplier from the approved network without notice where the Supplier provides inaccurate, incomplete, or fraudulent documentation; breaches confidentiality; becomes subject to regulatory investigations; fails to meet performance standards; or contacts a Client directly.
              </p>
            </div>

            {/* Section 14 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                14. General
              </h2>
              <h3 className="text-base font-bold text-foreground mb-2">14.1 Governing Law</h3>
              <p className="mb-4">
                These Terms and all purchase transactions under them are governed by the laws of England and Wales. Any dispute that cannot be resolved by negotiation will be referred to the courts of England and Wales, which shall have exclusive jurisdiction.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">14.2 Entire Agreement</h3>
              <p className="mb-4">
                These Terms constitute the entire agreement between Aircraft Program and the Supplier in respect of the supply of Parts. They supersede all previous representations, discussions, and agreements. No variation is effective unless agreed in writing by Aircraft Program.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">14.3 Supplier's Standard Terms</h3>
              <p className="mb-4">
                The Supplier's standard terms and conditions — whether printed on a quotation, delivery note, invoice, or any other document — do not apply and are expressly rejected, unless Aircraft Program has separately agreed in writing to incorporate specific provisions. The act of responding to an RFQ or accepting a PO constitutes acceptance of these Terms.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">14.4 Waiver & Severability</h3>
              <p className="mb-4">
                A failure by Aircraft Program to enforce any provision at any time does not constitute a waiver. If any provision is found to be invalid or unenforceable, it will be modified to the minimum extent necessary, and the remaining provisions will continue in full force.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">14.5 Notices & Third Party Rights</h3>
              <p className="mb-4">
                Notices must be in writing to info@aircraftprogram.com. The Client is an intended third-party beneficiary of the warranties and documentation obligations in clauses 5 and 8 of these Terms under the Contracts (Rights of Third Parties) Act 1999.
              </p>

              <h3 className="text-base font-bold text-foreground mb-2">14.6 Version</h3>
              <p>
                These Terms are version 1.0, effective 08 July 2026. Aircraft Program may update these Terms from time to time. The version in force at the time a Purchase Order is issued governs that transaction. Current Terms are available at www.aircraftprogram.com.
              </p>
            </div>

            {/* Contact details */}
            <div className="rounded-lg border border-border bg-muted/30 p-6 mt-10">
              <h3 className="text-lg font-bold text-foreground mb-4">Contact and Purchase Order Enquiries</h3>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="font-semibold text-foreground">Entity</p>
                  <p className="text-muted-foreground">Moon Jet Group Ltd trading as Aircraft Program</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Company No.</p>
                  <p className="text-muted-foreground">15121199</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Registered Address</p>
                  <p className="text-muted-foreground">Rmt Accountants & Business Advisors Ltd, Gosforth Park Avenue, Newcastle Upon Tyne, United Kingdom, NE12 8EG</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Purchase Orders / RFQs</p>
                  <p className="text-muted-foreground">info@aircraftprogram.com</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Website</p>
                  <p className="text-muted-foreground">www.aircraftprogram.com</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Telephone</p>
                  <p className="text-muted-foreground">+44 7402 465 194</p>
                </div>
              </div>
            </div>

            {/* Supplier Acceptance */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-6">
              <p className="font-bold text-foreground mb-2 uppercase tracking-wider text-sm">Supplier Acceptance</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                By responding to any RFQ from Aircraft Program, accepting any Purchase Order, or supplying any Part in response to an Aircraft Program request, the Supplier confirms that it has read and agrees to be bound by these Supplier Terms and Conditions in their entirety. These Terms take precedence over the Supplier's own standard terms except where Aircraft Program has separately agreed in writing.
              </p>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
