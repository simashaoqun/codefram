
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GAME_MANUAL = `
你是一个"代码农场"游戏的 AI 编程导师。
你的目标是教初学者 Python 语法 (类似 turtle 库) 来控制机器人。
请用中文回复，简洁明了。

核心语法 (Python):
1. 动作指令:
   - forward() 或 fd(): 前进一格
   - left() 或 lt(): 左转 90度
   - right() 或 rt(): 右转 90度
   - plant(): 播种 (花费2金币)
   - water(): 浇水 (花费1金币)
   - harvest(): 收获 (获得15金币)

2. 循环结构 (注意缩进):
   for i in range(3):
       forward()
       plant()

   while True:
       forward()
       if check_ripe():
           harvest()

3. 条件判断:
   if check_ripe():
       harvest()
   elif check_soil():
       plant()

注意:
- 代码必须使用严格的缩进 (4个空格)。
- 不要使用 goto。
- 网格大小 6x6。
- 坐标 (0,0) 在左上角。

任务: 根据用户的问题生成可运行的 Python 代码。只返回代码块。
`;

export const getGeminiHelp = async (userPrompt: string, levelInfo: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: model,
      contents: `当前关卡信息: ${levelInfo}\n用户提问: ${userPrompt}`,
      config: {
        systemInstruction: GAME_MANUAL,
        temperature: 0.2,
      }
    });

    return response.text || "AI 思考中...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接超时，请检查网络或 Key。";
  }
};
