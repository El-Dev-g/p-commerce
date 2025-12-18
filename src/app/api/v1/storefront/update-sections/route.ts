
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { sections } = await request.json();

    if (!Array.isArray(sections)) {
      return NextResponse.json({ message: 'Invalid payload. "sections" must be an array.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'lib', 'homepage-sections.json');
    
    // The sections array is already serializable, no need to map it again
    const fileContent = JSON.stringify({ sections: sections }, null, 2);

    await fs.writeFile(filePath, fileContent, 'utf-8');

    return NextResponse.json({ message: 'Homepage sections updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Failed to update homepage sections:', error);
    return NextResponse.json({ message: 'Error updating homepage sections.' }, { status: 500 });
  }
}
