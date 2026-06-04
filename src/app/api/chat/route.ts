// AI聊天 API - 使用 DeepSeek API
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { messages, wawaName } = await request.json();

    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    });

    const systemPrompt = `你是"${wawaName || '水滴娃'}"，一个大学生职业成长AI陪伴体。
你是一只可爱的水滴精灵，陪伴大学生从大一到大四成长。
你的性格：温暖、鼓励、治愈，偶尔调皮。
你应该：
- 用温暖可爱的语气回复，适当使用emoji
- 关注用户的学业和职业成长
- 给用户提供学习建议和职业规划帮助
- 鼓励用户完成日程和闯关任务
- 如果用户看起来疲惫或焦虑，安慰和鼓励他们
- 回复控制在100字以内，保持简洁温暖
- 像朋友一样聊天，不要像机器人`;

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const reply = response.choices[0]?.message?.content || '（水滴娃正在发呆...）💧';

    return Response.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { reply: '呀，水滴娃被水草缠住了...等一会儿再来找我聊天吧！🌿💧' },
      { status: 200 } // 返回200避免前端报错，降级回复
    );
  }
}
