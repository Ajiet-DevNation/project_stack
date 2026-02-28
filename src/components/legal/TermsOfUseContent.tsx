import React from "react";

export default function TermsOfUseContent() {
  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground/70">Last Updated: February 2026</p>

      <section>
        <p className="text-muted-foreground leading-relaxed">
          By accessing ProjectStack, you agree to these Terms. If you disagree with any part, please discontinue use of the platform.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">1. Account Eligibility</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
          <li>You must be at least 13 years old</li>
          <li>You must be a student, educator, or verified user</li>
          <li>You are responsible for keeping your password confidential</li>
          <li>You must provide accurate information during registration</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">2. Acceptable Use</h3>
        <p className="text-muted-foreground text-sm mb-2.5">You must not:</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
          <li>Plagiarize or submit others' work as your own</li>
          <li>Engage in harassment, threats, or bullying</li>
          <li>Violate intellectual property or copyright laws</li>
          <li>Attempt to compromise platform security</li>
          <li>Post spam or misleading information</li>
          <li>Engage in any illegal activity</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">3. Intellectual Property</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
          <li>You retain ownership of content you create and share</li>
          <li>You grant us a license to operate and display your content</li>
          <li>ProjectStack owns all platform materials, logos, and software</li>
          <li>Proper attribution must be given when using others' work</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">4. Team Collaboration</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
          <li>Joining projects is voluntary</li>
          <li>Team members establish collaboration guidelines</li>
          <li>We provide mechanisms for resolving team conflicts</li>
          <li>All projects must maintain academic integrity</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">5. Service Disclaimer</h3>
        <p className="text-muted-foreground text-sm">
          ProjectStack is provided "as-is" without guarantees. We strive for high availability but cannot guarantee uninterrupted service. We may perform maintenance or updates that affect availability.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">6. Limitation of Liability</h3>
        <p className="text-muted-foreground text-sm">
          Our liability is limited to direct damages. We are not liable for indirect, incidental, or consequential damages.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">7. Termination</h3>
        <p className="text-muted-foreground text-sm">
          We may terminate or suspend your account if you violate these Terms. You can sign-out of your account anytime.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">8. Changes to These Terms</h3>
        <p className="text-muted-foreground text-sm">
          We may update these Terms. Significant changes will be notified via email. Continued use after changes constitutes acceptance.
        </p>
      </section>

    </div>
  );
}

