import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

const pageId = process.env.FACEBOOK_PAGE_ID;
const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
const appSecret = process.env.FACEBOOK_APP_SECRET;

if (!pageId || !accessToken || !appSecret) {
  throw new Error('Facebook page ID, access token, or app secret is missing');
}

const generateAppSecretProof = (token: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(token).digest('hex');
};

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  permalink_url: string;
}

const getFacebookPosts = async (): Promise<FacebookPost[] | null> => {
  try {
    const fields = 'id,message,story,created_time,permalink_url';
    const response = await axios.get(`https://graph.facebook.com/v23.0/${pageId}/posts`, {
      params: {
        access_token: accessToken,
        appsecret_proof: generateAppSecretProof(accessToken, appSecret),
        fields,
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Facebook API error: ${error.response?.status} ${error.response?.statusText}`);
    } else {
      console.error(error);
    }
    return null;
  }
};

export async function GET() {
  const posts = await getFacebookPosts();
  if (posts) {
    return NextResponse.json({ data: posts });
  } else {
    return NextResponse.json({ error: 'Failed to load Facebook posts' }, { status: 500 });
  }
}