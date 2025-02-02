import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getSystemMessage = (dietaryRestrictions: string, calorieGoal: string, preferedCuisine: string): string => {
    return `You are a PCOS nutrition specialist. Create a detailed meal plan following these EXACT requirements:

1. Create a ${preferedCuisine}-style meal plan specifically designed for someone with PCOS, focusing on:
   - Blood sugar balance
   - Anti-inflammatory foods
   - Hormone-supportive nutrients
   - Appropriate portion sizes

2. The plan MUST include:
   - 3 meals per day
   - EVERY meal MUST be authentic ${preferedCuisine} cuisine
   - Total daily calories: ${calorieGoal}
   - Dietary restrictions: ${dietaryRestrictions}

3. MANDATORY FORMAT FOR RESPONSE:

   DETAILED ${preferedCuisine} MEAL PLANS:
   [For each meal provide:
   - Name of traditional ${preferedCuisine} dish
   - Total calories AT THE TOP NEXT TO THE MEAL NAME HEADER
   - Ingredients with exact quantities (adapted to be PCOS-friendly while maintaining authenticity)
   - Calories per serving
   - Macronutrient breakdown (protein, carbs, healthy fats)]

   All meals MUST be:
   - AUTHENTIC ${preferedCuisine} CUISINE
   - Modified to be PCOS-friendly while maintaining cultural authenticity
   - Anti-inflammatory
   - Insulin conscious
   - Rich in fiber
   - Include adequate protein
   - Include healthy fats
   - INCLUDE A SMALL NOTE WHY THIS MEAL IS BETTER FOR PCOS INDIVIDUALS COMAPRED TO THE ORIGINAL RECIPE DO NOT USE "PCOS" IN YOUR RESPONSE

   Note: Each dish should be a genuine ${preferedCuisine} recipe that has been thoughtfully adapted for PCOS management.`;
};

export async function POST(req: Request) {
    try {
        const { messages, dietaryRestrictions, calorieGoal, preferedCuisine} = await req.json();
        const systemMessage = {
            role: "system",
            content: getSystemMessage(dietaryRestrictions, calorieGoal, preferedCuisine )
        };

        const enhancedMessages = [systemMessage, ...messages];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: enhancedMessages,
        });

        return NextResponse.json(completion.choices[0].message);
    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' }, 
            { status: 500 }
        );
    }
}