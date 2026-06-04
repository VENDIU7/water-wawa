// AI评分 API - 使用 DeepSeek API
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { taskTitle, taskDescription, requirements, userSubmission } = await request.json();

    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    });

    const prompt = `你是一个大学生技能任务的AI评审官。请对以下学生提交的任务进行评分和给出评语。

【任务名称】${taskTitle}
【任务描述】${taskDescription}
【任务要求】${requirements}
【学生提交】${userSubmission}

请从以下维度评分（每个维度1-5星）：
1. 完成度：是否满足任务要求
2. 思考深度：分析是否深入，有没有自己的思考
3. 表达质量：内容是否清晰、有结构

请用JSON格式返回（不要有其他内容）：
{
  "scores": {
    "completion": 数字(1-5),
    "depth": 数字(1-5),
    "expression": 数字(1-5)
  },
  "totalStars": 数字(1-5，四舍五入取整),
  "comment": "温暖鼓励的评语，50字以内，指出优点和可改进之处",
  "xpAward": 数字(根据表现给予经验值，范围10-100)
}`;

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.4,
    });

    const text = response.choices[0]?.message?.content || '';
    // 尝试解析JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return Response.json(result);
    }

    // 解析失败返回默认评分
    return Response.json({
      scores: { completion: 3, depth: 3, expression: 3 },
      totalStars: 3,
      comment: '你的任务提交已收到！继续加油，水滴娃相信你会越来越棒的！💧✨',
      xpAward: 30,
    });
  } catch (error) {
    console.error('Score API error:', error);
    return Response.json(
      {
        scores: { completion: 3, depth: 3, expression: 3 },
        totalStars: 3,
        comment: '评分系统正在漂流中...请稍后再试！🌊',
        xpAward: 20,
      },
      { status: 200 }
    );
  }
}
