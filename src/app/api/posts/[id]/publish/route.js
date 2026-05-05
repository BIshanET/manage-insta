import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    if (!accessToken || !businessAccountId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Instagram credentials not configured in .env.local' 
      }, { status: 500 });
    }

    // Step 1: Create a media container
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${businessAccountId}/media?image_url=${encodeURIComponent(post.imageUrl)}&caption=${encodeURIComponent(post.caption)}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    const containerData = await containerResponse.json();

    if (containerData.error) {
      throw new Error(`Step 1 Error: ${containerData.error.message}`);
    }

    const creationId = containerData.id;

    // Step 2: Publish the media container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${businessAccountId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    const publishData = await publishResponse.json();

    if (publishData.error) {
      throw new Error(`Step 2 Error: ${publishData.error.message}`);
    }

    // Update post status in DB
    post.status = 'published';
    await post.save();

    return NextResponse.json({ success: true, data: publishData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
