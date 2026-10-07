import { ContentBlock } from "@/components/ContentBlock";
import { PageHero } from "@/components/PageHero";

export default function Complaints() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHero
        overline="Dispute Resolution"
        title="Complaints & Dispute Resolution"
        subtitle="We value your feedback and take all concerns seriously. Here's how we handle complaints."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <ContentBlock className="prose-headings:text-[#0D6851] prose-strong:text-[#022F35] prose-a:break-words">
            <p>
              In the event of a complaint, we take this with priority to resolve and ensure the integrity of our services to you. If you have any complaints about the services provided to you, you should take the following steps:
            </p>

            <ol className="space-y-8 marker:text-[#0D6851] marker:font-semibold">
              <li>
                Contact your Authorised Representative and tell them about your complaint.
              </li>
              <li>
                <p>
                  If your complaint is not satisfactorily resolved within three working days, please contact the Apex Macro Financial Group Pty. Ltd. in writing. Your complaint can be sent to:
                </p>
                <p>
                  772A Station Street, Box Hill North. VIC 3128<br />
                  or email <a href="mailto:info@apexmacro.com.au">info@apexmacro.com.au</a>
                </p>
              </li>
              <li>
                <p>
                  Apex Macro Financial Group Pty. Ltd. will endeavour to resolve all complaints within 45 days of lodgement. Should there be special circumstances relating to the complaint, such that it is not reasonable for the complaint to be resolved in that time, Apex Macro Financial Group Pty. Ltd. will inform you of the reasons for the delay. We may request an extension of time up to a total of 90 days.
                </p>
              </li>
              <li>
                If Apex Macro Financial Group Pty. Ltd. has not responded within 45 (or 90) days or you are not satisfied with the response, you can lodge a dispute with the Financial Ombudsman Service. This service is provided to you free of charge.
              </li>
            </ol>

            <p>You may lodge a complaint with AFCA if:</p>
            <p>
              Your complaint relates to a Apex Macro Financial group service; and you are not satisfied with our response after 30 days.
            </p>
            <p>
              Apex Macro Financial Group is a member of AFCA, you can contact AFCA via the following:
            </p>

            <address className="not-italic rounded-lg bg-[#D7DCC7] p-6 sm:p-8 my-8 text-[#022F35] leading-relaxed">
              <strong>Australian Financial Complaints Authority</strong><br />
              GPO Box 3, Melbourne VIC 3001<br />
              Tel: <a href="tel:1800931678">1800 931 678</a> (free call)<br />
              Email: <a href="mailto:info@afca.org.au">info@afca.org.au</a><br />
              Website: <a href="https://www.afca.org.au" target="_blank" rel="noopener noreferrer">www.afca.org.au</a>
            </address>

            <p>
              The Australian Securities and Investments Commission (ASIC) also has a free call info line on <a href="tel:1300300630">1300 300 630</a> which you may use to make a complaint and obtain information about your rights.
            </p>

            <h2 className="border-t border-muted/50 pt-8" style={{ color: "#0D6851" }}>Complying compensation arrangements</h2>
            <p>
              Apex Macro Financial Group has Professional Indemnity Insurance in line with legislative requirements. This includes coverage for claims in relation to the conduct of current and former advisers (no longer authorised by Apex Macro Financial Group). If you would like more information, please contact us.
            </p>
          </ContentBlock>
        </div>
      </section>
    </div>
  );
}
