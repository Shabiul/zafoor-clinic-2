import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <main className="privacy-page" id="privacy-policy">
      <div className="container">
        {/* Breadcrumb navigation */}
        <nav className="privacy-breadcrumbs" aria-label="Breadcrumb">
          <ol itemScope itemType="https://schema.org/BreadcrumbList">
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <a href="/" itemProp="item">
                <span itemProp="name">Home</span>
              </a>
              <meta itemProp="position" content="1" />
            </li>
            <li aria-hidden="true" className="breadcrumb-separator">
              /
            </li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <span itemProp="name" aria-current="page">
                Privacy Policy
              </span>
              <meta
                itemProp="item"
                content="https://zafoorclinic.com/privacy-policy/"
              />
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="privacy-header">
          <p className="eyebrow">Legal &amp; Compliance</p>
          <h1 className="privacy-title">PRIVACY POLICY</h1>
          <p className="privacy-updated">
            <strong>Last Updated:</strong> August 21, 2026
          </p>
          <div className="divider"></div>
          <div className="privacy-lead">
            <p>
              Zafoor Clinic (&ldquo;Zafoor Clinic&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting the personal information that you provide when using our website, booking an appointment, contacting us, or communicating with the clinic.
            </p>
            <p>
              This Privacy Policy explains what information we collect, why we collect it, how it may be used, how it may be shared, and the choices and rights available to you.
            </p>
            <p>
              Our public website is:{" "}
              <a href="https://zafoorclinic.com/">https://zafoorclinic.com/</a>
            </p>
            <p>
              Our clinic&rsquo;s internal administrative and patient-management system operates separately at:{" "}
              <a href="https://crm.zafoorclinic.com/">https://crm.zafoorclinic.com/</a>
            </p>
            <p>
              The CRM is an internal system and is not intended for public browsing.
            </p>
          </div>
        </header>

        {/* Table of Contents */}
        <aside className="privacy-toc glass-panel" aria-label="Table of contents">
          <h2 className="privacy-toc-title">Table of Contents</h2>
          <ol className="privacy-toc-list">
            <li><a href="#information-we-collect">Information We Collect</a></li>
            <li><a href="#how-we-use-your-information">How We Use Your Information</a></li>
            <li><a href="#healthcare-and-sensitive-information">Healthcare and Sensitive Information</a></li>
            <li><a href="#how-we-share-information">How We Share Information</a></li>
            <li><a href="#appointment-and-communication-data">Appointment and Communication Data</a></li>
            <li><a href="#whatsapp-and-external-links">WhatsApp and External Links</a></li>
            <li><a href="#google-maps-and-third-party-content">Google Maps and Third-Party Content</a></li>
            <li><a href="#cookies-and-similar-technologies">Cookies and Similar Technologies</a></li>
            <li><a href="#data-retention">Data Retention</a></li>
            <li><a href="#data-security">Data Security</a></li>
            <li><a href="#your-rights-and-choices">Your Rights and Choices</a></li>
            <li><a href="#how-to-exercise-your-rights">How to Exercise Your Rights</a></li>
            <li><a href="#childrens-privacy">Children&rsquo;s Privacy</a></li>
            <li><a href="#third-party-websites-and-services">Third-Party Websites and Services</a></li>
            <li><a href="#international-or-cross-border-processing">International or Cross-Border Processing</a></li>
            <li><a href="#changes-to-this-privacy-policy">Changes to This Privacy Policy</a></li>
            <li><a href="#applicable-data-protection-framework">Applicable Data-Protection Framework</a></li>
            <li><a href="#contact-information">Contact Information</a></li>
          </ol>
        </aside>

        {/* Privacy Policy Content */}
        <article className="privacy-content">
          {/* Section 1 */}
          <section id="information-we-collect" className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>
              Depending on how you interact with Zafoor Clinic, we may collect the following information.
            </p>

            <h3>1.1 Appointment Booking</h3>
            <p>
              When you use the online appointment booking facility, we may collect:
            </p>
            <ul>
              <li>First name</li>
              <li>Last name, when provided</li>
              <li>Mobile phone number</li>
              <li>Email address, when provided</li>
              <li>Gender, when provided</li>
              <li>Selected service or treatment</li>
              <li>Selected doctor</li>
              <li>Appointment date and time</li>
              <li>Reason for visit, when provided</li>
            </ul>
            <p>
              The appointment information submitted through the website is transmitted to our clinic&rsquo;s appointment-management system for processing and managing your appointment.
            </p>

            <h3>1.2 Contact and Enquiry Forms</h3>
            <p>
              When you submit an enquiry through our contact form, we may collect:
            </p>
            <ul>
              <li>Name</li>
              <li>Phone number</li>
              <li>Department or service selected</li>
              <li>Message or enquiry submitted by you</li>
            </ul>
            <p>
              Website enquiries are delivered to the clinic&rsquo;s designated email address through our form-processing provider.
            </p>

            <h3>1.3 Information You Provide During Clinic Care</h3>
            <p>
              If you become a patient of Zafoor Clinic, additional information may be collected and maintained through our clinic&rsquo;s internal systems as necessary for patient administration and healthcare operations.
            </p>
            <p>
              Depending on the services you receive, this may include information such as:
            </p>
            <ul>
              <li>Contact and identification information</li>
              <li>Date of birth</li>
              <li>Gender</li>
              <li>Address</li>
              <li>Emergency-contact information</li>
              <li>Insurance information</li>
              <li>Medical history</li>
              <li>Allergies</li>
              <li>Chronic conditions</li>
              <li>Medical alerts</li>
              <li>Clinical notes</li>
              <li>Symptoms and complaints</li>
              <li>Vitals</li>
              <li>Diagnoses</li>
              <li>Prescriptions</li>
              <li>Treatment and encounter information</li>
              <li>Relevant medical documents</li>
              <li>Appointment and billing information</li>
              <li>Communication preferences</li>
            </ul>
            <p>
              Such information is handled as part of the clinic&rsquo;s patient-care and administrative operations and is not required merely to browse the public website.
            </p>

            <h3>1.4 Technical Information</h3>
            <p>
              When you access our website, certain technical information may be processed automatically by web browsers, hosting infrastructure, security systems, or third-party services. Depending on the service involved, this may include information such as:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser and device information</li>
              <li>Operating-system information</li>
              <li>Referring page</li>
              <li>Requested pages or resources</li>
              <li>Approximate technical and usage information</li>
            </ul>
            <p>
              We use such information where necessary for website operation, security, troubleshooting, and service delivery.
            </p>
          </section>

          {/* Section 2 */}
          <section id="how-we-use-your-information" className="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>
              We may use information collected through the website and our clinic systems for purposes including:
            </p>
            <ul>
              <li>Processing appointment requests and bookings</li>
              <li>Managing appointment schedules</li>
              <li>Contacting you regarding your appointment</li>
              <li>Responding to enquiries</li>
              <li>Providing requested healthcare services</li>
              <li>Maintaining patient and appointment records</li>
              <li>Communicating with patients regarding clinic services and appointments</li>
              <li>Managing clinic operations</li>
              <li>Maintaining billing and administrative records where applicable</li>
              <li>Protecting the security and integrity of our systems</li>
              <li>Detecting, preventing, or investigating misuse, fraud, or security incidents</li>
              <li>Meeting applicable legal, regulatory, accounting, or record-keeping obligations</li>
              <li>Improving the operation and usability of our website and services</li>
            </ul>
            <p>
              We do not use your personal information for unrelated purposes without an appropriate basis for doing so.
            </p>
          </section>

          {/* Section 3 */}
          <section id="healthcare-and-sensitive-information" className="privacy-section">
            <h2>3. Healthcare and Sensitive Information</h2>
            <p>
              Information relating to a person&rsquo;s health may be particularly sensitive.
            </p>
            <p>
              We request only information that is reasonably relevant to the interaction for which it is collected.
            </p>
            <p>
              Information provided in an appointment&rsquo;s &ldquo;reason for visit&rdquo; field should contain only information you are comfortable providing for appointment-management purposes. Detailed medical records should be discussed through appropriate clinic channels rather than submitted unnecessarily through a public website form.
            </p>
            <p>
              Healthcare information that becomes part of your patient record is handled through the clinic&rsquo;s internal systems and is accessed only by authorized personnel according to their responsibilities and permissions.
            </p>
          </section>

          {/* Section 4 */}
          <section id="how-we-share-information" className="privacy-section">
            <h2>4. How We Share Information</h2>
            <p>
              We do not sell your personal information.
            </p>
            <p>
              We may share or permit access to personal information where reasonably necessary to provide our services, operate our systems, or comply with applicable law.
            </p>
            <p>
              This may include:
            </p>

            <h3>4.1 Clinic Staff and Authorized Personnel</h3>
            <p>
              Authorized doctors, healthcare personnel, administrative personnel, and other staff may access information required to perform their assigned responsibilities.
            </p>
            <p>
              Access within the clinic&rsquo;s internal systems may be controlled through authentication and role-based permissions.
            </p>

            <h3>4.2 Technology and Service Providers</h3>
            <p>
              We may use service providers that process information on our behalf or provide infrastructure required to operate the website and clinic systems.
            </p>
            <p>
              For example, the website currently uses a third-party form-processing service, FormSubmit, for the public contact form. Information submitted through that form may pass through the service for delivery to the clinic.
            </p>
            <p>
              We may also use hosting, storage, communications, security, mapping, or other technical providers where required to operate the website and clinic systems.
            </p>

            <h3>4.3 Legal and Regulatory Requirements</h3>
            <p>
              We may disclose information where necessary to:
            </p>
            <ul>
              <li>comply with applicable law or legal process;</li>
              <li>respond to lawful requests from competent authorities;</li>
              <li>protect the rights, safety, or property of the clinic, our patients, staff, or others; or</li>
              <li>investigate suspected fraud, abuse, or security incidents.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="appointment-and-communication-data" className="privacy-section">
            <h2>5. Appointment and Communication Data</h2>
            <p>
              If you provide your mobile number, email address, or other contact information while requesting an appointment, we may use it to communicate with you about:
            </p>
            <ul>
              <li>Your appointment</li>
              <li>Appointment confirmation</li>
              <li>Appointment changes or cancellations</li>
              <li>Relevant clinic communications</li>
              <li>Responses to enquiries you initiated</li>
            </ul>
            <p>
              Providing information for appointment-related communication does not automatically mean that you have consented to unrelated promotional communications.
            </p>
            <p>
              Where marketing or promotional communication requires consent, we will seek consent as required by applicable law.
            </p>
          </section>

          {/* Section 6 */}
          <section id="whatsapp-and-external-links" className="privacy-section">
            <h2>6. WhatsApp and External Links</h2>
            <p>
              The website provides links that may allow you to contact the clinic through WhatsApp or other external communication services.
            </p>
            <p>
              When you choose to use an external service, your interaction may be governed by that service provider&rsquo;s own terms and privacy policy.
            </p>
            <p>
              Zafoor Clinic does not control how an external platform independently processes information once you leave our website.
            </p>
          </section>

          {/* Section 7 */}
          <section id="google-maps-and-third-party-content" className="privacy-section">
            <h2>7. Google Maps and Third-Party Content</h2>
            <p>
              Our website may display third-party content or services, including an embedded map for the clinic location.
            </p>
            <p>
              Third-party services may process technical information according to their own privacy policies.
            </p>
            <p>
              Your use of such third-party services is subject to the respective provider&rsquo;s terms and privacy practices.
            </p>
          </section>

          {/* Section 8 */}
          <section id="cookies-and-similar-technologies" className="privacy-section">
            <h2>8. Cookies and Similar Technologies</h2>
            <p>
              Our website may use cookies or similar technical mechanisms that are necessary for the operation, security, performance, or functionality of the website or third-party services embedded in it.
            </p>
            <p>
              Some third-party services may also use cookies or similar technologies according to their own policies.
            </p>
            <p>
              You can control or restrict cookies through your browser settings. Blocking certain cookies or browser storage mechanisms may affect some website functionality.
            </p>
          </section>

          {/* Section 9 */}
          <section id="data-retention" className="privacy-section">
            <h2>9. Data Retention</h2>
            <p>
              We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including appointment management, healthcare delivery, patient records, administrative requirements, security, dispute resolution, and compliance with applicable legal or regulatory obligations.
            </p>
            <p>
              Healthcare and clinical records may need to be retained for longer periods than ordinary website enquiries because of applicable professional, legal, operational, or record-keeping requirements.
            </p>
            <p>
              When information is no longer required and there is no continuing lawful reason to retain it, we may securely delete, anonymize, or otherwise dispose of it.
            </p>
          </section>

          {/* Section 10 */}
          <section id="data-security" className="privacy-section">
            <h2>10. Data Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect personal information against unauthorized access, misuse, loss, alteration, disclosure, or destruction.
            </p>
            <p>
              These measures may include:
            </p>
            <ul>
              <li>Authentication and access controls</li>
              <li>Role-based access within internal systems</li>
              <li>Secure transmission where supported</li>
              <li>Access restrictions for clinic personnel</li>
              <li>Audit and operational controls</li>
              <li>Appropriate system and application security measures</li>
            </ul>
            <p>
              However, no internet transmission or electronic storage system can be guaranteed to be completely secure.
            </p>
            <p>
              You should avoid submitting unnecessary sensitive information through public website forms.
            </p>
          </section>

          {/* Section 11 */}
          <section id="your-rights-and-choices" className="privacy-section">
            <h2>11. Your Rights and Choices</h2>
            <p>
              Subject to applicable law and its effective provisions, you may have rights relating to your personal data, including rights to:
            </p>
            <ul>
              <li>Request information about the personal data we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion or erasure where applicable</li>
              <li>Withdraw consent where processing is based on consent</li>
              <li>Raise a complaint regarding the processing of your personal data</li>
              <li>Exercise other rights available under applicable data-protection law</li>
            </ul>
            <p>
              Certain rights may be subject to legal, medical, regulatory, contractual, or other lawful limitations.
            </p>
            <p>
              Where consent is the basis for processing, withdrawing consent does not necessarily affect processing that was lawfully carried out before withdrawal.
            </p>
          </section>

          {/* Section 12 */}
          <section id="how-to-exercise-your-rights" className="privacy-section">
            <h2>12. How to Exercise Your Rights</h2>
            <p>
              To ask a privacy-related question, request access or correction, request deletion where applicable, withdraw consent, or raise a privacy complaint, contact us using:
            </p>
            <ul>
              <li>
                Email: <a href="mailto:ZafoorClinic@gmail.com">ZafoorClinic@gmail.com</a>
              </li>
              <li>
                Phone: <a href="tel:8940399403">89403 99403</a>
              </li>
            </ul>
            <p>
              When making a request, please provide enough information for us to identify the relevant interaction or record.
            </p>
            <p>
              We may need to verify your identity before responding to requests involving personal information.
            </p>
          </section>

          {/* Section 13 */}
          <section id="childrens-privacy" className="privacy-section">
            <h2>13. Children&rsquo;s Privacy</h2>
            <p>
              Our website is intended for general users and may be used by a parent or legal guardian when arranging healthcare for a child.
            </p>
            <p>
              Where information about a child is provided for healthcare or appointment purposes, it should be provided by the child&rsquo;s parent, legal guardian, or another person legally authorized to do so.
            </p>
            <p>
              We do not knowingly seek unnecessary personal information from children through general website enquiries.
            </p>
          </section>

          {/* Section 14 */}
          <section id="third-party-websites-and-services" className="privacy-section">
            <h2>14. Third-Party Websites and Services</h2>
            <p>
              Our website may contain links, embeds, or integrations provided by third parties.
            </p>
            <p>
              Examples may include:
            </p>
            <ul>
              <li>WhatsApp</li>
              <li>Google Maps</li>
              <li>FormSubmit</li>
              <li>Hosting or infrastructure providers</li>
              <li>Other external services used to provide website functionality</li>
            </ul>
            <p>
              Once you interact directly with a third-party service, its own privacy policy and terms may apply.
            </p>
            <p>
              We recommend reviewing the privacy practices of those third parties where appropriate.
            </p>
          </section>

          {/* Section 15 */}
          <section id="international-or-cross-border-processing" className="privacy-section">
            <h2>15. International or Cross-Border Processing</h2>
            <p>
              Some technology or service providers used to operate the website may process or store information in locations outside India.
            </p>
            <p>
              Where such processing occurs, we take reasonable steps to use appropriate service providers and safeguards consistent with applicable law.
            </p>
          </section>

          {/* Section 16 */}
          <section id="changes-to-this-privacy-policy" className="privacy-section">
            <h2>16. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes to:
            </p>
            <ul>
              <li>Our services</li>
              <li>Website functionality</li>
              <li>Technology providers</li>
              <li>Data-processing practices</li>
              <li>Applicable laws or regulations</li>
            </ul>
            <p>
              The updated version will be published on this page with a revised &ldquo;Last Updated&rdquo; date.
            </p>
            <p>
              We encourage you to review this page periodically.
            </p>
          </section>

          {/* Section 17 */}
          <section id="applicable-data-protection-framework" className="privacy-section">
            <h2>17. Applicable Data-Protection Framework</h2>
            <p>
              Zafoor Clinic intends to handle personal information in accordance with applicable Indian data-protection and privacy requirements, including the Digital Personal Data Protection Act, 2023 and applicable rules and regulations as and when their relevant provisions apply to the clinic and its processing activities.
            </p>
            <p>
              Nothing in this Privacy Policy limits any rights available to you under applicable law.
            </p>
          </section>

          {/* Section 18 */}
          <section id="contact-information" className="privacy-section privacy-contact-section">
            <h2>18. Contact Information</h2>
            <div className="privacy-contact-card glass-panel">
              <p className="privacy-contact-brand">Zafoor Clinic</p>
              <address className="privacy-address">
                No. 69/68, St. Xavier Street<br />
                George Town, Chennai – 600001<br />
                <span className="privacy-landmark">Landmark: Opposite Huda Mosque</span>
              </address>
              <div className="privacy-contact-details">
                <p>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:8940399403">89403 99403</a>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:ZafoorClinic@gmail.com">ZafoorClinic@gmail.com</a>
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href="https://zafoorclinic.com/">https://zafoorclinic.com/</a>
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
