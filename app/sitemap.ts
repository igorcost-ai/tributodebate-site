import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Busca os artigos na sua API pública
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/publico/tributario/artigos`)
  const artigos = await res.json()

  const urlArtigos = artigos.map((artigo: any) => ({
    url: `https://www.tributodebate.com.br/blog/${artigo.slug}`,
    lastModified: new Date(artigo.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Adiciona as páginas fixas
  return [
    {
      url: 'https://www.tributodebate.com.br',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://www.tributodebate.com.br/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...urlArtigos,
  ]
}