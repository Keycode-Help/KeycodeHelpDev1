import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  canonical = false,
}) => {
  const siteName = "KeycodeHelp";
  const defaultDescription =
    "Professional vehicle keycode lookup services for locksmiths. Get accurate, reliable keycode information for automotive needs.";
  const defaultImage = "https://keycodehelp.com/og-image.jpg";
  const baseUrl = "https://keycodehelp.com";

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullDescription = description || defaultDescription;
  const fullImage = image || defaultImage;
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;

  useEffect(() => {
    // Update document title for accessibility
    document.title = fullTitle;
  }, [fullTitle]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={fullUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={fullImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={siteName} />

      {/* Structured Data for Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "KeycodeHelp",
          description: fullDescription,
          url: baseUrl,
          logo: "https://keycodehelp.com/logo.png",
          image: fullImage,
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "support@keycodehelp.com",
          },
          serviceType: "Vehicle Keycode Lookup Services",
          areaServed: "Worldwide",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Automotive Keycode Services",
          },
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
