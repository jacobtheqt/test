import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getSystemMessage = (daysPerWeek: string, timePerDay: string, exersizeConstraints: string): string => {
    return `You are a PCOS health assistant specializing in workout plans. Create a detailed workout plan following these EXACT requirements:

1. Consider that this person has PCOS, so the workouts should be effective but not overly intense to avoid hormonal stress.

2. The workout schedule MUST be exactly ${daysPerWeek} days per week, with each session lasting ${timePerDay} minutes.

3. Available equipment: ${exersizeConstraints}

4. MANDATORY FORMAT FOR RESPONSE:
   
   WORKOUT SPLIT:
   [List which body parts are trained on each day of the week. Example: If it's 2 days - Upper/Lower split. If it's 4 days - Push/Pull/Legs/Full Body, etc.]

   DETAILED WEEKLY SCHEDULE:
   [For each workout day, list:
   - Day 1: [Body parts]
   - Day 2: [Body parts]
   etc.]

   WORKOUT DETAILS:
   [For each day, provide:
   - Exercises (with sets and reps)
   - Rest periods
   - Suggested weights/intensity
   - Time allocation per exercise to fit within the ${timePerDay} minute limit]

   PCOS-SPECIFIC GUIDELINES:
   - Rest recommendations between workouts
   - Signs to watch for overexertion
   - How to modify exercises if needed

   Follow these specific split patterns:
   - For 2 days: Upper/Lower split
   - For 3 days: Push/Pull/Legs
   - For 4 days: Upper/Lower/Upper/Lower or Push/Pull/Legs/Full Body
   - For 5 days: Push/Pull/Legs/Upper/Lower
   - For 6 days: Push/Pull/Legs/Push/Pull/Legs
   
   Ensure the workout intensity and volume are appropriate for someone with PCOS, focusing on compound movements and avoiding excessive cardio which might stress the endocrine system.`;
};

export async function POST(req: Request) {
    try {
        const { messages, daysPerWeek, timePerDay, exersizeConstraints } = await req.json();
        const systemMessage = {
            role: "system",
            content: getSystemMessage(daysPerWeek, timePerDay, exersizeConstraints)
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