import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

const SEO = ({ 
  title = "QuitBoost | Protocolo de Liberdade Premium",
  description = "Domine o vício. Recupere sua órbita. O QuitBoost é o protocolo definitivo de 30 dias para liberdade do fumo.",
  keywords = "pare de fumar, app parar de fumar, quit smoking app, economia cigarro",
  ogImage = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d101beb7-aab3-4b89-b751-cd360f8b27b6/id-preview-d4160209--472472d1-5a84-410e-ae54-d41edfa865ab.lovable.app-1774142757620.png",
  ogUrl = window.location.href
}: SEOProps) => {
  useEffect(() => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', description);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', keywords);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', ogImage);

    const ogU = document.querySelector('meta[property="og:url"]');
    if (ogU) ogU.setAttribute('content', ogUrl);
  }, [title, description, keywords, ogImage, ogUrl]);

  return null;
};

export default SEO;
