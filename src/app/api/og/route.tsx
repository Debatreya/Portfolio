import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse parameters
    const title = searchParams.get('title') || 'Debatreya Das | Developer OS';
    
    // Shorten description if it's too long
    let description = searchParams.get('description');
    if (description && description.length > 130) {
      description = description.slice(0, 130) + '...';
    }
    
    const label = searchParams.get('label');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#09090b', // Zinc 950
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top subtle gradient line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              display: 'flex',
              background: 'linear-gradient(90deg, #3b82f6, #10b981)', // Blue to Emerald
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {label && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <div
                  style={{
                    color: '#10b981', // Emerald
                    fontSize: '28px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: 'monospace',
                  }}
                >
                  {label}
                </div>
              </div>
            )}
            
            <div
              style={{
                color: '#fafafa', // Zinc 50
                fontSize: '80px',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            {description && (
              <div
                style={{
                  color: '#a1a1aa', // Zinc 400
                  fontSize: '36px',
                  lineHeight: 1.4,
                  maxWidth: '850px',
                  marginTop: '16px',
                }}
              >
                {description}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '2px solid #27272a', // Zinc 800
              paddingTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#fafafa',
                  color: '#09090b',
                  fontSize: '24px',
                  fontWeight: 800,
                }}
              >
                OS
              </div>
              <div
                style={{
                  display: 'flex',
                  color: '#fafafa',
                  fontSize: '36px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                Developer OS
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                color: '#71717a', // Zinc 500
                fontSize: '28px',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}
            >
              debatreyadas.dev
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
