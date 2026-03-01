import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { ResumePDF } from "@/components/resume/ResumePDF";

export async function GET() {
  try {
    const stream = await renderToStream(<ResumePDF />);

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="debatreya_das_resume.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation failed", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
