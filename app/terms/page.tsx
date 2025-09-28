export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: [DATE]</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using OctopusClips, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily download one copy of the materials on OctopusClips 
              for personal, non-commercial transitory viewing only.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Disclaimer</h2>
            <p className="text-muted-foreground">
              The materials on OctopusClips are provided on an 'as is' basis. OctopusClips makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other warranties 
              including, without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Limitations</h2>
            <p className="text-muted-foreground">
              In no event shall OctopusClips or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or due to 
              business interruption) arising out of the use or inability to use the materials 
              on OctopusClips.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Accuracy of Materials</h2>
            <p className="text-muted-foreground">
              The materials appearing on OctopusClips could include technical, typographical, 
              or photographic errors. OctopusClips does not warrant that any of the materials 
              on its website are accurate, complete or current.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">Changes</h2>
            <p className="text-muted-foreground">
              OctopusClips may revise these terms of service at any time without notice. 
              By using this website you are agreeing to be bound by the then current version 
              of these terms of service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}