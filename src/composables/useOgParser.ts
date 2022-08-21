export type OgParam = {
  url?: string
  title?: string
  description?: string
  siteName?: string
  image?: string
}

export const useOgParser = () => {
  const get = async (url?: string) => {
    if (!url) return

    try {
      // API を叩く
      const res = await fetch(url, {
        headers: {
          'Accept'       : 'application/json',
          'Content-Type' : 'application/json',
          'User-Agent'   : 'MY-UA-STRING'
        },
      })
      const body = await res.text()
      const doc = (new DOMParser()).parseFromString(body, 'text/html')

      // 解析する
      let ogUrl = doc.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content
      let ogTitle = doc.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content
      let ogDescription = doc.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.content
      const ogSiteName = doc.querySelector<HTMLMetaElement>('meta[property="og:site_name"]')?.content
      const ogImage = doc.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content

      if (!ogUrl) { ogUrl = url }
      if (!ogTitle) { ogTitle = doc.querySelector<HTMLMetaElement>('title')?.textContent ?? undefined }
      if (!ogDescription) { ogDescription = doc.querySelector<HTMLMetaElement>('neta[name="description"]')?.content }

      const og: OgParam = {
        url: ogUrl,
        title: ogTitle,
        description: ogDescription,
        siteName: ogSiteName,
        image: ogImage,
      }

      return og
    } catch (err) {
      console.error(err)
    }
  }

  return {
    get,
  }
}
