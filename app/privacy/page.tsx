export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: [DATE]</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, such as when you create an account, 
              join our waitlist, or communicate with us. This may include your name, email address, 
              and any other information you choose to provide.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our services, 
              communicate with you, and for other purposes as described to you at the time of collection.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Your Rights</h2>
            <p className="text-muted-foreground">
              You may access, update, or delete your personal information at any time by contacting us 
              or through your account dashboard. Subject to applicable law, you may also have the right 
              to object to processing, request restriction of processing, or data portability.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this privacy policy, please contact us at [contact email].
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}