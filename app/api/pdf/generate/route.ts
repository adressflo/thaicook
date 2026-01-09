import { DevisTemplate, type DevisTemplateData } from "@/components/pdf/templates/DevisTemplate"
import { NextRequest, NextResponse } from "next/server"
import { chromium } from "playwright"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  let browser

  try {
    const data: DevisTemplateData = await request.json()

    // Render React component to HTML string
    const html = renderToStaticMarkup(React.createElement(DevisTemplate, { data }))

    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: "networkidle" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
    })

    await browser.close()

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${data.docRef || "document"}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    if (browser) await browser.close()
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
