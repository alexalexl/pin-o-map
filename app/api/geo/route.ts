export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const country =
    request.headers.get('x-vercel-ip-country')

  const mapMode =
    country === 'RU' ? 'ru' : 'intl'

  return Response.json(
    {
      country,
      mapMode
    },
    {
      headers: {
        'Cache-Control': 'private, no-store'
      }
    }
  )
}