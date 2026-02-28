import React from "react";

export default function PrivacyPolicyContent() {
  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground/70">Last Updated: February 2026</p>

      <section>
        <p className="text-muted-foreground leading-relaxed">
          ProjectStack is committed to protecting your privacy. We collect and use information solely to provide and improve our platform.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">Information We Collect</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
          <li>Account details: name, email, university, and academic field</li>
          <li>Profile data: photo, bio, skills, and preferences</li>
          <li>Project information: descriptions, team details, and communications</li>
          <li>Platform usage: pages visited, device info, and IP address</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">How We Use Your Information</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
          <li>Account management and service delivery</li>
          <li>Team formation and collaboration</li>
          <li>Platform security and fraud prevention</li>
          <li>Customer support and communications</li>
          <li>Service improvement and analytics</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">Information Sharing</h3>
        <p className="text-muted-foreground text-sm mb-2.5">We share information with:</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
          <li>Project team members (profile and project details)</li>
          <li>Third-party services for authentication and hosting (Google, GitHub, AWS)</li>
          <li>Universities for academic verification</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">Data Security</h3>
        <p className="text-muted-foreground text-sm">
          We use encryption, access controls, and regular security assessments to protect your data.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">Your Rights</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
          <li>Access and review your personal information</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and data</li>
          <li>Control communication preferences</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">Data Retention</h3>
        <p className="text-muted-foreground text-sm">
          We retain your data as long as your account is active. You can request deletion at any time by contacting us.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-foreground mb-2.5">Changes to This Policy</h3>
        <p className="text-muted-foreground text-sm">
          We may update this policy periodically. Significant changes will be notified via email or platform notification.
        </p>
      </section>
    </div>
  );
}
