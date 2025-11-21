import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    console.log('[UPLOAD] Starting upload...')
    console.log('[UPLOAD] Supabase URL:', supabaseUrl)
    console.log('[UPLOAD] Service key exists:', !!supabaseServiceKey)

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string

    console.log('[UPLOAD] File:', file?.name, 'Size:', file?.size)
    console.log('[UPLOAD] fileName:', fileName)

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'Fichier ou nom de fichier manquant' },
        { status: 400 }
      )
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 50MB)' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé' },
        { status: 400 }
      )
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Convert file to buffer
    console.log('[UPLOAD] Converting to buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('[UPLOAD] Buffer size:', buffer.length)

    // Upload to Supabase Storage
    console.log('[UPLOAD] Uploading to Supabase Storage...')
    const { data, error } = await supabase.storage
      .from('hero')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    console.log('[UPLOAD] Upload result:', { data, error })

    if (error) {
      console.error('[UPLOAD] Supabase upload error:', error)
      throw new Error(error.message)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('hero')
      .getPublicUrl(fileName)

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}
